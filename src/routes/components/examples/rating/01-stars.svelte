<!-- Arrow keys and forms work like any radio group. Click the current rating again to take it back. -->
<script lang="ts">
	import { Rating } from '@joshicodes/cock';

	let stars = $state(4);

	const verdicts = [
		'No rating yet. Take your time.',
		'Barely got going.',
		'Over a bit quickly.',
		'Did the job.',
		'Would come again.',
		'Life-changing. The neighbors heard.'
	];
</script>

<div class="space-y-6">
	<div class="space-y-2">
		<Rating bind:value={stars} label="Rate last night's crowing" size="lg" />
		<p class="text-sm text-fg-muted">{verdicts[stars]}</p>
	</div>

	<div class="flex items-center gap-2 text-sm text-fg-muted">
		<Rating value={3.6} readonly size="sm" label="Average rating" />
		<span>3.6 from 212 hens, most of them honest</span>
	</div>
</div>
