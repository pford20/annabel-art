/**
 * Image lookup for the paintings. This lives apart from work.ts because it
 * uses a Vite-only feature (import.meta.glob) that can't run on Cloudflare's
 * servers — and functions/api/availability.ts needs to import work.ts there.
 * Keeping the two separate means the piece list stays plain TypeScript.
 */
import type { Piece } from './work';

/**
 * Astro optimizes images only when they're imported from src/, so the photos
 * live in src/assets/work/ rather than public/. This picks them all up at
 * build time and keys them by filename.
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
