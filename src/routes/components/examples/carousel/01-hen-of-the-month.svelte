<!-- Swipe it, use the buttons, or let it run: it pauses while you are looking, and stays put if you asked your system for less motion. -->
<script lang="ts">
	import { Carousel, CarouselSlide } from '@joshicodes/cock';

	const hens = [
		{ name: 'Mabel', month: 'September', note: '31 eggs in 30 days. Nobody knows how.' },
		{ name: 'Doris', month: 'October', note: 'Stared down a fox. The fox apologized.' },
		{
			name: 'Gertrude',
			month: 'November',
			note: 'Broody all month. Achieved nothing. Proud of it.'
		},
		{ name: 'Big Red', month: 'Honorable mention', note: 'Not a hen. Insisted on being included.' }
	];
</script>

<Carousel label="Hen of the month" autoplay={5000} loop class="w-full">
	{#each hens as hen (hen.name)}
		<CarouselSlide>
			<div class="mr-3 rounded-lg border border-border bg-bg p-6">
				<p class="text-xs font-medium tracking-wide text-fg-subtle uppercase">{hen.month}</p>
				<p class="mt-2 text-xl font-semibold tracking-tight text-fg">{hen.name}</p>
				<p class="mt-2 text-sm leading-relaxed text-fg-muted">{hen.note}</p>
			</div>
		</CarouselSlide>
	{/each}
</Carousel>
