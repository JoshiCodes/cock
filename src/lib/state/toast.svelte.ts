import { uid } from '../utils/id.js';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastOptions {
	title?: string;
	description?: string;
	variant?: ToastVariant;
	/** Milliseconds before it dismisses itself. `0` keeps it until dismissed. */
	duration?: number;
	action?: { label: string; onclick: () => void };
}

export interface Toast extends ToastOptions {
	id: string;
	title: string;
	variant: ToastVariant;
	duration: number;
}

class ToastState {
	items = $state<Toast[]>([]);
	#timers = new Map<string, ReturnType<typeof setTimeout>>();

	push(title: string, options: ToastOptions = {}): string {
		const id = uid('toast');
		const toast: Toast = {
			duration: 4500,
			variant: 'default',
			...options,
			id,
			title
		};

		this.items = [...this.items, toast];

		if (toast.duration > 0 && typeof window !== 'undefined') {
			this.#timers.set(
				id,
				setTimeout(() => this.dismiss(id), toast.duration)
			);
		}
		return id;
	}

	dismiss(id: string) {
		const timer = this.#timers.get(id);
		if (timer) {
			clearTimeout(timer);
			this.#timers.delete(id);
		}
		this.items = this.items.filter((item) => item.id !== id);
	}

	clear() {
		for (const timer of this.#timers.values()) clearTimeout(timer);
		this.#timers.clear();
		this.items = [];
	}
}

const state = new ToastState();

/** `toast('Saved')`, `toast.success('Deployed', { description: '…' })` */
export const toast = Object.assign(
	(title: string, options?: ToastOptions) => state.push(title, options),
	{
		success: (title: string, options?: ToastOptions) =>
			state.push(title, { ...options, variant: 'success' }),
		warning: (title: string, options?: ToastOptions) =>
			state.push(title, { ...options, variant: 'warning' }),
		error: (title: string, options?: ToastOptions) =>
			state.push(title, { ...options, variant: 'danger' }),
		info: (title: string, options?: ToastOptions) =>
			state.push(title, { ...options, variant: 'info' }),
		dismiss: (id: string) => state.dismiss(id),
		clear: () => state.clear()
	}
);

export const toasts = state;
