import { writable } from 'svelte/store';
import type { Toast, ToastVariant } from './ToastTypes';
import { generateId } from './utils';
import log from '../utils/logger';

export const toasts = writable<Toast[]>([]);

// Dismiss a toast by ID
export const dismissToast = (id: string): void => {
	if (typeof id !== 'string' || id.trim() === '') {
		log.error('Invalid or empty ID provided to dismissToast');
		return;
	}
	toasts.update((allToasts) => allToasts.filter((toast) => toast.id !== id));
};

// Add a new toast with progress bar logic
export const addToast = (
	title: string,
	variant: ToastVariant = 'info',
	description: string = ''
): void => {
	if (typeof title !== 'string' || title.trim() === '') {
		log.error('Title must be a non-empty string in addToast');
		return;
	}

	if (typeof description !== 'string') {
		log.error('Description must be a string in addToast');
		return;
	}

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
	if (typeof id !== 'string' || id.trim() === '') {
		log.error('Invalid id provided to updateToastProgress');
		return;
	}
	if (typeof timeout !== 'number' || timeout <= 0) {
		log.error(
			'Invalid timeout provided to updateToastProgress. Timeout must be a positive number.'
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
