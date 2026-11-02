/**
 * What the sources cannot say: how a component behaves, which keys it answers
 * to, and which other component you probably wanted instead.
 *
 * Props, types and defaults are not in here. They are read out of the component
 * sources by props.server.ts, so they cannot drift.
 */

export interface CategoryMeta {
	id: string;
	title: string;
	blurb: string;
}

export interface ComponentMeta {
	/** The exported component name, and the heading of its page. */
	name: string;
	slug: string;
	category: string;
	/** One line, used on the index and in search results. */
	summary: string;
	/** The opening paragraph of the page. */
	description?: string;
	/** Parts documented on the same page, e.g. Card and its header. */
	parts?: string[];
	/** Other exports the page covers, e.g. the `toast` helper. */
	exports?: string[];
	/** `[keys, what happens]`. Only where the component adds something. */
	keyboard?: [string, string][];
	/** Behaviour worth knowing before you reach for it. */
	notes?: string[];
	related?: string[];
}

export const categories: CategoryMeta[] = [
	{
		id: 'primitives',
		title: 'Primitives',
		blurb: 'The small parts that end up in every screen.'
	},
	{ id: 'layout', title: 'Layout', blurb: 'Boxes to put the rest in.' },
	{ id: 'forms', title: 'Forms', blurb: 'Inputs, their labels and their error states.' },
	{ id: 'feedback', title: 'Feedback', blurb: 'Telling people what happened.' },
	{ id: 'overlays', title: 'Overlays', blurb: 'Everything that renders above the page.' },
	{ id: 'navigation', title: 'Navigation', blurb: 'Moving between views and pages.' },
	{ id: 'data', title: 'Data', blurb: 'Numbers and tables, without a chart library.' },
	{ id: 'effects', title: 'Effects', blurb: 'Motion for landing pages and empty states.' }
];

const portalNote =
	'Renders into `<body>` and positions itself against its trigger, so an `overflow: hidden` ancestor or a scrolling table cannot clip it.';
const motionNote =
	'Skips straight to the final state when the visitor has reduced motion turned on.';
const srNote = 'Screen readers get the finished text, not the animation.';

export const components: ComponentMeta[] = [
	/* -- primitives ---------------------------------------------------------- */
	{
		name: 'Button',
		slug: 'button',
		category: 'primitives',
		summary: 'Six variants, five sizes, a loading state and an anchor mode.',
		description:
			'The one component everything else borrows from. Pass `href` and it renders an `<a>` with the same look, which saves wrapping buttons in links and getting the keyboard behaviour wrong.',
		notes: [
			'`loading` disables the button and shows a spinner, so a double submit is not possible while a request is in flight.',
			'With `href` the component renders an `<a>`; `disabled` then becomes `aria-disabled` plus `tabindex="-1"`, because a link cannot be disabled.',
			'Every other attribute is forwarded, so `type="submit"`, `form` and `onclick` work as usual.'
		],
		related: ['copy-button', 'theme-toggle', 'dropdown-menu']
	},
	{
		name: 'Badge',
		slug: 'badge',
		category: 'primitives',
		summary: 'A small status label, with an optional leading dot.',
		related: ['alert', 'stat']
	},
	{
		name: 'Avatar',
		slug: 'avatar',
		category: 'primitives',
		summary: 'Picture, initials or a fallback glyph, with a status dot.',
		notes: [
			'Falls back to initials from `name` when `src` is missing or fails to load, and to a neutral glyph when there is no name either.',
			'Overlapping a row of avatars is a `-space-x-2` on the wrapper and a ring on each one; there is no separate group component.'
		],
		related: ['badge', 'skeleton']
	},
	{
		name: 'CopyButton',
		slug: 'copy-button',
		category: 'primitives',
		summary: 'Copies a string and confirms it in place.',
		notes: [
			'Uses the asynchronous clipboard API, which browsers only allow from a real click on a secure origin. If the write is refused the button simply does not change.'
		],
		related: ['button', 'code']
	},
	{
		name: 'ThemeToggle',
		slug: 'theme-toggle',
		category: 'primitives',
		summary: 'Light and dark, or a segmented control that adds system.',
		notes: [
			'Writes through the `theme` state, so the choice is stored and every other instance updates with it.',
			'Pair it with the no-flash script, or the page renders in the wrong scheme for a frame.'
		],
		related: ['button']
	},
	{
		name: 'Spinner',
		slug: 'spinner',
		category: 'primitives',
		summary: 'A borrowed-border spinner that takes the current text colour.',
		related: ['progress-ring', 'skeleton', 'button']
	},
	{
		name: 'Skeleton',
		slug: 'skeleton',
		category: 'primitives',
		summary: 'Grey placeholder blocks, with a shortcut for stacked text lines.',
		related: ['spinner', 'empty-state']
	},
	{
		name: 'Separator',
		slug: 'separator',
		category: 'primitives',
		summary: 'A hairline, horizontal or vertical, optionally with a label.',
		related: ['card']
	},
	{
		name: 'Kbd',
		slug: 'kbd',
		category: 'primitives',
		summary: 'A key cap for documenting shortcuts.',
		related: ['code', 'command-palette']
	},
	{
		name: 'Code',
		slug: 'code',
		category: 'primitives',
		summary: 'Inline code, bordered so it separates from the sentence.',
		related: ['kbd', 'terminal']
	},

	/* -- layout -------------------------------------------------------------- */
	{
		name: 'Card',
		slug: 'card',
		category: 'layout',
		summary: 'A bordered box with optional header, content and footer parts.',
		description:
			'Flat by default: a border and nothing else. Ask for depth with `variant`, or skip the parts entirely and set `padding` when all you want is a box.',
		parts: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
		notes: [
			'`CardHeader` takes an `actions` snippet for the top right corner, which is where a badge or a menu button usually goes.',
			'On a dark background a shadow is nearly invisible, so `elevated` also lightens the surface.'
		],
		related: ['empty-state', 'separator']
	},
	{
		name: 'EmptyState',
		slug: 'empty-state',
		category: 'layout',
		summary: 'The dashed box for lists that have nothing in them yet.',
		related: ['card', 'skeleton']
	},

	/* -- forms --------------------------------------------------------------- */
	{
		name: 'Field',
		slug: 'field',
		category: 'forms',
		summary: 'Wires a label, help text and error message to one control.',
		description:
			'Generates an id, points the label at it and sets `aria-describedby`, then hands all three to you through a snippet. It is the piece that stops every form growing its own slightly different label markup.',
		notes: [
			'`error` replaces `description` while it is set, and switches the control to its invalid styling.',
			'The snippet receives `id`, `invalid` and `aria-describedby`. Spread the rest onto the control so the wiring survives.'
		],
		related: ['label', 'input', 'select']
	},
	{
		name: 'Input',
		slug: 'input',
		category: 'forms',
		summary: 'Text input in three sizes, with slots inside either end.',
		notes: [
			'`bind:value` keeps a string even for `type="number"`, because the component writes through the input event rather than the native binding.',
			'`leading` is not interactive; put a button in `trailing` if it needs to be clickable.'
		],
		related: ['field', 'textarea', 'tag-input']
	},
	{
		name: 'NumberInput',
		slug: 'number-input',
		category: 'forms',
		summary: 'A quantity field with step buttons that does not lose what you typed.',
		description:
			'A number field built on `type="text"`. A native number input empties itself the moment a stray letter lands in it, changes value when the scroll wheel passes over, and hands back an empty string for anything it considers invalid — so the component never sees what the person actually typed. This one parses the text itself.',
		notes: [
			'`value` is `number | null`. An empty field is `null`, which is not the same as `0`, and a form that treats them alike is a bug waiting for a quantity of zero.',
			'Clamping to `min` and `max` happens on blur, not on every keystroke, or typing `100` into a field capped at 50 would stop at `5`.',
			'`step` decides the decimal places, so a step of `0.25` keeps two and never shows `0.30000000000000004`.',
			'The step buttons are out of the tab order: the field is already a spinbutton, and the arrow keys do the same job.'
		],
		keyboard: [
			['↑ / ↓', 'One step'],
			['Page Up / Page Down', 'Ten steps'],
			['Home / End', 'Jumps to min or max, when they are set']
		],
		related: ['input', 'slider', 'field']
	},
	{
		name: 'Textarea',
		slug: 'textarea',
		category: 'forms',
		summary: 'Multi-line input that can grow with its content.',
		related: ['input', 'field']
	},
	{
		name: 'Select',
		slug: 'select',
		category: 'forms',
		summary: 'The native select, styled, with an options array or your own markup.',
		notes: [
			'A real `<select>`, so the phone opens its own picker and the keyboard behaviour is the platform one.'
		],
		related: ['field', 'dropdown-menu', 'command-palette']
	},
	{
		name: 'Checkbox',
		slug: 'checkbox',
		category: 'forms',
		summary: 'Checkbox with a label, help text and an indeterminate state.',
		related: ['switch', 'radio-group']
	},
	{
		name: 'RadioGroup',
		slug: 'radio-group',
		category: 'forms',
		summary: 'A set of radios that share a name and a bound value.',
		parts: ['Radio'],
		notes: [
			'`Radio` reads the group through context, so it has to sit inside a `RadioGroup`. On its own it throws with a readable message rather than silently doing nothing.'
		],
		related: ['checkbox', 'select']
	},
	{
		name: 'SegmentedControl',
		slug: 'segmented-control',
		category: 'forms',
		summary: 'A short list of options as one strip, for choices worth seeing.',
		description:
			'For three or four options that fit on screen, where a select would hide the answer behind a click. It is a radio group, not a tab list: it picks a value rather than swapping a panel, and the arrow keys select as they move, which is how a radio group is meant to behave.',
		notes: [
			'Reach for `Select` once the list gets long or the labels get wordy; this one stops being readable at about four.',
			'The whole strip is one stop in the tab order. Tab moves past it, the arrows move inside it.',
			'`stretch` fills the width, which is what you want in a narrow column or on a phone.'
		],
		keyboard: [
			['← / → or ↑ / ↓', 'Moves to the next option and selects it'],
			['Home / End', 'First or last option']
		],
		exports: ['SegmentedOption'],
		related: ['radio-group', 'tabs', 'select']
	},
	{
		name: 'Switch',
		slug: 'switch',
		category: 'forms',
		summary: 'An on/off toggle for settings that apply immediately.',
		notes: [
			'A `role="switch"` button, not a checkbox. Use it for things that take effect at once; use a checkbox inside a form that gets submitted.'
		],
		related: ['checkbox', 'theme-toggle']
	},
	{
		name: 'Slider',
		slug: 'slider',
		category: 'forms',
		summary: 'A styled range input with an optional formatted value.',
		related: ['progress', 'input']
	},
	{
		name: 'PinInput',
		slug: 'pin-input',
		category: 'forms',
		summary: 'One box per character, for verification codes.',
		keyboard: [
			['Backspace', 'Clears the current box, or steps back and clears the previous one'],
			['← →', 'Moves between boxes'],
			['Paste', 'Fills from the box you pasted into, ignoring anything that does not fit']
		],
		notes: [
			'The first box carries `autocomplete="one-time-code"`, so the phone offers the code from the SMS.'
		],
		related: ['input', 'field']
	},
	{
		name: 'TagInput',
		slug: 'tag-input',
		category: 'forms',
		summary: 'Free-text tags with keyboard editing and a limit.',
		keyboard: [
			['Enter or ,', 'Adds the tag being typed'],
			['Backspace', 'On an empty field, removes the last tag'],
			['Paste', 'Splits on commas and newlines']
		],
		notes: [
			'A rejected tag — duplicate, over the limit or turned down by `validate` — flashes instead of disappearing silently, so Enter never looks broken.'
		],
		related: ['input', 'badge']
	},
	{
		name: 'FileDrop',
		slug: 'file-drop',
		category: 'forms',
		summary: 'A drop zone that is also a real file input.',
		description:
			'A `<label>` wrapped around a hidden file input, which is the whole trick: clicking, tabbing to it and pressing Enter all work because the browser already does them. The drag handling is the only part written by hand.',
		notes: [
			'`accept` is checked on dropped files too. The browser only enforces it in its own dialog, so a drop would otherwise hand you the PDF you said you did not want.',
			'Files that fail `accept` are dropped quietly. Compare the count you get against what you expected if you want to say something about it.',
			'The input is cleared after every pick, so choosing the same file again after removing it still fires.',
			'`multiple` appends to the list rather than replacing it; a single-file drop zone replaces.'
		],
		keyboard: [['Tab, then Enter or Space', 'Opens the file dialog']],
		related: ['tag-input', 'empty-state', 'progress']
	},
	{
		name: 'Label',
		slug: 'label',
		category: 'forms',
		summary: 'A form label with an optional required marker.',
		related: ['field']
	},

	/* -- feedback ------------------------------------------------------------ */
	{
		name: 'Alert',
		slug: 'alert',
		category: 'feedback',
		summary: 'An inline message in six tones, optionally dismissible.',
		notes: [
			'Alerts stay in the layout and stay put. For something that happened elsewhere, use a toast.'
		],
		related: ['toaster', 'badge']
	},
	{
		name: 'Toaster',
		slug: 'toaster',
		category: 'feedback',
		summary: 'The toast container, plus the `toast` function that feeds it.',
		description:
			'Mount `Toaster` once in your root layout, then call `toast()` from anywhere — including outside a component, since the queue is plain state rather than context.',
		exports: ['toast'],
		notes: [
			'`duration: 0` keeps a toast until it is dismissed, which is what you want for an error with a retry action.',
			'`toast()` returns an id that `toast.dismiss(id)` takes.'
		],
		related: ['alert', 'modal']
	},
	{
		name: 'Progress',
		slug: 'progress',
		category: 'feedback',
		summary: 'A determinate or indeterminate bar.',
		related: ['progress-ring', 'spinner', 'slider']
	},
	{
		name: 'ProgressRing',
		slug: 'progress-ring',
		category: 'feedback',
		summary: 'The round version, for tight spots and dashboards.',
		related: ['progress', 'spinner']
	},
	{
		name: 'Tooltip',
		slug: 'tooltip',
		category: 'feedback',
		summary: 'A short hint on hover and on keyboard focus.',
		notes: [
			portalNote,
			'Opens on focus as well as hover, so it is reachable without a mouse. Never put anything in it that is only available there.'
		],
		related: ['popover', 'kbd']
	},

	/* -- overlays ------------------------------------------------------------ */
	{
		name: 'Modal',
		slug: 'modal',
		category: 'overlays',
		summary: 'A centred dialog with a backdrop, focus trap and footer slot.',
		keyboard: [
			['Esc', 'Closes, unless `dismissible` is false'],
			['Tab', 'Cycles inside the dialog']
		],
		notes: [
			portalNote,
			'Locks body scrolling while open, counted, so nested overlays do not unlock it early.',
			'Focus moves to the first focusable element and returns to the opener on close.'
		],
		related: ['drawer', 'popover', 'command-palette']
	},
	{
		name: 'Drawer',
		slug: 'drawer',
		category: 'overlays',
		summary: 'The same dialog, sliding in from any edge.',
		keyboard: [['Esc', 'Closes, unless `dismissible` is false']],
		notes: [portalNote, 'Takes the modal props plus `side`.'],
		related: ['modal', 'popover']
	},
	{
		name: 'Popover',
		slug: 'popover',
		category: 'overlays',
		summary: 'A positioned panel anchored to a trigger you supply.',
		keyboard: [['Esc', 'Closes and returns focus to the trigger']],
		notes: [
			portalNote,
			'Flips to the other side when the preferred one does not fit, and stays clear of the viewport edge.',
			'The trigger snippet receives the attributes to spread, which is what keeps `aria-expanded` correct.'
		],
		related: ['dropdown-menu', 'tooltip', 'modal']
	},
	{
		name: 'DropdownMenu',
		slug: 'dropdown-menu',
		category: 'overlays',
		summary: 'An anchored menu with full keyboard control.',
		parts: ['MenuItem', 'MenuLabel', 'MenuSeparator'],
		keyboard: [
			['↑ ↓', 'Moves between items, wrapping at the ends'],
			['Home / End', 'First and last item'],
			['Esc', 'Closes and returns focus to the trigger'],
			['Tab', 'Closes and moves on']
		],
		notes: [
			portalNote,
			'Opening with the mouse or the keyboard focuses the first item either way.'
		],
		related: ['popover', 'command-palette', 'select']
	},
	{
		name: 'CommandPalette',
		slug: 'command-palette',
		category: 'overlays',
		summary: 'Fuzzy search over a list of commands, on a global shortcut.',
		description:
			'The ⌘K dialog. Hand it an array of commands with groups, keywords and callbacks; it handles the search, the grouping and the keyboard.',
		keyboard: [
			['⌘K / Ctrl+K', 'Opens and closes it, unless `shortcut` says otherwise'],
			['↑ ↓', 'Moves through the results'],
			['Enter', 'Runs the highlighted command'],
			['Esc', 'Closes']
		],
		notes: [
			'Search matches labels and keywords; a plain substring ranks above a scattered match, and a match at the start of a word ranks highest.',
			'Built as a combobox: focus stays in the input and the active option is announced through `aria-activedescendant`.'
		],
		related: ['dropdown-menu', 'modal']
	},

	/* -- navigation ---------------------------------------------------------- */
	{
		name: 'Tabs',
		slug: 'tabs',
		category: 'navigation',
		summary: 'Underlined or pill tabs with arrow-key navigation.',
		parts: ['TabList', 'Tab', 'TabPanel'],
		keyboard: [
			['← →', 'Moves to the previous or next tab and selects it'],
			['Home / End', 'First and last tab']
		],
		notes: [
			'Panels only render while selected, so an expensive panel costs nothing until it is opened.',
			'The strip scrolls sideways when the tabs do not fit, rather than wrapping or overflowing.'
		],
		related: ['accordion', 'pagination']
	},
	{
		name: 'Accordion',
		slug: 'accordion',
		category: 'navigation',
		summary: 'Collapsible sections, one at a time or several at once.',
		parts: ['AccordionItem'],
		notes: [
			'`type="multiple"` takes an array as its bound value; the single variant takes a string.'
		],
		related: ['tabs']
	},
	{
		name: 'Navbar',
		slug: 'navbar',
		category: 'navigation',
		summary: 'A top bar or a sidebar, from the same links.',
		description:
			'One component for both places a site keeps its links. `orientation="horizontal"` is a top bar that folds into a menu button on small screens; `vertical` is a sidebar with optional section headings. Pass the current path once and every link works out on its own whether it is the page you are on.',
		parts: ['NavbarLink', 'NavbarGroup'],
		keyboard: [['Esc', 'Closes the folded menu and returns focus to its button']],
		notes: [
			'Renders a `<nav>` with a real list inside, so screen readers announce the landmark and the number of links. Give each navbar on a page its own `label`.',
			'The active link gets `aria-current="page"`. `match="prefix"` keeps a section lit on the pages below it; `active` overrides the comparison entirely.',
			'A horizontal bar folds at `md` by default. The breakpoint follows the viewport, not the container, so in a narrow preview it only folds once the window does.',
			'A sidebar does not hide itself on phones. Put the vertical navbar in a `Drawer` there, as in the last example.',
			'Clicking a link closes the folded menu, which matters with client-side routing where the page never reloads.'
		],
		related: ['breadcrumb', 'tabs', 'drawer']
	},
	{
		name: 'Breadcrumb',
		slug: 'breadcrumb',
		category: 'navigation',
		summary: 'The trail back up, from an array of items.',
		notes: ['The last item is rendered as the current page and is never a link.'],
		related: ['pagination']
	},
	{
		name: 'Pagination',
		slug: 'pagination',
		category: 'navigation',
		summary: 'Page numbers with ellipses, and a compact mode on phones.',
		notes: [
			'Below the `sm` breakpoint the numbers are replaced by the position, because a dozen buttons do not fit on a phone.'
		],
		related: ['table', 'breadcrumb']
	},

	/* -- data ---------------------------------------------------------------- */
	{
		name: 'Table',
		slug: 'table',
		category: 'data',
		summary: 'Styling for plain table markup, in two tones.',
		description:
			'It styles `thead` and `tbody`; the markup stays yours. Sorting and selection are deliberately left out, because every project wants them slightly differently.',
		notes: [
			'`tone="accent"` carries the theme colour into the header, the stripes and the hover state.',
			'`<tr aria-selected="true">` marks a selected row in either tone.',
			'The wrapper scrolls sideways, so a wide table does not break the page on a phone.'
		],
		related: ['pagination', 'stat']
	},
	{
		name: 'Stat',
		slug: 'stat',
		category: 'data',
		summary: 'A single number with a label and a trend.',
		related: ['sparkline', 'count-up', 'table']
	},
	{
		name: 'Sparkline',
		slug: 'sparkline',
		category: 'data',
		summary: 'A trend line that fills its container, without a chart library.',
		notes: [
			'The line keeps its stroke width while the SVG stretches, and the end dot stays round.',
			'Give it a `label`: to a screen reader a sparkline is a picture and needs describing.'
		],
		related: ['stat', 'heatmap']
	},
	{
		name: 'Heatmap',
		slug: 'heatmap',
		category: 'data',
		summary: 'One cell per value, shaded with the accent.',
		notes: [
			'`fit` fills the width, down to `minCell`; past that the grid scrolls instead of becoming unreadable.'
		],
		related: ['sparkline', 'stat']
	},

	/* -- effects ------------------------------------------------------------- */
	{
		name: 'Typewriter',
		slug: 'typewriter',
		category: 'effects',
		summary: 'Types a line, pauses, deletes it and moves to the next.',
		notes: [
			'`reserve` holds the width of the longest string, so the text around it does not jump.',
			motionNote,
			srNote
		],
		related: ['caret', 'scramble', 'terminal']
	},
	{
		name: 'Terminal',
		slug: 'terminal',
		category: 'effects',
		summary: 'A fake shell session that types itself.',
		notes: [
			'Reserves the height of every line up front, so the box does not grow while it types.',
			'Waits until it scrolls into view unless `startOnView` is false.',
			srNote
		],
		related: ['typewriter', 'caret', 'code']
	},
	{
		name: 'Caret',
		slug: 'caret',
		category: 'effects',
		summary: 'The blinking bar on its own, in three shapes.',
		related: ['typewriter', 'terminal']
	},
	{
		name: 'Scramble',
		slug: 'scramble',
		category: 'effects',
		summary: 'Settles from random glyphs into the real text.',
		notes: ['Plays on scroll, on hover or whenever the text changes.', motionNote, srNote],
		related: ['typewriter', 'count-up']
	},
	{
		name: 'CountUp',
		slug: 'count-up',
		category: 'effects',
		summary: 'Counts to a number when it scrolls into view.',
		notes: [
			'After the first run it animates from the old value to the new one.',
			motionNote,
			srNote
		],
		related: ['odometer', 'stat']
	},
	{
		name: 'Odometer',
		slug: 'odometer',
		category: 'effects',
		summary: 'Digits that roll like a mechanical counter.',
		notes: ['Digits are keyed from the right, so the ones column stays put as the number grows.'],
		related: ['count-up', 'stat']
	},
	{
		name: 'Marquee',
		slug: 'marquee',
		category: 'effects',
		summary: 'A looping strip that pauses on hover.',
		notes: [
			'Repeats the content enough times to cover the container, so the loop never shows a gap.'
		],
		related: ['reveal']
	},
	{
		name: 'Reveal',
		slug: 'reveal',
		category: 'effects',
		summary: 'Fades content in as it scrolls into view.',
		notes: [
			'Content already on screen at load is left alone, unless you pass `appear`.',
			'Stagger a row by giving each one a larger `delay`.',
			motionNote
		],
		related: ['highlight', 'marquee']
	},
	{
		name: 'Highlight',
		slug: 'highlight',
		category: 'effects',
		summary: 'A marker stroke that draws itself across the text.',
		notes: [
			'Survives a line break, because the stroke is a background rather than a box.',
			motionNote
		],
		related: ['reveal', 'typewriter']
	}
];

/**
 * Page titles, for the handful of components whose own name is not the word
 * anyone would search for. Everything else is derived below: "Svelte table
 * component" is what people type, and it beats "Table — cock" by a mile.
 */
const titles: Record<string, string> = {
	Avatar: 'Svelte avatar with initials fallback',
	Caret: 'Blinking caret for Svelte',
	Code: 'Inline code styling for Svelte',
	CommandPalette: 'Svelte command palette, Ctrl+K search',
	CopyButton: 'Copy to clipboard button for Svelte',
	CountUp: 'Animated number counter for Svelte',
	Drawer: 'Svelte drawer and slide-over panel',
	DropdownMenu: 'Svelte dropdown menu with keyboard nav',
	EmptyState: 'Empty state component for Svelte',
	Field: 'Form field labels and errors in Svelte',
	Heatmap: 'Contribution heatmap for Svelte',
	Highlight: 'Text highlight marker for Svelte',
	Kbd: 'Keyboard key badge for Svelte',
	Marquee: 'Svelte marquee and logo ticker',
	Modal: 'Svelte modal dialog component',
	Navbar: 'Svelte navbar and sidebar component',
	Odometer: 'Rolling odometer digits for Svelte',
	PinInput: 'One-time code input for Svelte',
	Reveal: 'Scroll reveal animation for Svelte',
	Scramble: 'Text scramble effect for Svelte',
	Separator: 'Svelte separator and divider',
	Skeleton: 'Skeleton loading placeholder for Svelte',
	Sparkline: 'Svelte sparkline, no chart library',
	Spinner: 'Loading spinner for Svelte',
	Stat: 'Stat tiles for Svelte dashboards',
	Switch: 'Svelte toggle switch component',
	Table: 'Svelte table component for Tailwind',
	Terminal: 'Animated terminal for Svelte',
	ThemeToggle: 'Dark mode toggle for Svelte',
	Toaster: 'Svelte toast notifications',
	Typewriter: 'Typewriter effect for Svelte'
};

/** The `<title>` of a component page. Kept under 60 characters; see `titles`. */
export function pageTitle(entry: ComponentMeta): string {
	const named = titles[entry.name];
	if (named) return named;

	const phrase = entry.name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
	return `Svelte ${phrase} ${entry.category === 'effects' ? 'effect' : 'component'}`;
}

export const bySlug = new Map(components.map((entry) => [entry.slug, entry]));

export function categoryOf(id: string): CategoryMeta {
	return categories.find((category) => category.id === id)!;
}

/** Components grouped for the sidebar and the index, in category order. */
export const grouped = categories.map((category) => ({
	category,
	items: components.filter((entry) => entry.category === category.id)
}));
