<!-- Three text sizes and two icon-only sizes. -->
<script lang="ts">
	import { Button } from '@joshicodes/cock';
</script>

<div class="flex flex-wrap items-center gap-3">
	<Button size="sm">Small</Button>
	<Button size="md">Average</Button>
	<Button size="lg">Impressive</Button>

	<Button size="icon" variant="outline" aria-label="Add item">
		<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
			<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
	</Button>

	<Button size="icon-sm" variant="ghost" aria-label="Add item">
		<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
			<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
	</Button>
</div>
