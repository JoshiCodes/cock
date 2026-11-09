<!-- Three plans whose prices roll over when you switch the billing period, followed by a full comparison table. -->
<script lang="ts" module>
	export const meta = {
		height: 900,
		options: [{ name: 'compare', label: 'Comparison table', type: 'boolean', default: true }]
	};
</script>

<script lang="ts">
	import {
		Button,
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
		Odometer,
		SegmentedControl,
		Table
	} from '@joshicodes/cock';

	let { compare = true }: { compare?: boolean } = $props();

	let billing = $state('yearly');

	const plans = [
		{ name: 'Solo', note: 'One person, every feature.', monthly: 0, yearly: 0, cta: 'Start free' },
		{
			name: 'Team',
			note: 'For a group that ships together.',
			monthly: 18,
			yearly: 14,
			cta: 'Try Team for 14 days',
			featured: true
		},
		{
			name: 'Company',
			note: 'Controls the security team asks for.',
			monthly: 42,
			yearly: 34,
			cta: 'Talk to us'
		}
	];

	const rows: [string, (string | boolean)[]][] = [
		['Projects', ['3', 'Unlimited', 'Unlimited']],
		['Members', ['1', 'Up to 25', 'Unlimited']],
		['Version history', ['7 days', '1 year', 'Forever']],
		['Guest access', [false, true, true]],
		['Single sign-on', [false, false, true]],
		['Audit log', [false, false, true]],
		['Support', ['Community', 'Email, same day', 'Named contact']]
	];
</script>

<section class="@container bg-bg px-6 py-16">
	<div class="mx-auto max-w-5xl">
		<div class="flex flex-wrap items-end justify-between gap-6">
			<div class="max-w-lg">
				<h2 class="text-4xl font-semibold tracking-tight text-balance text-fg">
					Pay for the people, not the features.
				</h2>
				<p class="mt-3 text-fg-muted">Every plan has the whole editor. You pay per seat.</p>
			</div>
			<SegmentedControl
				bind:value={billing}
				options={[
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'yearly', label: 'Yearly, 2 months free' }
				]}
				label="Billing period"
			/>
		</div>

		<div class="mt-10 grid gap-4 @3xl:grid-cols-3">
			{#each plans as plan (plan.name)}
				<Card
					variant={plan.featured ? 'raised' : 'default'}
					class="flex flex-col {plan.featured ? 'border-accent ring-1 ring-accent' : ''}"
				>
					<CardHeader>
						<CardTitle>
							{plan.name}
							{#if plan.featured}<span class="ml-1 text-sm font-normal text-accent"
									>— most teams pick this</span
								>{/if}
						</CardTitle>
						<p class="mt-1 text-sm text-fg-muted">{plan.note}</p>
					</CardHeader>
					<CardContent class="flex-1">
						<p class="flex items-baseline gap-1.5 text-fg">
							<span class="text-4xl font-semibold tracking-tight">
								<Odometer
									value={billing === 'yearly' ? plan.yearly : plan.monthly}
									locale="en-US"
									options={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
								/>
							</span>
							<span class="text-sm text-fg-muted">per seat / month</span>
						</p>
					</CardContent>
					<CardFooter>
						<Button block variant={plan.featured ? 'solid' : 'outline'}>{plan.cta}</Button>
					</CardFooter>
				</Card>
			{/each}
		</div>

		{#if compare}
			<Table class="mt-12" caption="Everything that differs between the plans.">
				<thead>
					<tr>
						<th class="w-1/4">Compare</th>
						{#each plans as plan (plan.name)}<th>{plan.name}</th>{/each}
					</tr>
				</thead>
				<tbody>
					{#each rows as [label, values] (label)}
						<tr>
							<td class="text-fg-muted">{label}</td>
							{#each values as value, i (i)}
								<td>
									{#if value === true}
										<span class="text-success">✓</span><span class="sr-only">Included</span>
									{:else if value === false}
										<span class="text-fg-subtle">—</span><span class="sr-only">Not included</span>
									{:else}
										{value}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</Table>
		{/if}
	</div>
</section>
