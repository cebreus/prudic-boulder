import { generateId, calculateTimeout } from './utils';
import { writable } from 'svelte/store';
import log from '../utils/logger';

import type { Toast, ToastVariant } from './ToastTypes';

export const toasts = writable<Toast[]>([]);

// Utility function for logging and validation
const validateNonEmptyString = (value: string, context: string): boolean => {
	const isValid = value.trim() !== '';
	if (!isValid) {
		log.error(`Invalid or empty string provided to ${context}`);
	}
	return isValid;
};

// Dismiss a toast by ID
export const dismissToast = (id: string): void => {
	if (!validateNonEmptyString(id, 'dismissToast')) return;

	toasts.update((allToasts) => allToasts.filter((toast) => toast.id !== id));
};

// Add a new toast with progress bar logic
export const addToast = (
	title: string,
	variant: ToastVariant = 'info',
	description: string = ''
): void => {
	if (!validateNonEmptyString(title, 'addToast')) return;

	const id = generateId('toast');
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
const updateToastProgress = (id: string, timeout: number): void => {
	// Kontrola platnosti vstupních dat
	if (!validateNonEmptyString(id, 'updateToastProgress') || timeout <= 0) {
		log.error(
			`Invalid timeout (${timeout}) provided to updateToastProgress. Timeout must be a positive number.`
		);
		return;
	}

	const updateIntervalMs = 10;
	const decrementAmount = (updateIntervalMs / timeout) * 100;

	let progress = 100;

	const updateProgress = (): void => {
		progress = Math.max(0, progress - decrementAmount);

		toasts.update((allToasts) =>
			allToasts.map((toast) => (toast.id === id ? { ...toast, progress } : toast))
		);

		if (progress <= 0) {
			clearInterval(intervalId);
			dismissToast(id);
		}
	};

	const intervalId = setInterval(updateProgress, updateIntervalMs);
};
