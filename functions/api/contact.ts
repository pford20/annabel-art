/** Cloudflare Pages Function — serves at POST /api/contact */
import { handleInquiry, type Env } from '../_inquiry';

export const onRequestPost = (context: { request: Request; env: Env }) =>
	handleInquiry(context, { subject: 'Contact form' });
