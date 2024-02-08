import { writable } from 'svelte/store';

export const toasts = writable([]);

export const dismissToast = (id) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

export const addToast = (type, message) => {
	const id = Math.floor(Math.random() * 10000);
	const defaults = { id, type: 'info', dismissible: true, timeout: 150000 };

	toasts.update((all) => [{ ...defaults, type, message }, ...all]);

	if (defaults.timeout) setTimeout(() => dismissToast(id), defaults.timeout);
};
