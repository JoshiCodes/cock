<!-- While loading the button is disabled, so a second submit cannot slip through. -->
<script lang="ts">
	import { Button } from '@joshicodes/cock';

	let publishing = $state(false);

	function publish() {
		publishing = true;
		setTimeout(() => (publishing = false), 1600);
	}
</script>

<div class="flex flex-wrap items-center gap-3">
	<Button loading={publishing} onclick={publish}>
		{publishing ? 'Publishing' : 'Publish'}
	</Button>
	<Button disabled>Archived</Button>
	<Button variant="outline" loading>Working</Button>
</div>
