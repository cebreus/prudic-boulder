export type AlertVariant = 'success' | 'info' | 'warning' | 'error';

interface AlertStyleConfig {
	classes: string;
	classesDesc: string;
	badgeClasses: string;
	icon: string;
	iconClasses: string;
	role: 'status' | 'alert';
	ariaLive: 'assertive' | 'polite' | 'off';
}

export type AlertConfig = Record<AlertVariant, AlertStyleConfig>;
