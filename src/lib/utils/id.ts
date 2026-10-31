let counter = 0;

/** Stable-enough unique id for wiring `aria-*` attributes together. */
export function uid(prefix = 'ck'): string {
	counter += 1;
	return `${prefix}-${counter.toString(36)}`;
}
