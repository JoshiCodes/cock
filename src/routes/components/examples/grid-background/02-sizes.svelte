<!-- `size` sets the spacing, `thickness` the line width, `major` draws every n-th line stronger. -->
<script lang="ts">
	import { GridBackground } from '@joshicodes/cock';
</script>

<div class="grid w-full gap-3 sm:grid-cols-3">
	<GridBackground size={16} class="h-40 rounded-md border border-border" />
	<GridBackground size={40} thickness={2} class="h-40 rounded-md border border-border" />
	<GridBackground size={12} major={5} class="h-40 rounded-md border border-border" />
</div>
