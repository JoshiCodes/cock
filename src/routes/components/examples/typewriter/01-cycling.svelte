<!-- reserve holds the width of the longest line so the text around it stays put. -->
<script lang="ts">
	import { Typewriter } from '@joshicodes/cock';
</script>

<div class="flex w-full flex-col gap-5">
	<p class="text-2xl font-semibold tracking-tight text-fg">
		Wake up to <Typewriter
			text={['fresh eggs', 'a finished UI', 'a very loud bird', 'morning glory']}
			class="text-accent"
		/>
	</p>

	<p class="text-sm text-fg-muted">
		<Typewriter
			text="All twelve hens accounted for. Nothing else to do."
			speed={35}
			caretShape="block"
			loop
			pause={3000}
		/>
	</p>
</div>
