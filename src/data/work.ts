/**
 * Every piece on the /portfolio page lives in the list below. This is the only
 * file you need to edit to change the portfolio — the pages read from it.
 *
 * TO ADD A NEW PAINTING FOR SALE
 *   1. Put the photo in src/assets/work/ — e.g. saltwater-rodeo.jpg
 *   2. Copy an existing block below and paste it where you want it in the
 *      list. The grid runs top to bottom, so the top block shows first.
 *   3. Fill it in:
 *          slug:   'saltwater-rodeo'          the web address, /portfolio/saltwater-rodeo
 *          file:   'saltwater-rodeo.jpg'      must match the filename exactly
 *          title:  'Saltwater Rodeo'
 *          medium: 'Acrylic on canvas'
 *          size:   '24 × 36 in'
 *          status: 'available'
 *          price:  1400                       numbers only — no $ and no comma
 *   4. When you have a Stripe payment link for it, add one more line:
 *          buyUrl: 'https://buy.stripe.com/...'
 *      That turns on the Buy button. Until then the page shows the price
 *      and an Enquire button, which is fine — nothing looks broken.
 *
 * WHEN A PAINTING SELLS
 *   Change status to 'sold' and delete its price and buyUrl lines. The piece
 *   stays on the site with a Sold mark and no price. Never delete sold work.
 *
 * TO FILL IN A BLANK
 *   Fields marked "not known yet" are left out on purpose. Delete the comment
 *   and add the line, e.g.   year: 2025,
 *   Anything you leave out simply doesn't appear — it never prints "TBD".
 *
 * TO REORDER THE GRID
 *   Move the blocks around. The grid follows this order, top to bottom.
 *
 * STATUS can be one of three words:
 *   'available' — for sale. Shows the price if there is one, and a Buy button
 *                 if there is a buyUrl. Otherwise price plus Enquire.
 *   'sold'      — shows a Sold mark and no price. Keep sold work here.
 *   'print'     — original not for sale; links to the Prints page instead.
 */

export type WorkStatus = 'available' | 'sold' | 'print';

export interface Piece {
	/** Web address: /portfolio/<slug>. Lowercase, words joined by hyphens. */
	slug: string;
	/** Filename inside src/assets/work/ */
	file: string;
	title: string;
	/** Year painted, e.g. 2025 */
	year?: number;
	/** e.g. 'Acrylic on canvas' */
	medium?: string;
	/** Canvas size as you'd say it, e.g. '24 × 36 in' */
	size?: string;
	status: WorkStatus;
	/** Price in US dollars, numbers only: 1200 not "$1,200" */
	price?: number;
	/**
	 * Stripe payment link, e.g. 'https://buy.stripe.com/...'. Add this and an
	 * available piece gets a Buy button; leave it off and it shows Enquire.
	 */
	buyUrl?: string;
}

export const work: Piece[] = [
	{
		slug: 'seahorse-cowgirl',
		file: 'seahorse-cowgirl.jpg',
		title: 'Seahorse Cowgirl',
		medium: 'Acrylic on canvas',
		size: '24 × 30 in',
		status: 'available',
		price: 1200,
		buyUrl: 'https://buy.stripe.com/bJe6oAcN4h1LerjcAT8ww00',
		// year not known yet
	},
	{
		slug: 'saltwater-rodeo',
		file: 'saltwater-rodeo.jpg',
		title: 'Saltwater Rodeo',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'available',
		price: 1400,
		buyUrl: 'https://buy.stripe.com/4gM5kwfZgaDn1Ex8kD8ww01',
		// year not known yet
	},
	{
		slug: 'lost-in-the-palms',
		file: 'lost-in-the-palms.jpg',
		title: 'Lost in the Palms',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'thoughts-at-dusk',
		file: 'thoughts-at-dusk.jpg',
		title: 'Thoughts at Dusk',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'alligator-cowgirl',
		file: 'alligator-cowgirl.jpg',
		title: 'Alligator Cowgirl',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'swamp-queen',
		file: 'swamp-queen.jpg',
		title: 'Swamp Queen',
		medium: 'Acrylic on canvas',
		size: '36 × 24 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'fragments-of-a-dream',
		file: 'fragments-of-a-dream.jpg',
		title: 'Fragments of a Dream',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'about-shuckin-time',
		file: 'about-shuckin-time.jpg',
		title: 'About Shuckin’ Time',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'blooms-and-blues',
		file: 'blooms-and-blues.jpg',
		title: 'Blooms and Blues',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'afterhours',
		file: 'afterhours.jpg',
		title: 'Afterhours',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'holographic-mermaid',
		file: 'holographic-mermaid.jpg',
		title: 'Holographic Mermaid',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
	{
		slug: 'in-between-the-scales',
		file: 'in-between-the-scales.jpg',
		title: 'In Between the Scales',
		medium: 'Acrylic on canvas',
		size: '24 × 36 in',
		status: 'sold',
		// year not known yet
	},
];

/* ------------------------------------------------------------------ */
/* Helpers used by the pages. You shouldn't need to change these.      */
/* ------------------------------------------------------------------ */

/**
 * Astro optimizes images only when they're imported from src/, so the
 * photos live in src/assets/work/ rather than public/. This picks them all
 * up at build time and keys them by filename.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/work/*.jpg', {
	eager: true,
});

export function imageFor(piece: Piece): ImageMetadata {
	const match = files[`../assets/work/${piece.file}`];
	if (!match) {
		throw new Error(
			`No image found for "${piece.title}". Expected src/assets/work/${piece.file} — ` +
				`check the spelling of "file" in src/data/work.ts.`
		);
	}
	return match.default;
}

/** Screen-reader description, built from the title. */
export function altFor(piece: Piece): string {
	return `${piece.title}, a painting by Annabel`;
}

/** 1200 -> "$1,200". Whole dollars, no cents. */
export function formatPrice(price: number): string {
	return price.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	});
}

/** The caption under each piece: "Title · Acrylic on canvas · 24 × 36 in · 2025",
 *  skipping anything not filled in yet. */
export function captionParts(piece: Piece): string[] {
	return [piece.medium, piece.size, piece.year?.toString()].filter(
		(part): part is string => Boolean(part)
	);
}

/**
 * Everything for sale, newest first. "Newest" is just the order of the list
 * above, so a new painting added at the top leads the shop.
 */
export const availableWork: Piece[] = work.filter((piece) => piece.status === 'available');

/**
 * Gallery order for /portfolio: everything for sale first, then the rest,
 * each group keeping the order of the list above. Reordering blocks above
 * still works — this only guarantees available pieces lead.
 */
export const galleryWork: Piece[] = [
	...availableWork,
	...work.filter((piece) => piece.status !== 'available'),
];

/** "Acrylic on canvas · 24 × 36 in" — skips anything not filled in yet. */
export function shortCaption(piece: Piece): string {
	return captionParts(piece).join(' · ');
}
