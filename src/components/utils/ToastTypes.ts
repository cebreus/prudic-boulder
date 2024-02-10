export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export type Toast = {
	id: string;
	variant: ToastVariant;
	title: string;
	description: string;
	dismissible: boolean;
	progress: number;
	timeout: number;
};
