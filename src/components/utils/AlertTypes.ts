export type AlertVariant = 'success' | 'info' | 'warning' | 'error';

export type AlertConfig = Record<
	AlertVariant,
	{
		classes: string;
		classesDesc: string;
		badgeClasses: string;
		icon: string;
		iconClasses: string;
		role: 'status' | 'alert';
		ariaLive: 'assertive' | 'polite' | 'off';
	}
>;
