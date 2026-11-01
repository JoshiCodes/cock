<script lang="ts">
	import { Button, Highlight } from '@joshicodes/cock';

	let run = $state(0);
</script>

<div class="flex w-full flex-col gap-4">
	{#key run}
		<p class="max-w-xl text-lg leading-relaxed text-fg">
			Size isn't <Highlight>everything</Highlight>. It's
			<Highlight variant="underline" delay={400}>what you do with it</Highlight> that counts.
		</p>
	{/key}

	<Button size="sm" variant="outline" class="self-start" onclick={() => run++}>Replay</Button>
</div>
