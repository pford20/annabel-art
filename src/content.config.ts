import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One painting = one folder: src/content/work/<slug>/
 *   index.md     frontmatter below
 *   catalog.jpg  flat square-on shot, required
 *   insitu.jpg   hung on a wall, originals only
 */

// Fields shared by originals and prints.
const shared = {
	title: z.string(),
	medium: z.string(), // e.g. "Oil on canvas"
	width: z.number().positive(), // inches
	height: z.number().positive(), // inches
	year: z.number().int(),
	price: z.number().nonnegative(), // USD
	status: z.enum(['available', 'sold']).default('available'),
	featured: z.boolean().default(false),
};

const work = defineCollection({
	loader: glob({
		pattern: '*/index.md',
		base: './src/content/work',
		// Folder name is the URL slug: work/blue-hour/index.md -> "blue-hour"
		generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
	}),
	// Splitting on `type` means the error message names the missing field
	// instead of a vague "does not match schema".
	schema: z.discriminatedUnion('type', [
		z.object({
			...shared,
			type: z.literal('original'),
		}),
		z.object({
			...shared,
			type: z.literal('print'),
			// price above = smallest size; sizes lists every option.
			edition: z.number().int().positive(),
			sizes: z
				.array(
					z.object({
						label: z.string(), // e.g. "11 × 14 in"
						price: z.number().nonnegative(),
					})
				)
				.min(1),
		}),
	]),
});

export const collections = { work };
