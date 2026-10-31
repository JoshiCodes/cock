<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '#lib';

	let missing = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{page.status} — cock</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-2xl px-5 py-28 text-center">
	<p class="text-sm font-medium text-accent tabular-nums">{page.status}</p>
	<h1 class="mt-3 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
		{missing ? 'This page pulled out early.' : 'Something went limp.'}
	</h1>
	<p class="mx-auto mt-5 max-w-md text-lg leading-relaxed text-fg-muted">
		{#if missing}
			It happens. The rest of the kit is still here, and it is a lot bigger than this page.
		{:else}
			{page.error?.message ?? 'The server had a moment.'} Give it a second and try again.
		{/if}
	</p>
	<div class="mt-9 flex flex-wrap justify-center gap-3">
		<Button href="/">Back to the components</Button>
		<Button variant="outline" href="/themes">Generate a theme</Button>
	</div>
</div>
