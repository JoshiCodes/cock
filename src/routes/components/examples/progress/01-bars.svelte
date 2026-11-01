<script lang="ts">
	import { Progress } from '@joshicodes/cock';

	let upload = $state(42);

	$effect(() => {
		const timer = setInterval(() => (upload = upload >= 100 ? 0 : upload + 4), 400);
		return () => clearInterval(timer);
	});
</script>

<div class="w-full space-y-5">
	<div class="space-y-2">
		<div class="flex justify-between text-xs text-fg-muted">
			<span>Getting it up</span>
			<span class="tabular-nums">{upload}%</span>
		</div>
		<Progress value={upload} />
	</div>

	<div class="grid gap-4 sm:grid-cols-3">
		<Progress value={90} variant="success" size="sm" label="Tests" />
		<Progress value={55} variant="warning" size="sm" label="Memory" />
		<Progress value={20} variant="danger" size="sm" label="Disk" />
	</div>

	<Progress />
</div>
