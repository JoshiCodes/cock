import type { Action } from 'svelte/action';

type Handler = (event: PointerEvent) => void;

export type ClickOutsideParams =
	| Handler
	| {
			handler: Handler;
			/** Presses inside these elements do not count as outside. */
			ignore?: (HTMLElement | null | undefined)[];
	  };

/** Call back when a pointer press lands outside the node. */
export const clickOutside: Action<HTMLElement, ClickOutsideParams> = (node, params) => {
	let current = params;

	function onPointerDown(event: PointerEvent) {
		const target = event.target as Node | null;
		if (!target || node.contains(target)) return;

		const handler = typeof current === 'function' ? current : current.handler;
		const ignore = typeof current === 'function' ? [] : (current.ignore ?? []);
		if (ignore.some((element) => element?.contains(target))) return;

		handler(event);
	}

	// Capture phase, so inner handlers that stop propagation cannot swallow it.
	document.addEventListener('pointerdown', onPointerDown, true);

	return {
		update(next: ClickOutsideParams) {
			current = next;
		},
		destroy() {
			document.removeEventListener('pointerdown', onPointerDown, true);
		}
	};
};
