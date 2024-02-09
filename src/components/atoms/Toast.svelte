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
		return (
			{
				success: 'text-green-500',
				warning: 'text-red-500',
				info: 'text-blue-500'
			}[type] || 'text-gray-500'
		);
	};

	const getProgressColorClass = (type) => {
		return (
			{
				success: 'h-1 bg-green-500',
				warning: 'h-1 bg-red-500',
				info: 'h-1 bg-blue-500'
			}[type] || 'h-1 bg-gray-500'
		);
	};
</script>

{#if toastsArray.length > 0}
	<section class="fixed right-5 top-5 z-50" transition:fade>
		{#each toastsArray as toast (toast.id)}
			<article
				class="relative mb-3 flex max-w-sm items-start overflow-hidden rounded-lg bg-white p-4 shadow-lg"
				role="alert"
			>
				<div class="absolute left-0 right-0 top-0 h-1 bg-gray-200">
					<div
						class="{getProgressColorClass(toast.type)} rounded-b-lg"
						style="width: {toast.progress}%; transition: width linear;"
					></div>
				</div>
				<div class="{getIconColorClass(toast.type)} flex-shrink-0">
					{#if toast.type === 'info'}
						<Icon
							path={mdiInformation}
							width="1.2em"
							fill={getIconColorClass(toast.type)}
							strokeColor="{getIconColorClass(toast.type)} "
						/>
					{:else if toast.type === 'warning'}
						<Icon
							path={mdiInformation}
							width="1.2em"
							fill={getIconColorClass(toast.type)}
							strokeColor="{getIconColorClass(toast.type)} "
						/>
					{:else}
						<Icon
							path={mdiInformation}
							width="1.2em"
							fill={getIconColorClass(toast.type)}
							strokeColor="{getIconColorClass(toast.type)} "
						/>
					{/if}
				</div>
				<div class="mx-2 my-1 ml-3 flex-grow">
					<p class="flex-1-1-0 pt-0.5 text-base leading-5">{toast.message}</p>
					<p class="my-0.5 text-sm text-gray-500">{toast.extraMessage}</p>
				</div>
				{#if toast.dismissible}
					<button
						class="ml-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
						on:click={() => dismissToast(toast.id)}
					>
						<Icon path={mdiClose} />
					</button>
				{/if}
			</article>
		{/each}
	</section>
{/if}
