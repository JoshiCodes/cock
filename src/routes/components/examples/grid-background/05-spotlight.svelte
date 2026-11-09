<!-- `animation="spotlight"` lights the dots up around the pointer. Move over the box. -->
<script lang="ts">
	import { Button, GridBackground } from '@joshicodes/cock';
</script>

<GridBackground
	variant="dots"
	animation="spotlight"
	size={20}
	class="flex h-72 w-full flex-col items-center justify-center gap-4 rounded-md border border-border"
>
	<p class="max-w-sm text-center text-fg">
		The content on top keeps its pointer events. The grid still follows.
	</p>
	<Button>Get started</Button>
</GridBackground>
