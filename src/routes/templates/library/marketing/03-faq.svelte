<!-- Frequently asked questions in two columns: a short intro with a way to reach a person, and an accordion that keeps one answer open at a time. -->
<script lang="ts" module>
	export const meta = {
		height: 520,
		options: [
			{
				name: 'mode',
				label: 'Open at once',
				type: 'select',
				default: 'single',
				options: [
					{ value: 'single', label: 'One' },
					{ value: 'multiple', label: 'Several' }
				]
			}
		]
	};
</script>

<script lang="ts">
	import { Accordion, AccordionItem, Button } from '@joshicodes/cock';

	let { mode = 'single' }: { mode?: 'single' | 'multiple' } = $props();

	const questions = [
		{
			q: 'Can I try it before I pay?',
			a: 'Yes. Every plan starts with fourteen days free, no card needed. When the trial ends you pick a plan or your workspace goes read-only. Nothing is deleted.'
		},
		{
			q: 'What happens to my data if I leave?',
			a: 'You can export everything as CSV or JSON at any time from Settings. After you close the account we keep a backup for thirty days, then it is gone for good.'
		},
		{
			q: 'Do you offer discounts for non-profits?',
			a: 'Registered non-profits and schools get half off any plan. Write to us from your organisation’s address and we will set it up.'
		},
		{
			q: 'Can I change plans later?',
			a: 'Whenever you like. Upgrades apply straight away and are billed for the days left in the month; downgrades take effect at the next renewal.'
		},
		{
			q: 'Where are your servers?',
			a: 'In Frankfurt and Amsterdam. Data stays in the EU and is encrypted at rest and in transit.'
		}
	];
</script>

<section class="@container bg-bg px-6 py-16">
	<div class="mx-auto grid max-w-5xl gap-10 @3xl:grid-cols-[1fr_1.6fr] @3xl:gap-16">
		<div>
			<p class="text-sm font-medium text-accent">Questions</p>
			<h2 class="mt-2 text-3xl font-semibold tracking-tight text-balance text-fg">
				Things people ask before they sign up
			</h2>
			<p class="mt-4 text-fg-muted">
				Didn’t find yours? A real person reads every message, usually within a working day.
			</p>
			<Button variant="outline" class="mt-6">Write to us</Button>
		</div>

		{#key mode}
			<Accordion type={mode} value={mode === 'single' ? 'q0' : ['q0']}>
				{#each questions as item, i (item.q)}
					<AccordionItem value="q{i}" title={item.q}>
						<p class="leading-relaxed text-fg-muted">{item.a}</p>
					</AccordionItem>
				{/each}
			</Accordion>
		{/key}
	</div>
</section>
