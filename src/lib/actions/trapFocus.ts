import type { Action } from 'svelte/action';

const FOCUSABLE = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

/** Keep Tab focus inside the node, and restore focus to the opener on destroy. */
export const trapFocus: Action<HTMLElement, boolean | undefined> = (node, enabled = true) => {
	let active = enabled !== false;
	const previous = document.activeElement as HTMLElement | null;

	function items(): HTMLElement[] {
		return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
			(el) => el.offsetParent !== null || el === document.activeElement
		);
	}

	function onKeydown(event: KeyboardEvent) {
		if (!active || event.key !== 'Tab') return;
		const list = items();
		if (list.length === 0) {
			event.preventDefault();
			node.focus();
			return;
		}
		const first = list[0];
		const last = list[list.length - 1];
		const current = document.activeElement;

		if (event.shiftKey && (current === first || !node.contains(current))) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && current === last) {
			event.preventDefault();
			first.focus();
		}
	}

	queueMicrotask(() => {
		if (!active) return;
		const list = items();
		(list[0] ?? node).focus({ preventScroll: true });
	});

	node.addEventListener('keydown', onKeydown);

	return {
		update(next) {
			active = next !== false;
		},
		destroy() {
			node.removeEventListener('keydown', onKeydown);
			previous?.focus?.({ preventScroll: true });
		}
	};
};
