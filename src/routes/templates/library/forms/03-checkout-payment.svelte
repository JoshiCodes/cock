<!-- The payment step of a checkout: where you are, how you want to pay, and an order summary that stays in view. -->
<script lang="ts" module>
	export const meta = { height: 680 };
</script>

<script lang="ts">
	import {
		Avatar,
		Breadcrumb,
		Button,
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
		Field,
		Input,
		Radio,
		RadioGroup,
		Separator
	} from '@joshicodes/cock';

	let method = $state('card');

	const items = [
		{ name: 'Field notes, volume 02', detail: 'Printed journal · 3 issues', price: 72 },
		{ name: 'Linen slipcase', detail: 'Natural', price: 18 }
	];
	const subtotal = items.reduce((sum, item) => sum + item.price, 0);
	const tax = Math.round(subtotal * 0.08 * 100) / 100;
	const money = (value: number) =>
		value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
</script>

<section class="@container bg-bg px-6 py-12">
	<div class="mx-auto grid max-w-5xl gap-10 @3xl:grid-cols-[1fr_22rem] @3xl:gap-14">
		<div>
			<Breadcrumb
				items={[
					{ label: 'Cart', href: '/' },
					{ label: 'Shipping', href: '/' },
					{ label: 'Payment' }
				]}
			/>
			<h2 class="mt-6 text-2xl font-semibold tracking-tight text-fg">How would you like to pay?</h2>

			<RadioGroup bind:value={method} label="Payment method" class="mt-6">
				<Radio value="card" description="Visa, Mastercard and American Express.">Card</Radio>
				<Radio value="paypal" description="You’ll confirm on PayPal, then come back here.">
					PayPal
				</Radio>
				<Radio value="invoice" description="For companies. Due within 14 days.">Invoice</Radio>
			</RadioGroup>

			<Separator class="my-8" />

			{#if method === 'card'}
				<form class="space-y-5" onsubmit={(event) => event.preventDefault()}>
					<Field label="Name on card">
						{#snippet children(field)}
							<Input {...field} autocomplete="cc-name" />
						{/snippet}
					</Field>
					<Field label="Card number">
						{#snippet children(field)}
							<Input
								{...field}
								inputmode="numeric"
								autocomplete="cc-number"
								placeholder="1234 1234 1234 1234"
							/>
						{/snippet}
					</Field>
					<div class="grid grid-cols-2 gap-5">
						<Field label="Expires">
							{#snippet children(field)}
								<Input {...field} autocomplete="cc-exp" placeholder="MM / YY" />
							{/snippet}
						</Field>
						<Field label="Security code">
							{#snippet children(field)}
								<Input {...field} inputmode="numeric" autocomplete="cc-csc" placeholder="CVC" />
							{/snippet}
						</Field>
					</div>
				</form>
			{:else if method === 'paypal'}
				<p class="text-sm text-fg-muted">
					Press pay and a PayPal window opens. Nothing is charged until you confirm there.
				</p>
			{:else}
				<Field label="Company VAT number" description="Printed on the invoice.">
					{#snippet children(field)}
						<Input {...field} placeholder="DE123456789" />
					{/snippet}
				</Field>
			{/if}
		</div>

		<Card variant="raised" class="self-start @3xl:sticky @3xl:top-6">
			<CardHeader>
				<CardTitle>Your order</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				{#each items as item (item.name)}
					<div class="flex items-center gap-3">
						<Avatar name={item.name} shape="square" size="md" />
						<div class="min-w-0 flex-1 text-sm">
							<p class="truncate font-medium text-fg">{item.name}</p>
							<p class="text-fg-muted">{item.detail}</p>
						</div>
						<span class="text-sm text-fg tabular-nums">{money(item.price)}</span>
					</div>
				{/each}
				<Separator />
				<dl class="space-y-2 text-sm">
					<div class="flex justify-between">
						<dt class="text-fg-muted">Subtotal</dt>
						<dd class="tabular-nums">{money(subtotal)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-fg-muted">Shipping</dt>
						<dd>Free</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-fg-muted">Tax</dt>
						<dd class="tabular-nums">{money(tax)}</dd>
					</div>
					<div class="flex justify-between border-t border-border pt-3 font-medium text-fg">
						<dt>Total</dt>
						<dd class="tabular-nums">{money(subtotal + tax)}</dd>
					</div>
				</dl>
			</CardContent>
			<CardFooter>
				<Button block size="lg">Pay {money(subtotal + tax)}</Button>
			</CardFooter>
		</Card>
	</div>
</section>
