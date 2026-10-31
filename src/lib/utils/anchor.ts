import type { Action } from 'svelte/action';

export type Placement =
	'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

export interface AnchorParams {
	/** The element the panel should sit next to. */
	to: HTMLElement | null | undefined;
	placement?: Placement;
	/** Gap between anchor and panel, in pixels. */
	offset?: number;
	/** Minimum distance to the viewport edge. */
	padding?: number;
}

const origins: Record<string, string> = {
	top: 'bottom center',
	'top-start': 'bottom left',
	'top-end': 'bottom right',
	bottom: 'top center',
	'bottom-start': 'top left',
	'bottom-end': 'top right',
	left: 'right center',
	right: 'left center'
};

function place(panel: HTMLElement, params: AnchorParams) {
	const anchor = params.to;
	if (!anchor || !anchor.isConnected) return;

	const offset = params.offset ?? 8;
	const padding = params.padding ?? 8;
	const requested = params.placement ?? 'bottom-start';
	const [requestedSide, align] = requested.split('-') as [
		'top' | 'bottom' | 'left' | 'right',
		'start' | 'end' | undefined
	];

	const box = anchor.getBoundingClientRect();
	const width = panel.offsetWidth;
	const height = panel.offsetHeight;
	const viewportWidth = document.documentElement.clientWidth;
	const viewportHeight = document.documentElement.clientHeight;

	let side = requestedSide;

	// Flip to the opposite side when the preferred one does not fit but the other does.
	const fitsBelow = box.bottom + offset + height <= viewportHeight - padding;
	const fitsAbove = box.top - offset - height >= padding;
	const fitsRight = box.right + offset + width <= viewportWidth - padding;
	const fitsLeft = box.left - offset - width >= padding;

	if (side === 'bottom' && !fitsBelow && fitsAbove) side = 'top';
	else if (side === 'top' && !fitsAbove && fitsBelow) side = 'bottom';
	else if (side === 'right' && !fitsRight && fitsLeft) side = 'left';
	else if (side === 'left' && !fitsLeft && fitsRight) side = 'right';

	let top: number;
	let left: number;

	if (side === 'top' || side === 'bottom') {
		top = side === 'bottom' ? box.bottom + offset : box.top - offset - height;
		left =
			align === 'start'
				? box.left
				: align === 'end'
					? box.right - width
					: box.left + box.width / 2 - width / 2;
	} else {
		left = side === 'right' ? box.right + offset : box.left - offset - width;
		top = box.top + box.height / 2 - height / 2;
	}

	left = Math.min(Math.max(padding, left), Math.max(padding, viewportWidth - width - padding));
	top = Math.min(Math.max(padding, top), Math.max(padding, viewportHeight - height - padding));

	panel.style.left = `${Math.round(left)}px`;
	panel.style.top = `${Math.round(top)}px`;
	panel.style.transformOrigin = origins[align ? `${side}-${align}` : side] ?? 'top left';
}

/**
 * Pin a fixed-position panel to another element. Re-runs on scroll, resize and
 * whenever the panel itself changes size, so it survives content swaps.
 */
export const anchored: Action<HTMLElement, AnchorParams> = (node, params) => {
	let current = params;
	node.style.position = 'fixed';

	const update = () => place(node, current);
	const observer = new ResizeObserver(update);

	update();
	const frame = requestAnimationFrame(update);

	window.addEventListener('scroll', update, true);
	window.addEventListener('resize', update);
	observer.observe(node);
	if (current.to) observer.observe(current.to);

	return {
		update(next: AnchorParams) {
			if (next.to !== current.to) {
				observer.disconnect();
				observer.observe(node);
				if (next.to) observer.observe(next.to);
			}
			current = next;
			update();
		},
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', update, true);
			window.removeEventListener('resize', update);
			observer.disconnect();
		}
	};
};
