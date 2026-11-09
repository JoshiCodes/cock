<!-- `animation="spotlight"` lights the dots up around the pointer. Move over the box. -->
<script lang="ts">
	import { Button, GridBackground } from '@joshicodes/cock';
</script>

<GridBackground
	variant="dots"
	animation="spotlight"
	size={20}
	class="flex h-72 w-full items-center justify-center rounded-md border border-border"
>
	<div
		class="flex max-w-sm flex-col items-center gap-4 rounded-lg bg-surface/85 px-6 py-5 text-center shadow-[0_0_20px_14px] shadow-surface/85"
	>
		<p class="text-fg">The content on top keeps its pointer events. The grid still follows.</p>
		<Button>Get started</Button>
	</div>
</GridBackground>
