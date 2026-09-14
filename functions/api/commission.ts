/** Cloudflare Pages Function — serves at POST /api/commission */
import { handleInquiry, type Env } from '../_inquiry';

export const onRequestPost = (context: { request: Request; env: Env }) =>
	handleInquiry(context, {
		subject: 'Commission request',
		includeSize: true,
		includeAttachments: true,
	});
