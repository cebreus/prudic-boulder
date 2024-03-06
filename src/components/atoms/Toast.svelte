<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { toasts, dismissToast } from '../utils/ToastService';
	import { twMerge } from 'tailwind-merge';
	import Icon from '../../components/atoms/Icon.svelte';
	import {
		mdiClose,
		mdiInformationSlabCircle,
		mdiCheckCircleOutline,
		mdiCloseOctagon,
		mdiAlert
	} from '@mdi/js';

	// Define TypeScript types for variants and configuration
	import type { ToastVariant, Toast, ToastConfig } from '../utils/ToastTypes';

	// Exported props for external configuration
	export let variant: ToastVariant = 'info';

	// Default classes
	const defaultClass: string = `flex gap-3 jus overflow-clip leading-tight relative mb-3 w-60 max-w-sm items-start rounded-lg bg-white p-4 text-sm shadow-lg md:w-80 dark:bg-slate-800`;

	// Configuration and classes based on variant
	const toastConfig: ToastConfig = {
		info: {
			classes: 'text-slate-800 dark:text-slate-200',
			classesDesc: 'text-slate-500 dark:text-slate-300',
			icon: mdiInformationSlabCircle,
			iconClasses: 'text-blue-400',
			progressClasses: 'bg-blue-400',
			role: 'status',
			ariaLive: 'off'
		},
		success: {
			classes: 'text-slate-800 dark:text-slate-200',
			classesDesc: 'text-slate-500 dark:text-slate-400',
			icon: mdiCheckCircleOutline,
			iconClasses: 'text-green-400',
			progressClasses: 'bg-green-400',
			role: 'status',
			ariaLive: 'polite'
		},
		error: {
			classes: 'text-slate-800 dark:text-slate-200',
			classesDesc: 'text-slate-500 dark:text-slate-400',
			icon: mdiCloseOctagon,
			iconClasses: 'text-red-400',
			progressClasses: 'bg-red-400',
			role: 'alert',
			ariaLive: 'assertive'
		},
		warning: {
			classes: 'text-slate-800 dark:text-slate-200',
			classesDesc: 'text-slate-500 dark:text-slate-400',
			icon: mdiAlert,
			iconClasses: 'text-amber-500',
			progressClasses: 'bg-amber-500',
			role: 'alert',
			ariaLive: 'assertive'
		}
	};

	// Retrieve settings for the specified variant or default to 'info'
	let toastSettings = toastConfig[variant] || toastConfig['info'];

	// Final class construction using reactive statement for Svelte
	$: toastClass = twMerge(defaultClass, toastSettings.classes);

	let toastsArray: Toast[] = [];

	const unsubscribe = toasts.subscribe(($toasts: Toast[]) => {
		toastsArray = $toasts;
	});

	onMount(() => {
		return () => {
			unsubscribe();
		};
	});

	onDestroy(unsubscribe);
</script>

{#if toastsArray.length > 0}
	<div
		data-cy="toast-wrapper"
		class="fixed right-0 top-0 z-50 max-h-screen overflow-auto pr-5 pt-5"
	>
		{#each toastsArray as toast (toast.id)}
			<div
				data-cy="toast"
				class={toastClass}
				role={toastConfig[toast.variant].role}
				aria-live={toastConfig[toast.variant].ariaLive}
			>
				<div
					data-cy="progress"
					class="absolute inset-x-0 top-0 h-1 overflow-clip rounded-t bg-slate-200 dark:bg-slate-600"
				>
					<div
						class="h-full transition-[width] {toastConfig[toast.variant].progressClasses}"
						style="width: {toast.progress}%"
					></div>
				</div>
				<Icon
					path={toastConfig[toast.variant].icon}
					class="size-6 {toastConfig[toast.variant].iconClasses}"
				/>
				<div class="mt-0.5 leading-tight">
					{#if toast.title?.length}
						<strong class="block font-semibold">{toast.title}</strong>
					{/if}
					{#if toast.description?.length}
						<div class="mt-1 {toastConfig[toast.variant].classesDesc}">
							{@html toast.description}
						</div>
					{/if}
				</div>
				{#if toast.dismissible}
					<button
						class="ml-auto rounded-full text-slate-400 hover:text-slate-600 focus:outline-none dark:hover:text-slate-200"
						on:click={() => dismissToast(toast.id)}
					>
						<Icon path={mdiClose} class="size-5" />
					</button>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style lang="postcss" global>
	[data-cy='toast'] a {
		@apply underline hover:no-underline;
	}
</style>
