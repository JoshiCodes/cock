import { site } from '../seo.js';

export const prerender = true;

export function GET() {
	// The llms.txt lines are a comment: nothing in robots.txt reads them as a
	// directive, but anyone pointing a crawler here will see where the plain
	// text lives.
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${site.url}/sitemap.xml`,
		'',
		`# Docs as plain text: ${site.url}/llms.txt`,
		`# Every component and prop: ${site.url}/llms-full.txt`,
		''
	].join('\n');

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
