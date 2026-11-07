<!-- toast() returns an id. Keep it, and the toast can go when the work is done instead of on a timer. -->
<script lang="ts">
	import { Button, toast } from '@joshicodes/cock';

	let busy = $state(false);

	function collect() {
		busy = true;
		const id = toast.info('Collecting eggs', { duration: 0 });

		setTimeout(() => {
			toast.dismiss(id);
			toast.success('Twelve eggs', { description: 'One of them is suspiciously large.' });
			busy = false;
		}, 1800);
	}
</script>

<div class="flex flex-wrap gap-3">
	<Button variant="outline" size="sm" loading={busy} onclick={collect}>Collect eggs</Button>

	<Button
		variant="outline"
		size="sm"
		onclick={() => toast.warning('Feed is running low', { description: 'Two days left.' })}
	>
		Warning
	</Button>
</div>
