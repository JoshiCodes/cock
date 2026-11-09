<!-- A landing-page hero on slowly drifting graph paper, with an announcement line, two actions and a copyable install command. -->
<script lang="ts" module>
	export const meta = {
		height: 600,
		thumbnail: { drift: false },
		options: [
			{
				name: 'align',
				label: 'Align',
				type: 'select',
				default: 'left',
				options: [
					{ value: 'left', label: 'Left' },
					{ value: 'center', label: 'Center' }
				]
			},
			{ name: 'drift', label: 'Drifting grid', type: 'boolean', default: true },
			{
				name: 'headline',
				label: 'Headline',
				type: 'text',
				default: 'Ship the boring parts first.',
				placeholder: 'Headline'
			}
		]
	};
</script>

<script lang="ts">
	import { Button, Code, CopyButton, GridBackground, Link } from '@joshicodes/cock';

	let {
		align = 'left',
		drift = true,
		headline = 'Ship the boring parts first.'
	}: { align?: 'left' | 'center'; drift?: boolean; headline?: string } = $props();

	const install = 'npm create ledger@latest';
	let centered = $derived(align === 'center');
</script>

<GridBackground
	size={48}
	major={4}
	fade={centered ? 'radial' : 'edges'}
	animation={drift ? 'pan' : 'none'}
	direction="left"
	speed={16}
	class="@container flex min-h-[37rem] items-center bg-bg"
>
	<section
		class="mx-auto flex w-full max-w-5xl flex-col px-6 py-20 {centered
			? 'items-center text-center'
			: 'items-start'}"
	>
		<p class="text-sm text-fg-muted">
			<span class="font-medium text-accent">New</span> · Ledger 2.0 reconciles bank feeds on its
			own.
			<Link href="/">Read the notes</Link>
		</p>

		<h1
			class="mt-6 max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight text-balance text-fg @3xl:text-7xl"
		>
			{headline}
		</h1>
		<p class="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
			Invoices, receipts and the quarterly scramble, handled. Ledger keeps the books tidy so the
			rest of your week can be about the work.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3 {centered ? 'justify-center' : ''}">
			<Button size="lg">Start free</Button>
			<Button size="lg" variant="outline">Book a walkthrough</Button>
		</div>

		<div class="mt-8 flex items-center gap-2">
			<Code>{install}</Code>
			<CopyButton
				value={install}
				iconOnly
				label="Copy install command"
				variant="ghost"
				size="icon-sm"
			/>
		</div>
	</section>
</GridBackground>
