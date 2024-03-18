<script lang="ts">
	import { generateId } from '../../utils/utils';
	import { twMerge } from 'tailwind-merge';
	import Icon from '../../components/atoms/Icon.svelte';
	import log from '../../utils/logger';
	import {
		mdiInformationSlabCircle,
		mdiCheckCircleOutline,
		mdiCloseOctagon,
		mdiAlert
	} from '@mdi/js';

	// Define TypeScript types for variants and configuration
	import type { AlertVariant, AlertConfig } from '../../utils/AlertTypes';

	// Exported props for external configuration
	export let classNames: string = '';
	export let showIcon: boolean = false;
	export let iconName: string = '';
	export let showComponent: boolean = true;
	export let variant: AlertVariant = 'info';

	// Default classes
	const defaultClass: string = 'relative rounded px-4 py-3 text-sm dark:bg-slate-800';
	const withIconClass: string = 'flex flex-row gap-3';

	// Configuration and classes based on variant
	const alertConfig: AlertConfig = {
		info: {
			classes: 'bg-blue-50 text-blue-800 dark:text-blue-400',
			classesDesc: 'text-blue-500 dark:text-blue-300',
			badgeClasses: 'bg-blue-200',
			icon: mdiInformationSlabCircle,
			iconClasses: 'text-blue-400',
			role: 'status',
			ariaLive: 'off'
		},
		success: {
			classes: 'bg-green-50 text-green-800 dark:text-green-400',
			classesDesc: 'text-green-500 dark:text-green-300',
			badgeClasses: 'bg-green-200',
			icon: mdiCheckCircleOutline,
			iconClasses: 'text-green-400',
			role: 'status',
			ariaLive: 'polite'
		},
		error: {
			classes: 'bg-red-50 text-red-800 dark:text-red-400',
			classesDesc: 'text-red-500 dark:text-red-300',
			badgeClasses: 'bg-red-200',
			icon: mdiCloseOctagon,
			iconClasses: 'text-red-400',
			role: 'alert',
			ariaLive: 'assertive'
		},
		warning: {
			classes: 'bg-amber-50 text-amber-800 dark:text-amber-400',
			classesDesc: 'text-amber-500 dark:text-amber-300',
			badgeClasses: 'bg-amber-200',
			icon: mdiAlert,
			iconClasses: 'text-amber-400',
			role: 'alert',
			ariaLive: 'assertive'
		}
	};

	const uniqueId = generateId('alert');

	// Final class construction using reactive statement for Svelte
	$: alertClass = twMerge(
		defaultClass,
		alertConfig[variant].classes,
		showIcon ? withIconClass : '',
		classNames
	);

	$: {
		log.debug(`Component '${uniqueId}':`, {
			variant,
			showIcon,
			iconName,
			showComponent,
			alertClass
		});
	}
</script>

{#if showComponent}
	<div
		id={uniqueId}
		data-cy="alert"
		class={alertClass}
		role={alertConfig[variant].role}
		aria-live={alertConfig[variant].ariaLive ?? 'off'}
		{...$$restProps}
	>
		{#if showIcon}
			<Icon
				class="min-h-5 min-w-5  {alertConfig[variant].iconClasses}"
				path={alertConfig[variant].icon}
			/>
			<div>
				<slot name="title" />
				<slot name="description" />
				<slot />
			</div>
		{:else}
			<slot name="title" />
			<slot name="description" />
			<slot />
		{/if}
	</div>
{/if}
