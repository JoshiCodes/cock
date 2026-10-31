<script lang="ts">
	interface Swatch {
		name: string;
		token: string;
		className: string;
		border?: boolean;
	}

	let { swatches }: { swatches: Swatch[] } = $props();
</script>

<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
	{#each swatches as swatch (swatch.token)}
		<div class="overflow-hidden rounded-md border border-border">
			<div class="{swatch.className} h-14 w-full"></div>
			<div class="space-y-0.5 bg-surface px-3 py-2">
				<p class="text-xs font-medium text-fg">{swatch.name}</p>
				<p class="font-mono text-[0.625rem] text-fg-subtle">{swatch.token}</p>
			</div>
		</div>
	{/each}
</div>
