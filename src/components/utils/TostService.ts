import { writable } from 'svelte/store';

import type { Toast, ToastVariant } from './toastTypes';

export const toasts = writable<Toast[]>([]);

export const dismissToast = (id: string): void => {
	toasts.update((allToasts) => allToasts.filter((toast) => toast.id !== id));
};

export const addToast = (variant: ToastVariant, title: string, description: string = ''): void => {
	const id = `${Date.now()}-${Math.random().toString(16).slice(8)}`;
	const baseTimeout = 50000;
	const incrementalTimeout = 50;
	const timeout = Math.max(baseTimeout + (title.length + description.length) * incrementalTimeout);

	// console.log(`Toast ID: ${id}, Timeout: ${timeout}`);

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

	const intervalDuration = 10;
	const totalSteps = timeout / intervalDuration;
	const progressDecrement = 100 / totalSteps;

	const intervalId = setInterval(() => {
		toasts.update((allToasts) =>
			allToasts.map((currentToast) => {
				if (currentToast.id === id) {
					const updatedProgress = currentToast.progress - progressDecrement;
					return { ...currentToast, progress: Math.max(0, updatedProgress) };
				}
				return currentToast;
			})
		);
	}, intervalDuration);

	setTimeout(() => {
		clearInterval(intervalId);
		dismissToast(id);
	}, timeout);
};
