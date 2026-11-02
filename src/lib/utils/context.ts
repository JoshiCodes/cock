/**
 * Context keys for the compound components.
 *
 * Deliberately plain strings in a plain module: symbols defined inside a
 * `.svelte` module script lose their identity whenever the module is evaluated
 * twice (hot reloads, duplicated dependency instances), which silently breaks
 * `getContext` for every child.
 */
export const ACCORDION = 'ck:accordion';
export const MENU = 'ck:menu';
export const NAVBAR = 'ck:navbar';
export const RADIO_GROUP = 'ck:radio-group';
export const RESIZABLE = 'ck:resizable';
export const TABS = 'ck:tabs';

import { getContext } from 'svelte';

/** Read a compound-component context, with a readable error if it is missing. */
export function requireContext<T>(key: string, child: string, parent: string): T {
	const context = getContext<T | undefined>(key);
	if (!context) {
		throw new Error(`<${child}> must be rendered inside <${parent}>.`);
	}
	return context;
}
