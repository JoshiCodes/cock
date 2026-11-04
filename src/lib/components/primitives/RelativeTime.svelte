<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';

	interface Props extends Omit<HTMLAttributes<HTMLTimeElement>, 'class' | 'title'> {
		/** The moment to describe. Strings are parsed with `new Date()`. */
		date: Date | string | number;
		/** Defaults to the visitor's language. */
		locale?: string;
		/** `auto` says "yesterday" where it can; `always` says "1 day ago". */
		numeric?: 'auto' | 'always';
		/** `short` gives "3 min. ago", `narrow` shortens further where the locale allows. */
		format?: 'long' | 'short' | 'narrow';
		/** Keep the text current while the page is open. */
		live?: boolean;
		/** Show the exact date and time on hover. */
		title?: boolean;
		/** The reference point. Leave unset for the current time. */
		now?: Date | number;
		class?: string;
	}

	let {
		date,
		locale,
		numeric = 'auto',
		format = 'long',
		live = true,
		title = true,
		now: fixedNow,
		class: className,
		...rest
	}: Props = $props();

	const units: [Intl.RelativeTimeFormatUnit, number][] = [
		['year', 31_536_000],
		['month', 2_592_000],
		['week', 604_800],
		['day', 86_400],
		['hour', 3_600],
		['minute', 60],
		['second', 1]
	];

	let instant = $derived(new Date(date));
	let clock = $state(Date.now());
	let reference = $derived(fixedNow === undefined ? clock : new Date(fixedNow).getTime());
	let seconds = $derived((instant.getTime() - reference) / 1000);

	let text = $derived.by(() => {
		if (Number.isNaN(instant.getTime())) return '';
		const formatter = new Intl.RelativeTimeFormat(locale, { numeric, style: format });
		const [unit, size] =
			units.find(([, size]) => Math.abs(seconds) >= size) ?? units[units.length - 1];
		return formatter.format(Math.round(seconds / size), unit);
	});

	let exact = $derived(
		title && !Number.isNaN(instant.getTime())
			? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(instant)
			: undefined
	);

	// The server renders with its own clock; this corrects the text once the page
	// is running, then ticks about as often as the wording can change.
	$effect(() => {
		if (fixedNow !== undefined) return;
		clock = Date.now();
		if (!live) return;

		let timer: ReturnType<typeof setTimeout>;
		const tick = () => {
			clock = Date.now();
			const away = Math.abs(instant.getTime() - clock) / 1000;
			timer = setTimeout(tick, away < 60 ? 1_000 : away < 3_600 ? 15_000 : 60_000);
		};
		tick();
		return () => clearTimeout(timer);
	});
</script>

<time
	datetime={Number.isNaN(instant.getTime()) ? undefined : instant.toISOString()}
	title={exact}
	class={cn('tabular-nums', className)}
	{...rest}>{text}</time
>
