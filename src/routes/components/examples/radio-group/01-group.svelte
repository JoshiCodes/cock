<!-- Radio reads the name and the bound value from the group through context. -->
<script lang="ts">
	import { Radio, RadioGroup } from '@joshicodes/cock';

	let delivery = $state('standard');
</script>

<RadioGroup bind:value={delivery} label="Delivery">
	<Radio value="standard" description="Takes its time, like it should">Standard</Radio>
	<Radio value="express" description="Comes quickly">Express</Radio>
	<Radio value="pickup" disabled>Pick up in person (we're shy)</Radio>
</RadioGroup>
