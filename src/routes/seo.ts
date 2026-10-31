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

/** Pages listed in the sitemap. */
export const pages = [
	{ path: '/', priority: 1 },
	{ path: '/themes', priority: 0.8 }
];
