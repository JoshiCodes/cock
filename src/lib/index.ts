/* ---------------------------------------------------------------------------
   CoCK — Core Component Kit
   Everything is exported from here:  import { Button, Card } from 'cock';
   --------------------------------------------------------------------------- */

/* -- primitives ----------------------------------------------------------- */
export { default as Avatar } from './components/primitives/Avatar.svelte';
export { default as Badge } from './components/primitives/Badge.svelte';
export { default as Button } from './components/primitives/Button.svelte';
export { default as Code } from './components/primitives/Code.svelte';
export { default as CopyButton } from './components/primitives/CopyButton.svelte';
export { default as Kbd } from './components/primitives/Kbd.svelte';
export { default as Separator } from './components/primitives/Separator.svelte';
export { default as Skeleton } from './components/primitives/Skeleton.svelte';
export { default as Spinner } from './components/primitives/Spinner.svelte';
export { default as ThemeToggle } from './components/primitives/ThemeToggle.svelte';

/* -- layout --------------------------------------------------------------- */
export { default as Card } from './components/layout/Card.svelte';
export { default as CardHeader } from './components/layout/CardHeader.svelte';
export { default as CardTitle } from './components/layout/CardTitle.svelte';
export { default as CardDescription } from './components/layout/CardDescription.svelte';
export { default as CardContent } from './components/layout/CardContent.svelte';
export { default as CardFooter } from './components/layout/CardFooter.svelte';
export { default as EmptyState } from './components/layout/EmptyState.svelte';
export { default as ScrollArea } from './components/layout/ScrollArea.svelte';

/* -- forms ---------------------------------------------------------------- */
export { default as Checkbox } from './components/forms/Checkbox.svelte';
export { default as ColorPicker } from './components/forms/ColorPicker.svelte';
export { default as Combobox } from './components/forms/Combobox.svelte';
export { default as Field } from './components/forms/Field.svelte';
export { default as FileDrop } from './components/forms/FileDrop.svelte';
export { default as Input } from './components/forms/Input.svelte';
export { default as Label } from './components/forms/Label.svelte';
export { default as NumberInput } from './components/forms/NumberInput.svelte';
export { default as PinInput } from './components/forms/PinInput.svelte';
export { default as Radio } from './components/forms/Radio.svelte';
export { default as RadioGroup } from './components/forms/RadioGroup.svelte';
export { default as SegmentedControl } from './components/forms/SegmentedControl.svelte';
export { default as Select } from './components/forms/Select.svelte';
export { default as Slider } from './components/forms/Slider.svelte';
export { default as Stepper } from './components/forms/Stepper.svelte';
export { default as Switch } from './components/forms/Switch.svelte';
export { default as TagInput } from './components/forms/TagInput.svelte';
export { default as Textarea } from './components/forms/Textarea.svelte';

/* -- feedback ------------------------------------------------------------- */
export { default as Alert } from './components/feedback/Alert.svelte';
export { default as Progress } from './components/feedback/Progress.svelte';
export { default as ProgressRing } from './components/feedback/ProgressRing.svelte';
export { default as Toaster } from './components/feedback/Toaster.svelte';
export { default as Tooltip } from './components/feedback/Tooltip.svelte';

/* -- overlays ------------------------------------------------------------- */
export { default as CommandPalette } from './components/overlays/CommandPalette.svelte';
export { default as ContextMenu } from './components/overlays/ContextMenu.svelte';
export { default as Drawer } from './components/overlays/Drawer.svelte';
export { default as DropdownMenu } from './components/overlays/DropdownMenu.svelte';
export { default as MenuItem } from './components/overlays/MenuItem.svelte';
export { default as MenuLabel } from './components/overlays/MenuLabel.svelte';
export { default as MenuSeparator } from './components/overlays/MenuSeparator.svelte';
export { default as Modal } from './components/overlays/Modal.svelte';
export { default as Popover } from './components/overlays/Popover.svelte';

/* -- navigation ----------------------------------------------------------- */
export { default as Accordion } from './components/navigation/Accordion.svelte';
export { default as AccordionItem } from './components/navigation/AccordionItem.svelte';
export { default as Breadcrumb } from './components/navigation/Breadcrumb.svelte';
export { default as Navbar } from './components/navigation/Navbar.svelte';
export { default as NavbarGroup } from './components/navigation/NavbarGroup.svelte';
export { default as NavbarLink } from './components/navigation/NavbarLink.svelte';
export { default as Pagination } from './components/navigation/Pagination.svelte';
export { default as Tab } from './components/navigation/Tab.svelte';
export { default as TabList } from './components/navigation/TabList.svelte';
export { default as TabPanel } from './components/navigation/TabPanel.svelte';
export { default as Tabs } from './components/navigation/Tabs.svelte';

/* -- data ----------------------------------------------------------------- */
export { default as Stat } from './components/data/Stat.svelte';
export { default as DataTable } from './components/data/DataTable.svelte';
export { default as Heatmap } from './components/data/Heatmap.svelte';
export { default as Sparkline } from './components/data/Sparkline.svelte';
export { default as Table } from './components/data/Table.svelte';

/* -- effects -------------------------------------------------------------- */
export { default as Caret } from './components/effects/Caret.svelte';
export { default as CountUp } from './components/effects/CountUp.svelte';
export { default as Highlight } from './components/effects/Highlight.svelte';
export { default as Marquee } from './components/effects/Marquee.svelte';
export { default as Odometer } from './components/effects/Odometer.svelte';
export { default as Reveal } from './components/effects/Reveal.svelte';
export { default as Scramble } from './components/effects/Scramble.svelte';
export { default as Terminal } from './components/effects/Terminal.svelte';
export { default as Typewriter } from './components/effects/Typewriter.svelte';

/* -- state ---------------------------------------------------------------- */
export { theme, accents, type ThemeMode, type Accent } from './state/theme.svelte.js';
export { themeScript, themeScriptTag, themeHandle } from './state/theme-script.js';
export {
	toast,
	toasts,
	type Toast,
	type ToastOptions,
	type ToastVariant
} from './state/toast.svelte.js';

/* -- actions -------------------------------------------------------------- */
export { portal } from './actions/portal.js';
export { clickOutside, type ClickOutsideParams } from './actions/clickOutside.js';
export { trapFocus } from './actions/trapFocus.js';

/* -- utils ---------------------------------------------------------------- */
export { anchored, type AnchorParams, type Placement } from './utils/anchor.js';
export { cn, type ClassValue } from './utils/cn.js';
export { uid } from './utils/id.js';
export { lockScroll } from './utils/scrollLock.js';
export { confetti, type ConfettiOptions } from './utils/confetti.js';
export { onHotkey, matchesHotkey, formatHotkey } from './utils/hotkey.js';
export { focusRing, focusRingInset, disabled, transition } from './utils/styles.js';
export { parseColor, formatOklch, oklchToHex, type Oklch } from './utils/oklch.js';

/* -- component types ------------------------------------------------------ */
export type { ButtonVariant, ButtonSize } from './components/primitives/Button.svelte';
export type { BadgeVariant } from './components/primitives/Badge.svelte';
export type { AlertVariant } from './components/feedback/Alert.svelte';
export type { SegmentedOption } from './components/forms/SegmentedControl.svelte';
export type { SelectOption } from './components/forms/Select.svelte';
export type { ComboboxOption } from './components/forms/Combobox.svelte';
export type { StepperStep } from './components/forms/Stepper.svelte';
export type {
	DataTableColumn,
	DataTableSort,
	SortDirection
} from './components/data/DataTable.svelte';
export type { Crumb } from './components/navigation/Breadcrumb.svelte';
export type { TabsVariant } from './components/navigation/Tabs.svelte';
export type { NavbarOrientation, NavbarCollapse } from './components/navigation/Navbar.svelte';
export type { TriggerAttrs } from './components/overlays/Popover.svelte';
export type { Command } from './components/overlays/CommandPalette.svelte';
export type { TerminalLine } from './components/effects/Terminal.svelte';
