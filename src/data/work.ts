/**
 * Every piece on the /work page lives in the list below. This is the only
 * file you need to edit to change the portfolio — the pages read from it.
 *
 * TO EDIT A PIECE
 *   Change the text between the quotes. Titles are placeholders for now.
 *
 * TO FILL IN A BLANK
 *   Fields marked "not known yet" are left out on purpose. Delete the
 *   comment and add the line, e.g.   year: 2025,
 *   Anything you leave out simply doesn't appear on the site — it never
 *   prints "TBD".
 *
 * TO ADD A PIECE
 *   Put the photo in src/assets/work/ and add a block below. `file` must
 *   match the filename exactly. `slug` becomes the web address, so
 *   slug: 'swamp-queen' is the page /work/swamp-queen.
 *
 * TO REORDER THE GRID
 *   Move the blocks around. The grid follows this order, top to bottom.
 *
 * STATUS can be one of three words:
 *   'available' — for sale. Shows the price if there is one, plus Enquire.
 *   'sold'      — shows a Sold mark and no price. Keep sold work here.
 *   'print'     — original not for sale; links to the Prints page instead.
 */

export type WorkStatus = 'available' | 'sold' | 'print';

export interface Piece {
	/** Web address: /work/<slug>. Lowercase, words joined by hyphens. */
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
}

export const work: Piece[] = [
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
