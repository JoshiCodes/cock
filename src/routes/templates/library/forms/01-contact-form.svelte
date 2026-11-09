<!-- A contact page: who you'll reach and how fast on one side, a labelled form in a card on the other. Sending shows a toast, so mount <Toaster /> once in your layout. -->
<script lang="ts" module>
	export const meta = { height: 640 };
</script>

<script lang="ts">
	import {
		Button,
		Card,
		Checkbox,
		Field,
		Input,
		Link,
		Select,
		Separator,
		Textarea,
		toast
	} from '@joshicodes/cock';

	const topics = [
		{ value: 'sales', label: 'Pricing and plans' },
		{ value: 'support', label: 'Something isn’t working' },
		{ value: 'press', label: 'Press and partnerships' },
		{ value: 'other', label: 'Something else' }
	];

	let topic = $state('sales');
	let message = $state('');

	function send(event: SubmitEvent) {
		event.preventDefault();
		toast.success('Message sent. We’ll write back within a working day.');
		message = '';
	}
</script>

<section class="@container bg-bg px-6 py-16">
	<div class="mx-auto grid max-w-5xl gap-12 @3xl:grid-cols-[1fr_1.3fr] @3xl:gap-16">
		<div>
			<h2 class="text-4xl font-semibold tracking-tight text-balance text-fg">Talk to a person.</h2>
			<p class="mt-4 leading-relaxed text-fg-muted">
				Every message lands with someone on the team, not a bot. Most get an answer the same day.
			</p>

			<Separator class="my-8" />

			<dl class="grid gap-6 text-sm @sm:grid-cols-2 @3xl:grid-cols-1">
				<div>
					<dt class="font-medium text-fg">Write to us</dt>
					<dd class="mt-1"><Link href="mailto:hello@northstar.co">hello@northstar.co</Link></dd>
				</div>
				<div>
					<dt class="font-medium text-fg">Already a customer?</dt>
					<dd class="mt-1 text-fg-muted">
						The <Link href="/">help centre</Link> answers most things faster than we can.
					</dd>
				</div>
			</dl>
		</div>

		<Card padding="lg">
			<form class="space-y-5" onsubmit={send}>
				<div class="grid gap-5 @sm:grid-cols-2">
					<Field label="Name" required>
						{#snippet children(field)}
							<Input {...field} autocomplete="name" required />
						{/snippet}
					</Field>
					<Field label="Email" required>
						{#snippet children(field)}
							<Input {...field} type="email" autocomplete="email" required />
						{/snippet}
					</Field>
				</div>
				<Field label="What is it about?">
					{#snippet children(field)}
						<Select {...field} bind:value={topic} options={topics} />
					{/snippet}
				</Field>
				<Field
					label="Message"
					required
					description={topic === 'support'
						? 'Tell us what you expected and what happened instead.'
						: undefined}
				>
					{#snippet children(field)}
						<Textarea {...field} bind:value={message} rows={5} autosize required />
					{/snippet}
				</Field>
				<Checkbox>Send me product news, about once a month.</Checkbox>
				<Button type="submit" block>Send message</Button>
			</form>
		</Card>
	</div>
</section>
