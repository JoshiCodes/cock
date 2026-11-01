<!-- Both write through the shared theme state, so they stay in step. -->
<script lang="ts">
	import { ThemeToggle } from '@joshicodes/cock';
</script>

<div class="flex flex-wrap items-center gap-4">
	<ThemeToggle />
	<ThemeToggle variant="segmented" />
</div>
