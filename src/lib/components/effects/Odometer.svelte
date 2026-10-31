<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		value: number;
		locale?: string;
		/** Passed to Intl.NumberFormat, e.g. `{ style: 'percent' }`. */
		options?: Intl.NumberFormatOptions;
		/** Milliseconds per roll. */
		duration?: number;
		class?: string;
	}

	let { value, locale, options, duration = 700, class: className }: Props = $props();

	let text = $derived(new Intl.NumberFormat(locale, options).format(value));
	let chars = $derived([...text]);
</script>

<span class={cn('inline-flex tabular-nums', className)} style:--ck-odo-duration="{duration}ms">
	<span class="sr-only">{text}</span>
	<!-- Keyed from the right, so the ones stay in the ones column when the number grows. -->
	{#each chars as char, index (chars.length - index)}
		{#if /\d/.test(char)}
			<span class="ck-odo-digit" aria-hidden="true">
				<span class="ck-odo-reel" style:transform="translateY({-Number(char) * 10}%)">
					{#each { length: 10 } as _, digit (digit)}
						<span>{digit}</span>
					{/each}
				</span>
			</span>
		{:else}
			<span aria-hidden="true">{char}</span>
		{/if}
	{/each}
</span>

<style>
	.ck-odo-digit {
		display: inline-block;
		height: 1.2em;
		overflow: hidden;
		line-height: 1.2em;
	}

	.ck-odo-reel {
		display: flex;
		flex-direction: column;
		transition: transform var(--ck-odo-duration) cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.ck-odo-reel > span {
		height: 1.2em;
	}
</style>
