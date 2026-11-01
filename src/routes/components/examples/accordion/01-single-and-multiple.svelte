<script lang="ts">
	import { Accordion, AccordionItem } from '@joshicodes/cock';

	let one = $state<string | string[]>('name');
	let many = $state<string | string[]>(['work']);
</script>

<div class="grid w-full gap-5 lg:grid-cols-2">
	<div class="space-y-2">
		<p class="text-sm font-medium text-fg-muted">One at a time</p>
		<Accordion bind:value={one}>
			<AccordionItem value="name" title="Why is it called cock?">
				Core Component Kit. The acronym was noticed afterwards and then kept on purpose.
			</AccordionItem>
			<AccordionItem value="theme" title="How do I theme it?">
				Set --ck-bg, --ck-fg and --ck-accent on :root. The rest is mixed from those three.
			</AccordionItem>
		</Accordion>
	</div>

	<div class="space-y-2">
		<p class="text-sm font-medium text-fg-muted">Several at once</p>
		<Accordion type="multiple" bind:value={many}>
			<AccordionItem value="work" title="Can I use it at work?">
				Yes. Maybe call it "the component kit" in the standup.
			</AccordionItem>
			<AccordionItem value="size" title="Does size matter?">
				Not at all. That said, it ships more than sixty components.
			</AccordionItem>
		</Accordion>
	</div>
</div>
