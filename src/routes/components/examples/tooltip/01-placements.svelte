<script lang="ts">
	import { Button, Tooltip } from '@joshicodes/cock';
</script>

<div class="flex flex-wrap items-center gap-3">
	<Tooltip content="Don't just hover around it.">
		<Button variant="outline" size="sm">Top</Button>
	</Tooltip>
	<Tooltip content="Appears below. No judgment." placement="bottom">
		<Button variant="outline" size="sm">Bottom</Button>
	</Tooltip>
	<Tooltip content="Leans to the left, like most." placement="left">
		<Button variant="outline" size="sm">Left</Button>
	</Tooltip>
	<Tooltip content="To the right" placement="right">
		<Button variant="outline" size="sm">Right</Button>
	</Tooltip>
</div>
