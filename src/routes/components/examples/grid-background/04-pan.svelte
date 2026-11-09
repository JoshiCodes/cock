<!-- `animation="pan"` lets the pattern drift. Pick a `direction` and a `speed` in pixels per second. -->
<script lang="ts">
	import { GridBackground } from '@joshicodes/cock';
</script>

<div class="grid w-full gap-3 sm:grid-cols-2">
	<GridBackground
		animation="pan"
		fade="radial"
		class="flex h-48 items-center justify-center rounded-md border border-border"
	>
		<span
			class="rounded-md bg-surface/85 px-3 py-1 text-sm text-fg-muted shadow-[0_0_20px_14px] shadow-surface/85"
			>diagonal</span
		>
	</GridBackground>
	<GridBackground
		animation="pan"
		direction="up"
		speed={24}
		major={4}
		size={20}
		fade="top"
		class="flex h-48 items-center justify-center rounded-md border border-border"
	>
		<span
			class="rounded-md bg-surface/85 px-3 py-1 text-sm text-fg-muted shadow-[0_0_20px_14px] shadow-surface/85"
			>up, twice as fast</span
		>
	</GridBackground>
</div>
