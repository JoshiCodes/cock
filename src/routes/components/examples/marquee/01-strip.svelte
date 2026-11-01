<script lang="ts">
	import { Badge, Marquee } from '@joshicodes/cock';

	const tags = [
		'SvelteKit',
		'Tailwind 4',
		'Runes',
		'OKLCH',
		'color-mix',
		'TypeScript',
		'Vite',
		'Bun'
	];
</script>

<div class="w-full space-y-4">
	<Marquee gap="0.75rem">
		{#each tags as tag (tag)}
			<Badge variant="outline">{tag}</Badge>
		{/each}
	</Marquee>

	<Marquee gap="0.75rem" direction="right" speed={25}>
		{#each tags as tag (tag)}
			<Badge>{tag}</Badge>
		{/each}
	</Marquee>
</div>
