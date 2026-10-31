/**
 * Keyboard shortcuts written as strings: 'mod+k', 'shift+/', 'alt+enter'.
 * `mod` means ⌘ on Apple devices and Ctrl everywhere else.
 */

function isApple(): boolean {
	if (typeof navigator === 'undefined') return false;
	return /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
}

export function matchesHotkey(event: KeyboardEvent, combo: string): boolean {
	const parts = combo.toLowerCase().split('+');
	const key = parts.pop();
	const has = (modifier: string) => parts.includes(modifier);
	const apple = isApple();

	const meta = has('meta') || (has('mod') && apple);
	const ctrl = has('ctrl') || (has('mod') && !apple);

	return (
		event.key.toLowerCase() === key &&
		event.metaKey === meta &&
		event.ctrlKey === ctrl &&
		event.shiftKey === has('shift') &&
		event.altKey === has('alt')
	);
}

/** Listen on the window. Returns a function that removes the listener. */
export function onHotkey(combo: string, handler: (event: KeyboardEvent) => void): () => void {
	const listener = (event: KeyboardEvent) => {
		if (!matchesHotkey(event, combo)) return;
		event.preventDefault();
		handler(event);
	};
	window.addEventListener('keydown', listener);
	return () => window.removeEventListener('keydown', listener);
}

/** 'mod+k' → '⌘K' on a Mac, 'Ctrl+K' elsewhere. Call it in the browser. */
export function formatHotkey(combo: string): string {
	const apple = isApple();
	const labels: Record<string, string> = apple
		? { mod: '⌘', meta: '⌘', ctrl: '⌃', shift: '⇧', alt: '⌥', enter: '↵', escape: 'Esc' }
		: {
				mod: 'Ctrl',
				meta: 'Win',
				ctrl: 'Ctrl',
				shift: 'Shift',
				alt: 'Alt',
				enter: 'Enter',
				escape: 'Esc'
			};

	return combo
		.split('+')
		.map((part) => labels[part.toLowerCase()] ?? part.toUpperCase())
		.join(apple ? '' : '+');
}
