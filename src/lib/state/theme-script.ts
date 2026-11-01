import { ACCENT_KEY, MODE_KEY, TOKEN_KEY } from './theme-keys.js';

/**
 * Applies the stored theme to <html> before anything paints.
 *
 * Without it the page renders in its default scheme and then corrects itself,
 * which is the white flash every dark-mode site starts out with. It has to run
 * synchronously in <head>, so it is plain ES5 in a string rather than a module.
 */
export const themeScript =
	`(function(){try{` +
	`var d=document.documentElement;` +
	`var m=localStorage.getItem(${JSON.stringify(MODE_KEY)})||'system';` +
	`var dark=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);` +
	`d.classList.toggle('dark',dark);` +
	`var a=localStorage.getItem(${JSON.stringify(ACCENT_KEY)});if(a)d.dataset.accent=a;` +
	`var t=JSON.parse(localStorage.getItem(${JSON.stringify(TOKEN_KEY)})||'{}')[dark?'dark':'light']||{};` +
	`for(var n in t)d.style.setProperty(n,t[n]);` +
	`}catch(e){}})()`;

/** The same thing wrapped in a script tag, for templates that take raw HTML. */
export const themeScriptTag = `<script>${themeScript}</script>`;

/**
 * The slice of SvelteKit's `Handle` this needs. Kept generic and local so the
 * kit does not depend on SvelteKit's types, while still satisfying `Handle`.
 */
type HandleInput<Event, Result> = {
	event: Event;
	resolve: (
		event: Event,
		options?: { transformPageChunk?: (input: { html: string }) => string }
	) => Result;
};

/**
 * SvelteKit hook that injects the script into every page, so `app.html` stays
 * untouched:
 *
 * ```js
 * // src/hooks.server.js
 * export { themeHandle as handle } from '@joshicodes/cock';
 * ```
 *
 * Already have a `handle`? Put it in `sequence(themeHandle, yourHandle)`.
 */
export function themeHandle<Event, Result>({ event, resolve }: HandleInput<Event, Result>): Result {
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			// `<head>` always has a `%sveltekit.head%` after it, so one replace is enough.
			html.replace('<head>', `<head>${themeScriptTag}`)
	});
}
