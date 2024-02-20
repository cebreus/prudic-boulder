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
export type ToastConfig = Record<
	ToastVariant,
	{
		classes: string;
		classesDesc: string;
		icon: string;
		iconClasses: string;
		progressClasses: string;
		role: 'status' | 'alert';
		ariaLive: 'assertive' | 'polite' | 'off';
	}
>;
