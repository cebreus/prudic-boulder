<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { toasts, dismissToast } from '../utils/TostService.mjs';
	import SuccessIcon from '../../icons/SuccessIcon.svelte';
	import InfoIcon from '../../icons/InfoIcon.svelte';
	import CloseIcon from '../../icons/CloseIcon.svelte';

	let toastsArray = [];

	const unsubscribe = toasts.subscribe(($toasts) => {
		toastsArray = $toasts;
	});

	onMount(() => {
		return () => {
			unsubscribe();
		};
	});

	onDestroy(unsubscribe);

	const getIconColorClass = (type) => {
		return {
			success: 'text-green-500',
			warning: 'text-red-500',
			info: 'text-blue-500',
		}[type] || 'text-gray-500';
	};
</script>
{#if toastsArray.length > 0}
	<section class="fixed top-5 right-5 z-50 " transition:fade>
		{#each toastsArray as toast (toast.id)}
			<article class="bg-white rounded-lg p-4 mb-3 max-w-sm shadow-lg flex items-start" role="alert">
				<div class="{getIconColorClass(toast.type)} flex-shrink">
					{#if toast.type === 'success'}
						<SuccessIcon width="1.3em" />
					{:else if toast.type === 'warning'}
						<InfoIcon width="1.3em" />
					{:else}
						<InfoIcon width="1.3em" />
					{/if}
				</div>
				<div class="flex-grow mx-2 my-1 ml-0.75">
					<p class="text-l pt-0.5 flex-1-1-0 leading-5">{toast.message}</p>
					<!-- Here is the extra details paragraph -->
					<p class="text-xs text-gray-500">Anyone with a link can now view this file.</p>
				</div>
				{#if toast.dismissible}
					<button class="ml-1 rounded-full text-gray-400 hover:text-gray-500" on:click={() => dismissToast(toast.id)}>
						<CloseIcon width="0.7em" />
					</button>
				{/if}
			</article>
		{/each}
	</section>
{/if}