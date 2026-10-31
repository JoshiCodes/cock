<script lang="ts">
	import { site } from '../seo.js';

	interface Props {
		/** Page title without the site name; leave out for the home page. */
		title?: string;
		description?: string;
		/** Path of this page, used for the canonical URL. */
		path?: string;
		noindex?: boolean;
		/** schema.org objects, written as JSON-LD. */
		structured?: Record<string, unknown>[];
	}

	let {
		title,
		description = site.description,
		path = '/',
		noindex = false,
		structured = []
	}: Props = $props();

	let fullTitle = $derived(title ? `${title} — ${site.name}` : site.title);
	let url = $derived(new URL(path, site.url).href);
	const image = new URL(site.image, site.url).href;

	// Built in parts so the closing tag never appears inside this component's own script.
	const open = '<script type="application/ld+json">';
	const close = '</' + 'script>';
	let jsonLd = $derived(
		// Escaping every "<" means nothing in the data can close the tag early.
		structured.map((data) => open + JSON.stringify(data).replace(/</g, '\\u003c') + close)
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={site.imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{#each jsonLd as script, index (index)}
		{@html script}
	{/each}
</svelte:head>
