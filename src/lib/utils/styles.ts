/** Shared style fragments so every component rings and disables the same way. */

export const focusRing =
	'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/** Focus ring that sits inside the element — for inputs and other bordered boxes. */
export const focusRingInset =
	'outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25';

export const disabled = 'disabled:pointer-events-none disabled:opacity-50';

export const transition =
	'transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-150 ease-out';
