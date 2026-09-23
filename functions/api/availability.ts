/**
 * Cloudflare Pages Function — serves GET /api/availability
 *
 * Returns which paintings are still for sale, as { slug: true | false }.
 *
 * How it knows: every piece with a `buyUrl` in src/data/work.ts points at a
 * Stripe Payment Link. When a painting sells, deactivating that link in
 * Stripe is enough — this reads the links' `active` flag and the site marks
 * the piece Sold on its own. Marking it sold in work.ts is still the
 * permanent fix; this is the safety net between the sale and that edit.
 *
 * Fails open on purpose. No key, a Stripe outage, a link it can't find —
 * anything unexpected and every piece comes back available, so the worst
 * case is the site looks exactly as it does today.
 */
import { work, type Piece } from '../../src/data/work';

export interface Env {
	/**
	 * Stripe restricted key with READ access to Payment Links, nothing else.
	 * Cloudflare > Pages > Settings > Environment variables. Never in code.
	 */
	STRIPE_RESTRICTED_KEY?: string;
}

/** How long browsers and the edge may reuse this answer. */
const CACHE_SECONDS = 60;

/** Stripe returns at most 100 per page; we page until it says there are no more. */
const PAGE_SIZE = 100;
const MAX_PAGES = 10; // 1,000 links is far past anything this site will have

interface StripePaymentLink {
	id: string;
	url: string;
	active: boolean;
}

interface StripeListResponse {
	data?: StripePaymentLink[];
	has_more?: boolean;
}

/** Trailing slashes and stray whitespace shouldn't decide whether a link matches. */
function normalizeUrl(url: string): string {
	return url.trim().replace(/\/+$/, '');
}

/** Every piece that points at a Stripe link, treated as available. */
function allAvailable(pieces: Piece[]): Record<string, boolean> {
	const result: Record<string, boolean> = {};
	for (const piece of pieces) {
		if (piece.buyUrl) result[piece.slug] = true;
	}
	return result;
}

/**
 * Reads every Payment Link on the account and maps normalized URL -> active.
 * Exported so it can be tested against a fake fetch.
 */
export async function fetchPaymentLinkStatus(
	key: string,
	fetchImpl: typeof fetch = fetch
): Promise<Map<string, boolean>> {
	const status = new Map<string, boolean>();
	let startingAfter: string | undefined;

	for (let page = 0; page < MAX_PAGES; page += 1) {
		const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
		if (startingAfter) params.set('starting_after', startingAfter);

		const response = await fetchImpl(`https://api.stripe.com/v1/payment_links?${params}`, {
			headers: { Authorization: `Bearer ${key}` },
		});

		if (!response.ok) {
			throw new Error(`Stripe responded ${response.status}`);
		}

		const body = (await response.json()) as StripeListResponse;
		const links = body.data ?? [];
		for (const link of links) {
			if (link && typeof link.url === 'string') {
				status.set(normalizeUrl(link.url), link.active !== false);
			}
		}

		if (!body.has_more || links.length === 0) break;
		startingAfter = links[links.length - 1].id;
	}

	return status;
}

/**
 * Turns the piece list plus Stripe's answer into { slug: available }.
 * A link we can't find is treated as available — never guess a piece sold.
 * Exported for testing.
 */
export function mapAvailability(
	pieces: Piece[],
	status: Map<string, boolean>
): Record<string, boolean> {
	const result: Record<string, boolean> = {};
	for (const piece of pieces) {
		if (!piece.buyUrl) continue;
		const active = status.get(normalizeUrl(piece.buyUrl));
		result[piece.slug] = active === undefined ? true : active;
	}
	return result;
}

function json(body: Record<string, boolean>, extraHeaders: Record<string, string> = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
			...extraHeaders,
		},
	});
}

export const onRequestGet = async (context: { env: Env }): Promise<Response> => {
	const key = context.env.STRIPE_RESTRICTED_KEY;

	if (!key) {
		// Expected before the key is added in Cloudflare — not an error.
		return json(allAvailable(work), { 'X-Availability-Source': 'no-key' });
	}

	try {
		const status = await fetchPaymentLinkStatus(key);
		return json(mapAvailability(work, status), { 'X-Availability-Source': 'stripe' });
	} catch (error) {
		console.error('[availability] Stripe lookup failed:', error);
		return json(allAvailable(work), { 'X-Availability-Source': 'error' });
	}
};
