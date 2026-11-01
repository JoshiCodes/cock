<script lang="ts">
	import { Caret } from '@joshicodes/cock';
</script>

<div class="flex w-full flex-col gap-4">
	<div class="rounded-md bg-code-bg px-4 py-3 font-mono text-sm text-code-fg">
		<span class="text-white/40">~/farm $</span> bun run dev<Caret />
	</div>

	<div class="flex items-center gap-8 text-lg text-fg">
		<span>bar<Caret /></span>
		<span>block<Caret shape="block" /></span>
		<span>underline<Caret shape="underline" class="bg-accent" /></span>
	</div>
</div>
