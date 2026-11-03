<!-- The tone prop picks a theme color, so it follows light and dark mode. The color prop takes anything CSS does. -->
<script lang="ts">
	import { Rating } from '@joshicodes/cock';

	const tones = ['warning', 'accent', 'success', 'danger', 'neutral'] as const;
	const custom = ['#e11d48', '#0ea5e9', 'oklch(0.7 0.17 60)'];
</script>

<div class="grid gap-x-10 gap-y-6 sm:grid-cols-2">
	<div class="space-y-3">
		<p class="text-sm font-medium text-fg">Theme colors</p>
		{#each tones as tone (tone)}
			<div class="flex items-center gap-3">
				<Rating value={3.5} readonly {tone} label="{tone} rating" />
				<code class="font-mono text-xs text-fg-muted">tone="{tone}"</code>
			</div>
		{/each}
	</div>
	<div class="space-y-3">
		<p class="text-sm font-medium text-fg">Your own</p>
		{#each custom as color (color)}
			<div class="flex items-center gap-3">
				<Rating value={3.5} readonly {color} label="Rating in {color}" />
				<code class="font-mono text-xs text-fg-muted">color="{color}"</code>
			</div>
		{/each}
	</div>
</div>
