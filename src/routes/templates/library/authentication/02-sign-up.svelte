<!-- A sign-up with the same crop-marked card as the grid login, plus a short timeline of the first two weeks. -->
<script lang="ts" module>
	export const meta = {
		height: 720,
		options: [
			{ name: 'timeline', label: 'First-week timeline', type: 'boolean', default: true },
			{ name: 'brand', label: 'Brand', type: 'text', default: 'fieldnote', placeholder: 'Brand' }
		]
	};
</script>

<script lang="ts">
	import {
		Button,
		Card,
		Checkbox,
		Field,
		Input,
		Link,
		Separator,
		Timeline,
		TimelineItem
	} from '@joshicodes/cock';

	let { timeline = true, brand = 'fieldnote' }: { timeline?: boolean; brand?: string } = $props();

	let password = $state('');
	let agreed = $state(false);
	let short = $derived(password.length > 0 && password.length < 10);
</script>

<div class="@container flex min-h-[45rem] items-center justify-center bg-muted px-5 py-12">
	<div
		class="grid w-full max-w-4xl items-center gap-12 {timeline
			? '@3xl:grid-cols-[400px_1fr] @3xl:gap-20'
			: 'max-w-[400px]'}"
	>
		<div class="relative">
			<span
				aria-hidden="true"
				class="absolute -top-2 -left-2 size-4 border-t-2 border-l-2 border-accent"
			></span>
			<span
				aria-hidden="true"
				class="absolute -top-2 -right-2 size-4 border-t-2 border-r-2 border-accent"
			></span>
			<span
				aria-hidden="true"
				class="absolute -bottom-2 -left-2 size-4 border-b-2 border-l-2 border-accent"
			></span>
			<span
				aria-hidden="true"
				class="absolute -right-2 -bottom-2 size-4 border-r-2 border-b-2 border-accent"
			></span>

			<Card padding="lg" class="rounded-none">
				<h1 class="text-2xl font-semibold tracking-tight text-fg">Start with {brand}</h1>
				<p class="mt-1.5 text-sm text-fg-muted">Free for fourteen days. No card needed.</p>

				<Button variant="outline" block class="mt-7">Continue with GitHub</Button>
				<Separator class="my-6">or with email</Separator>

				<form class="space-y-4" onsubmit={(event) => event.preventDefault()}>
					<Field label="Your name">
						{#snippet children(field)}
							<Input {...field} autocomplete="name" placeholder="Avery Lindqvist" required />
						{/snippet}
					</Field>
					<Field label="Work email">
						{#snippet children(field)}
							<Input
								{...field}
								type="email"
								autocomplete="email"
								placeholder="you@company.com"
								required
							/>
						{/snippet}
					</Field>
					<Field
						label="Password"
						description="Ten characters or more."
						error={short ? `${10 - password.length} more to go.` : undefined}
					>
						{#snippet children(field)}
							<Input
								{...field}
								bind:value={password}
								type="password"
								autocomplete="new-password"
								required
							/>
						{/snippet}
					</Field>
					<Checkbox bind:checked={agreed}>
						I agree to the <Link href="/">terms</Link> and the <Link href="/">privacy policy</Link>.
					</Checkbox>
					<Button type="submit" block disabled={!agreed}>Create account</Button>
				</form>

				<p class="mt-6 text-center text-sm text-fg-muted">
					Already have one? <Link href="/">Sign in</Link>
				</p>
			</Card>
		</div>

		{#if timeline}
			<div class="max-@3xl:hidden">
				<p class="text-sm font-medium text-accent">Your first week</p>
				<h2 class="mt-2 text-2xl font-semibold tracking-tight text-balance text-fg">
					Set up in an afternoon, settled in by Friday.
				</h2>
				<Timeline class="mt-8">
					<TimelineItem title="Bring your notes over" time="Day 1" tone="accent">
						Import from Notion, Markdown or a plain folder. Links survive the move.
					</TimelineItem>
					<TimelineItem title="Invite the team" time="Day 2">
						Up to five people are free while you try it out.
					</TimelineItem>
					<TimelineItem title="Decide, or don’t" time="Day 14">
						Pick a plan, or export everything and leave. Nothing is held back.
					</TimelineItem>
				</Timeline>
			</div>
		{/if}
	</div>
</div>
