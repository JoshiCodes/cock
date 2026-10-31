import { pages, site } from '../seo.js';

export const prerender = true;

export function GET() {
	const lastmod = new Date().toISOString().slice(0, 10);
	const urls = pages
		.map(
			({ path, priority }) =>
				`\t<url>\n\t\t<loc>${new URL(path, site.url).href}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t\t<priority>${priority}</priority>\n\t</url>`
		)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
}
