<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		shape?: 'bar' | 'block' | 'underline';
		/** Turn blinking off, e.g. while text is being typed. */
		blink?: boolean;
		class?: string;
	}

	let { shape = 'bar', blink = true, class: className }: Props = $props();

	const shapes = {
		bar: 'h-[1.05em] w-[0.08em] align-[-0.15em]',
		block: 'h-[1.05em] w-[0.55em] align-[-0.15em] opacity-70',
		underline: 'h-[0.09em] w-[0.6em] align-[-0.06em]'
	};
</script>

<span
	aria-hidden="true"
	class={cn(
		'ml-[0.05em] inline-block bg-current',
		blink && 'ck-caret-blink',
		shapes[shape],
		className
	)}
></span>

<style>
	.ck-caret-blink {
		animation: ck-caret 1.06s steps(1, end) infinite;
	}

	@keyframes ck-caret {
		50% {
			opacity: 0;
		}
	}
</style>
