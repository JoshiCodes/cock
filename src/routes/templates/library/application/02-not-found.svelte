<!-- A 404 page where the number is plotted onto the grid itself, cell by cell, with a short way back. -->
<script lang="ts" module>
	export const meta = { height: 560 };
</script>

<script lang="ts">
	import { Button, GridBackground } from '@joshicodes/cock';

	// 4, 0, 4 on a 3 × 5 grid each; 1 is a filled cell.
	const glyphs = {
		'4': ['101', '101', '111', '001', '001'],
		'0': ['111', '101', '101', '101', '111']
	};
	const cells = ['4', '0', '4'].map((digit) => glyphs[digit as keyof typeof glyphs].join(''));
</script>

<GridBackground
	size={24}
	fade="radial"
	class="flex min-h-[34rem] flex-col items-center justify-center bg-bg px-6 py-16 text-center"
>
	<div class="flex gap-6" aria-hidden="true">
		{#each cells as glyph, d (d)}
			<div class="grid grid-cols-3">
				{#each glyph as bit, i (i)}
					<!-- Same 24px pitch as the grid behind it. -->
					<span class="size-6 p-px"
						><span class="block size-full {bit === '1' ? 'bg-accent' : ''}"></span></span
					>
				{/each}
			</div>
		{/each}
	</div>

	<h1 class="mt-12 text-3xl font-semibold tracking-tight text-fg">This page went off the grid</h1>
	<p class="mt-3 max-w-md text-fg-muted">
		The link may be old, or the page moved somewhere else. Error 404.
	</p>
	<div class="mt-8 flex flex-wrap justify-center gap-3">
		<Button href="/">Back to the start</Button>
		<Button href="/" variant="ghost">Search the docs</Button>
	</div>
</GridBackground>
