<!-- Narrow the window: the numbers give way to the position. -->
<script lang="ts">
	import { Pagination } from '@joshicodes/cock';

	let page = $state(4);
</script>

<div class="flex flex-wrap items-center gap-4">
	<Pagination bind:page total={12} />
	<span class="text-sm text-fg-subtle">Page {page} of 12. Keep going.</span>
</div>
