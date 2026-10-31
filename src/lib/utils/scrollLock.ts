let locks = 0;
let previousOverflow = '';
let previousPadding = '';

/** Freeze body scrolling while an overlay is open. Reference counted. */
export function lockScroll(): () => void {
	if (typeof document === 'undefined') return () => {};

	if (locks === 0) {
		const body = document.body;
		const scrollbar = window.innerWidth - document.documentElement.clientWidth;
		previousOverflow = body.style.overflow;
		previousPadding = body.style.paddingRight;
		body.style.overflow = 'hidden';
		if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
	}
	locks += 1;

	let released = false;
	return () => {
		if (released) return;
		released = true;
		locks -= 1;
		if (locks === 0) {
			document.body.style.overflow = previousOverflow;
			document.body.style.paddingRight = previousPadding;
		}
	};
}
