<!-- lines={n} stacks text placeholders; the last one is shorter on purpose. -->
<script lang="ts">
	import { Skeleton } from '@joshicodes/cock';
</script>

<div class="flex w-full max-w-sm items-center gap-3">
	<Skeleton class="size-10 shrink-0 rounded-full" />
	<div class="flex-1"><Skeleton lines={2} /></div>
</div>
