/** One place for everything search engines and link previews read. */
export const site = {
	url: 'https://cock.joshicodes.de',
	name: 'cock',
	title: 'cock — the Svelte 5 and Tailwind 4 component kit',
	description:
		'An open-source Svelte 5 and Tailwind 4 component kit: 63 accessible components, dark mode, theming from three colours and a theme generator.',
	repo: 'https://github.com/JoshiCodes/cock',
	author: { name: 'JoshiCodes', url: 'https://github.com/JoshiCodes' },
	image: '/og.png',
	imageAlt: 'The cock logo, a rooster drawn as the letter c, next to the wordmark.'
};

/** Everything that belongs in the sitemap, built from the component catalog. */
import { components } from './components/catalog.js';

export const pages = [
	{ path: '/', priority: 1 },
	{ path: '/docs/getting-started', priority: 0.9 },
	{ path: '/docs/theming', priority: 0.9 },
	{ path: '/docs/comparison', priority: 0.7 },
	{ path: '/components', priority: 0.9 },
	{ path: '/themes', priority: 0.8 },
	...components.map((entry) => ({ path: `/components/${entry.slug}`, priority: 0.6 }))
];
