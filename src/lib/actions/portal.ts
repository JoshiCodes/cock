import type { Action } from 'svelte/action';

/** Move a node to the end of <body> (or any selector/element) while it lives. */
export const portal: Action<HTMLElement, string | HTMLElement | undefined> = (node, target) => {
	let current: HTMLElement | null = null;

	function mount(to: string | HTMLElement | undefined) {
		const el =
			typeof to === 'string' ? document.querySelector<HTMLElement>(to) : (to ?? document.body);
		current = el ?? document.body;
		current.appendChild(node);
	}

	mount(target);

	return {
		update(next) {
			mount(next);
		},
		destroy() {
			if (node.parentNode) node.parentNode.removeChild(node);
			current = null;
		}
	};
};
