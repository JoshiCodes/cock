import { pages, site } from '../seo.js';
import { lastmod } from '../lastmod.server.js';

export const prerender = true;

export function GET() {
	const urls = pages.map((path) => {
		const changed = lastmod(path);
		return [
			'\t<url>',
			`\t\t<loc>${new URL(path, site.url).href}</loc>`,
			// Left out entirely when git could not date the page: a wrong date is
			// worse than none, because it is the one that gets believed.
			...(changed ? [`\t\t<lastmod>${changed}</lastmod>`] : []),
			// Component pages have their own preview image; listing it gets it into image search.
			...(path.startsWith('/components/')
				? [
						`\t\t<image:image><image:loc>${new URL(`/og/${path.slice('/components/'.length)}.png`, site.url).href}</image:loc></image:image>`
					]
				: []),
			'\t</url>'
		].join('\n');
	});

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
}
