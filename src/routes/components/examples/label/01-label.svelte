<!-- Field does this for you; reach for Label directly when you control the id yourself. -->
<script lang="ts">
	import { Input, Label } from '@joshicodes/cock';
</script>

<div class="w-full max-w-sm space-y-1.5">
	<Label for="project-name" required>Project name</Label>
	<Input id="project-name" placeholder="my-new-thing" />
</div>
