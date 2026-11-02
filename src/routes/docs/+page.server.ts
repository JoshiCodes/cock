import { redirect } from '@sveltejs/kit';

// Nothing links to /docs, but people type it. A real redirect needs the
// server, so this one page is not prerendered.
export const prerender = false;

export function load() {
	redirect(308, '/docs/getting-started');
}
