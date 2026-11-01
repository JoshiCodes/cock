<!-- Leave value out for a ring that spins instead. -->
<script lang="ts">
	import { ProgressRing } from '@joshicodes/cock';
</script>

<div class="flex flex-wrap items-center gap-5">
	<ProgressRing value={64} label="Upload" />
	<ProgressRing value={72} size={56} thickness={5} showValue label="Storage" />
	<ProgressRing value={92} size={56} thickness={5} showValue variant="success" label="Tests" />
	<ProgressRing value={38} size={56} thickness={5} showValue variant="warning" label="Budget" />
	<ProgressRing label="Loading" />
</div>
