/**
 * Cloudflare Pages Function — serves at POST /api/commission
 * (the `functions/` folder maps to the site root).
 *
 * STATUS: stub. Until RESEND_API_KEY is set it accepts the form, logs the
 * inquiry, and returns success without emailing. Once the key exists in the
 * Cloudflare dashboard it sends for real. The Resend call below is written
 * but has never run — verify it after creating the account.
 */

interface Env {
	/** Cloudflare > Pages > Settings > Environment variables. Never in code. */
	RESEND_API_KEY?: string;
	/** Verified sender, e.g. "Annabel Art <commissions@annabelart.com>" */
	COMMISSION_FROM?: string;
	/** Where inquiries land — Annabel's inbox. */
	COMMISSION_TO?: string;
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // Resend caps the whole request ~40MB

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export async function onRequestPost(context: {
	request: Request;
	env: Env;
}): Promise<Response> {
	const { request, env } = context;
	const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');

	const reply = (status: number, message: string) =>
		wantsJson
			? new Response(JSON.stringify({ ok: status < 400, message }), {
					status,
					headers: { 'Content-Type': 'application/json' },
				})
			: new Response(
					`<!doctype html><meta charset="utf-8"><title>Commissions</title><p>${escapeHtml(message)}</p><p><a href="/commissions">Back</a></p>`,
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
	const size = String(form.get('size') ?? '').trim();
	const message = String(form.get('message') ?? '').trim();

	if (!name || !email || !message) {
		return reply(400, 'Please fill in your name, email, and message.');
	}

	// Collect optional reference images, skipping anything oversized.
	const attachments: { filename: string; content: string }[] = [];
	let totalBytes = 0;
	const skipped: string[] = [];

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

	const body = [
		`Name: ${name}`,
		`Email: ${email}`,
		`Size: ${size || '(not given)'}`,
		'',
		message,
		skipped.length ? `\n(Attachments too large to include: ${skipped.join(', ')})` : '',
	]
		.join('\n')
		.trim();

	// No key yet — accept the inquiry so the form is testable, but say so loudly.
	if (!env.RESEND_API_KEY) {
		console.log('[commission] STUB — no RESEND_API_KEY set. Inquiry received:\n' + body);
		return reply(200, 'Thank you. Your request is in.');
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: env.COMMISSION_FROM ?? 'onboarding@resend.dev',
			to: env.COMMISSION_TO ?? 'onboarding@resend.dev',
			reply_to: email,
			subject: `Commission request — ${name}`,
			text: body,
			attachments,
		}),
	});

	if (!response.ok) {
		console.error('[commission] Resend failed:', response.status, await response.text());
		return reply(502, 'That could not be sent just now. Please try again shortly.');
	}

	return reply(200, 'Thank you. Your request is in.');
}
