<script lang="ts">
	import { Input } from '@joshicodes/cock';
</script>

<div class="grid w-full gap-3 sm:grid-cols-2">
	<Input placeholder="Default" />
	<Input size="sm" placeholder="Small" />
	<Input size="lg" placeholder="Large (we noticed)" />
	<Input value="not-an-email" invalid />
	<Input value="Disabled, not dead" disabled />
	<Input type="password" value="hunter2" />
</div>
