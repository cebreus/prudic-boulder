import { writable } from 'svelte/store';

export const toasts = writable([]);

export const dismissToast = (id) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

export const addToast = (type, message, extraMessage, timeout = 15000) => {
	const id = Math.floor(Math.random() * 10000);
	const toast = {
		id,
		type,
		message,
		extraMessage,
		dismissible: true,
		progress: 100 // Начальное значение прогресса 100%
	};

	toasts.update((all) => [toast, ...all]);

	const interval = 10;
	const totalSteps = timeout / interval;
	const progressDecrement = 100 / totalSteps;

	const intervalId = setInterval(() => {
		toasts.update((all) =>
			all.map((t) => {
				if (t.id === id) {
					const updatedProgress = t.progress - progressDecrement;
					return { ...t, progress: Math.max(0, updatedProgress) };
				}
				return t;
			})
		);
	}, interval);

	setTimeout(() => {
		clearInterval(intervalId);
		dismissToast(id);
	}, timeout);
};
