import { stats } from '../../facts.js';

/** The comparison, shared by /docs/comparison and the home page. `pick` finishes "Pick it when…". */
export const rivals = [
	{
		name: 'cock',
		href: '/',
		delivery: 'npm dependency',
		styling: 'Tailwind 4, included',
		theming: 'Three CSS variables, the rest mixed with color-mix',
		scope: `${stats.components} components, including motion effects`,
		pick: 'you want styled components you can upgrade, themed from three colours.'
	},
	{
		name: 'shadcn-svelte',
		href: 'https://www.shadcn-svelte.com',
		delivery: 'A CLI copies the source into your repo',
		styling: 'Tailwind, yours to edit after copying',
		theming: 'CSS variables in the copied files',
		scope: 'Large, built on Bits UI',
		pick: 'you want to own every component and rewrite it freely.'
	},
	{
		name: 'Bits UI',
		href: 'https://bits-ui.com',
		delivery: 'npm dependency',
		styling: 'None. Headless by design',
		theming: 'Whatever you write',
		scope: 'Behaviour and accessibility primitives',
		pick: 'you want the behaviour and will bring your own look.'
	},
	{
		name: 'Skeleton',
		href: 'https://www.skeleton.dev',
		delivery: 'npm dependency',
		styling: 'Tailwind, with its own utility layer',
		theming: 'A theme engine with prebuilt themes',
		scope: 'Design system plus components, several frameworks',
		pick: 'you want a full design system that also covers React.'
	}
];
