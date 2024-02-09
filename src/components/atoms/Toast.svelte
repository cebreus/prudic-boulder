<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { toasts, dismissToast } from '../utils/TostService.mjs';
	import { mdiClose, mdiInformation } from '@mdi/js';
	import Icon from '../../icons/Icon.svelte';


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

	const getProgressColorClass = (type) => {
		return {
			success: 'h-1 bg-green-500',
			warning: 'h-1 bg-red-500',
			info: 'h-1 bg-blue-500',
		}[type] || 'h-1 bg-gray-500';
	}
</script>
{#if toastsArray.length > 0}
	<section class="fixed top-5 right-5 z-50" transition:fade>
		{#each toastsArray as toast (toast.id)}
			<article class="relative bg-white rounded-lg p-4 mb-3 max-w-sm shadow-lg flex items-start overflow-hidden" role="alert">
				<div class="absolute top-0 left-0 right-0 h-1 bg-gray-200">
					<div class="{getProgressColorClass(toast.type)} rounded-b-lg" style="width: {toast.progress}%; transition: width linear;"></div>
				</div>
				<div class="{getIconColorClass(toast.type)} flex-shrink-0">
					{#if toast.type === 'info'}
						<Icon path={mdiInformation} width="1.2em" fill={getIconColorClass(toast.type)} strokeColor="{getIconColorClass(toast.type)} "/>
					{:else if toast.type === 'warning'}
						<Icon path={mdiInformation} width="1.2em" fill={getIconColorClass(toast.type)} strokeColor="{getIconColorClass(toast.type)} "/>
					{:else}
						<Icon path={mdiInformation} width="1.2em" fill={getIconColorClass(toast.type)} strokeColor="{getIconColorClass(toast.type)} "/>
					{/if}
				</div>
				<div class="flex-grow mx-2 my-1 ml-3">
					<p class="text-base pt-0.5 flex-1-1-0 leading-5">{toast.message}</p>
					<p class="text-sm text-gray-500 my-0.5">{toast.extraMessage}</p>
				</div>
				{#if toast.dismissible}
					<button class="ml-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none" on:click={() => dismissToast(toast.id)}>
						<Icon path={mdiClose}/>
					</button>
				{/if}
			</article>
		{/each}
	</section>
{/if}