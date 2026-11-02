/** One place for everything search engines and link previews read. */
export const site = {
	url: 'https://cock.joshicodes.de',
	name: 'cock',
	title: 'cock — the Svelte 5 and Tailwind 4 component kit',
	description:
		'An open-source Svelte 5 and Tailwind 4 component kit: 70 accessible components, dark mode, theming from three colours and a theme generator.',
	repo: 'https://github.com/JoshiCodes/cock',
	author: { name: 'JoshiCodes', url: 'https://github.com/JoshiCodes' },
	image: '/og.png',
	imageAlt: 'The cock logo, a rooster drawn as the letter c, next to the wordmark.'
};

/**
 * Every path in the sitemap. No `priority`: Google has said for years that it
 * ignores it, and a number nobody reads is a number that can only be wrong.
 */
import { components } from './components/catalog.js';

export const pages = [
	'/',
	'/docs/getting-started',
	'/docs/theming',
	'/docs/utilities',
	'/docs/types',
	'/docs/comparison',
	'/components',
	'/themes',
	...components.map((entry) => `/components/${entry.slug}`)
];
