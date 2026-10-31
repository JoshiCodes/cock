<script lang="ts">
	import { cn } from '../../utils/cn.js';

	let { class: className }: { class?: string } = $props();
</script>

<div role="separator" class={cn('-mx-1.5 my-1.5 h-px bg-border', className)}></div>
