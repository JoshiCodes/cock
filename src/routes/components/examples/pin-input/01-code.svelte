<!-- Paste a whole code into any box; it fills from there. -->
<script lang="ts">
	import { PinInput, toast } from '@joshicodes/cock';

	let code = $state('');
</script>

<PinInput
	bind:value={code}
	length={6}
	group={3}
	label="Verification code"
	oncomplete={(value) => toast.success('Code accepted', { description: `${value}. You're in.` })}
/>
