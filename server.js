/**
 * Runs the built site with the headers it should always carry.
 *
 * adapter-node's own entry (`node build`) serves prerendered pages straight
 * from disk, before any SvelteKit hook runs, so headers set in hooks.server.ts
 * would never reach them. Wrapping its handler is the documented way round:
 * https://svelte.dev/docs/kit/adapter-node#Custom-server
 *
 * The full Content-Security-Policy, with a hash per inline script, is written
 * by SvelteKit (see `csp` in vite.config.ts): as a <meta> tag on prerendered
 * pages, as a header on the rest. The header here only adds what a meta tag
 * cannot carry. Browsers enforce every policy they are given, so the two add up.
 */
import { createServer } from 'node:http';
import { handler } from './build/handler.js';

const headers = {
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	'Content-Security-Policy': "frame-ancestors 'none'; object-src 'none'; base-uri 'self'"
};

const server = createServer((req, res) => {
	for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
	handler(req, res, () => {
		res.statusCode = 404;
		res.end('Not found');
	});
});

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 3000);

server.listen(port, host, () => console.log(`Listening on http://${host}:${port}`));

// Docker stops the container with SIGTERM; finish open requests, then leave.
for (const signal of ['SIGTERM', 'SIGINT']) {
	process.on(signal, () => server.close(() => process.exit(0)));
}
