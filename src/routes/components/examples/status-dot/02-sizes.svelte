<!-- On its own the dot is an image, so it needs a label. Hover one to see it as a tooltip too. -->
<script lang="ts">
	import { StatusDot } from '@joshicodes/cock';
</script>

<div class="flex flex-wrap items-center gap-8">
	<div class="flex items-center gap-3">
		<StatusDot size="sm" tone="success" label="Up" title="Up" />
		<StatusDot size="md" tone="success" label="Up" title="Up" />
		<StatusDot size="lg" tone="success" label="Up" title="Up" />
	</div>

	<p class="flex items-center gap-2 text-sm text-fg">
		<StatusDot tone="danger" label="Offline" title="Offline" />
		Gerald
		<span class="text-fg-muted">hasn't crowed since Tuesday</span>
	</p>

	<StatusDot tone="accent" size="lg">Hard at work</StatusDot>
</div>
