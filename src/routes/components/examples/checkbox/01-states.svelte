<script lang="ts">
	import { Checkbox } from '@joshicodes/cock';

	let terms = $state(false);
</script>

<div class="flex flex-col gap-3">
	<Checkbox bind:checked={terms} description="Required. We don't make the rules.">
		I'm old enough for this package name
	</Checkbox>
	<Checkbox checked indeterminate>Some items selected</Checkbox>
	<Checkbox disabled>Disabled</Checkbox>
</div>
