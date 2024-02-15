import { writable } from 'svelte/store';
import type { Toast, ToastVariant } from './ToastTypes';
import { generateId } from './utils.mjs';

export const toasts = writable<Toast[]>([]);

// Utility function to calculate timeout based on message length
function calculateTimeout(title: string, description: string): number {
	const baseTimeout = 2000;
	const incrementalTimeout = 30;
	return baseTimeout + (title.length + description.length) * incrementalTimeout;
}

// Dismiss a toast by ID
export const dismissToast = (id: string): void => {
	toasts.update((allToasts) => allToasts.filter((toast) => toast.id !== id));
};

// Add a new toast with progress bar logic
export const addToast = (variant: ToastVariant, title: string, description: string = ''): void => {
	const id = generateId();
	const timeout = calculateTimeout(title, description);

	const toast: Toast = {
		id,
		variant,
		title,
		description,
		dismissible: true,
		progress: 100,
		timeout
	};

	toasts.update((allToasts) => [toast, ...allToasts]);

	updateToastProgress(id, timeout);
};

// Handle the progress bar update logic separately for clarity
function updateToastProgress(id: string, timeout: number): void {
	const intervalDuration = 10;
	const totalSteps = timeout / intervalDuration;
	const progressDecrement = 100 / totalSteps;

	let currentProgress = 100;

	const intervalId = setInterval(() => {
		currentProgress = Math.max(0, currentProgress - progressDecrement);

		if (currentProgress <= 0) {
			clearInterval(intervalId);
			dismissToast(id);
		} else {
			toasts.update((allToasts) =>
				allToasts.map((toast) => {
					if (toast.id === id) {
						return { ...toast, progress: currentProgress };
					}
					return toast;
				})
			);
		}
	}, intervalDuration);
}
