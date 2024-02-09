<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let classNames = '';
	let showComponent: boolean = true;

	// Exported props for external configuration
	export { classNames as class };
	export let variant: 'success' | 'error' | 'warning' | 'info' = 'info';

	// Default classes
	const defaultClass: string =
		'relative flex flex-row gap-3 rounded px-4 py-3 gap-3 text-sm dark:bg-slate-800';

	// Configuration and classes based on variant
	const alertConfig: {
		// eslint-disable-next-line no-unused-vars
		[key in typeof variant]: {
			classes: string;
			badgeClasses: string;
			role: 'status' | 'alert';
			ariaLive: 'assertive' | 'polite' | 'off';
		};
	} = {
		info: {
			classes: 'bg-blue-50 text-blue-800 dark:text-blue-400',
			badgeClasses: 'bg-blue-200',
			role: 'status',
			ariaLive: 'off'
		},
		success: {
			classes: 'bg-green-50 text-green-800 dark:text-green-400',
			badgeClasses: 'bg-green-200',
			role: 'status',
			ariaLive: 'polite'
		},
		error: {
			classes: 'bg-red-50 text-red-800 dark:text-red-400',
			badgeClasses: 'bg-red-200',
			role: 'alert',
			ariaLive: 'assertive'
		},
		warning: {
			classes: 'bg-amber-50 text-amber-800 dark:text-amber-400',
			badgeClasses: 'bg-amber-200',
			role: 'alert',
			ariaLive: 'assertive'
		}
	};

	// Retrieve settings for the specified variant or default to 'info'
	let alertSettings = alertConfig[variant] || alertConfig['info'];

	// Final class construction
	$: alertClass = twMerge(defaultClass, alertSettings.classes, classNames);
</script>

{#if showComponent}
	<div
		data-cy="alert"
		class={alertClass}
		role={alertSettings.role}
		aria-live={alertSettings.ariaLive ?? 'off'}
		{...$$restProps}
	>
		<slot />
	</div>
{/if}
