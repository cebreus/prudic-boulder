export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
	id: string;
	variant: ToastVariant;
	title: string;
	description: string;
	dismissible: boolean;
	progress: number;
	timeout: number;
}

interface ToastStyleConfig {
	classes: string;
	classesDesc: string;
	icon: string;
	iconClasses: string;
	progressClasses: string;
	role: 'status' | 'alert';
	ariaLive: 'assertive' | 'polite' | 'off';
}

export type ToastConfig = Record<ToastVariant, ToastStyleConfig>;
