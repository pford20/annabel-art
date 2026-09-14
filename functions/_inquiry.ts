/**
 * Shared inquiry handling for the Contact and Commissions forms.
 *
 * Filename starts with "_" so Cloudflare Pages treats it as a module, not a
 * route. Both forms email through Resend.
 *
 * STATUS: live. RESEND_API_KEY is set in Cloudflare, so inquiries are emailed
 * for real. If the key is ever missing the form still accepts the message and
 * logs it instead of sending. Mail goes out from hello@annabelart.online and
 * lands at the same address, which Cloudflare Email Routing forwards on to
 * Annabel. To change who receives inquiries, change that forwarding rule in
 * Cloudflare — not this file.
 */

export interface Env {
	/** Cloudflare > Pages > Settings > Environment variables. Never in code. */
	RESEND_API_KEY?: string;
	/**
	 * Overrides the sender. Only needed to send from a different verified
	 * domain; otherwise leave unset and INQUIRY_FROM_DEFAULT is used.
	 */
	INQUIRY_FROM?: string;
	/**
	 * Overrides the recipient. Normally unset — INQUIRY_TO_DEFAULT below goes
	 * to hello@annabelart.online, and Cloudflare Email Routing decides where
	 * that actually lands.
	 */
	INQUIRY_TO?: string;
}

export interface InquiryOptions {
	/** Email subject prefix, e.g. "Commission request" */
	subject: string;
	/** Include the canvas size field (commissions only). */
	includeSize?: boolean;
	/** Accept reference image uploads (commissions only). */
	includeAttachments?: boolean;
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // Resend caps the whole request ~40MB

/** Verified sending domain in Resend. */
const INQUIRY_FROM_DEFAULT = 'Annabel Art <hello@annabelart.online>';

/**
 * Where inquiries are sent. Cloudflare Email Routing forwards this address on
 * to Annabel, so changing who reads the inquiries is a Cloudflare setting, not
 * a code change.
 */
const INQUIRY_TO_DEFAULT = 'hello@annabelart.online';

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export async function handleInquiry(
	context: { request: Request; env: Env },
	options: InquiryOptions
): Promise<Response> {
	const { request, env } = context;
	const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');

	const reply = (status: number, message: string) =>
		wantsJson
			? new Response(JSON.stringify({ ok: status < 400, message }), {
					status,
					headers: { 'Content-Type': 'application/json' },
				})
			: new Response(
					`<!doctype html><meta charset="utf-8"><title>${escapeHtml(options.subject)}</title><p>${escapeHtml(message)}</p><p><a href="/">Back</a></p>`,
					{ status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
				);

	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return reply(400, 'That form could not be read.');
	}

	const name = String(form.get('name') ?? '').trim();
	const email = String(form.get('email') ?? '').trim();
	const message = String(form.get('message') ?? '').trim();
	const size = String(form.get('size') ?? '').trim();

	if (!name || !email || !message) {
		return reply(400, 'Please fill in your name, email, and message.');
	}

	// Optional reference images, skipping anything oversized.
	const attachments: { filename: string; content: string }[] = [];
	const skipped: string[] = [];

	if (options.includeAttachments) {
		let totalBytes = 0;
		for (const entry of form.getAll('references')) {
			if (!(entry instanceof File) || entry.size === 0) continue;
			if (totalBytes + entry.size > MAX_ATTACHMENT_BYTES) {
				skipped.push(entry.name);
				continue;
			}
			totalBytes += entry.size;
			const bytes = new Uint8Array(await entry.arrayBuffer());
			let binary = '';
			for (const byte of bytes) binary += String.fromCharCode(byte);
			attachments.push({ filename: entry.name, content: btoa(binary) });
		}
	}

	const body = [
		`Name: ${name}`,
		`Email: ${email}`,
		options.includeSize ? `Size: ${size || '(not given)'}` : '',
		'',
		message,
		skipped.length ? `\n(Attachments too large to include: ${skipped.join(', ')})` : '',
	]
		.filter((line, index) => line !== '' || index > 2)
		.join('\n')
		.trim();

	// No key yet — accept the inquiry so the form is testable, but say so loudly.
	if (!env.RESEND_API_KEY) {
		console.log(`[${options.subject}] STUB — no RESEND_API_KEY set. Received:\n${body}`);
		return reply(200, 'Thank you. Your message is in.');
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: env.INQUIRY_FROM ?? INQUIRY_FROM_DEFAULT,
			to: env.INQUIRY_TO ?? INQUIRY_TO_DEFAULT,
			// The address typed into the form, so Reply goes to the sender.
			reply_to: email,
			subject: `${options.subject} — ${name}`,
			text: body,
			attachments,
		}),
	});

	if (!response.ok) {
		console.error(`[${options.subject}] Resend failed:`, response.status, await response.text());
		return reply(502, 'That could not be sent just now. Please try again shortly.');
	}

	return reply(200, 'Thank you. Your message is in.');
}
