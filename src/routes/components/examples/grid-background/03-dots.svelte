<!-- `variant="dots"` puts a dot on every point where two lines would cross. -->
<script lang="ts">
	import { GridBackground } from '@joshicodes/cock';
</script>

<div class="grid w-full gap-3 sm:grid-cols-3">
	<GridBackground variant="dots" size={16} class="h-40 rounded-md border border-border" />
	<GridBackground variant="dots" fade="edges" class="h-40 rounded-md border border-border" />
	<GridBackground
		variant="dots"
		size={24}
		thickness={3}
		color="var(--color-accent)"
		fade="bottom"
		class="h-40 rounded-md border border-border"
	/>
</div>
