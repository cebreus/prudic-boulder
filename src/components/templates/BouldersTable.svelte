<script lang="ts">
	import { boulders } from '../../stores/BoulderStore.svelte';
	import { onDestroy } from 'svelte';
	import Alert from '../atoms/Alert.svelte';
	import BoulderComponent from '../atoms/Boulder.svelte';
	import Icon from '../atoms/Icon.svelte';
	import Dialog from '../molecules/Dialog.svelte';
	import Toast from '../atoms/Toast.svelte';
	import { mdiDelete } from '@mdi/js';
	import type { Boulder } from '../utils/BoulderTypes.ts';
	import log from 'loglevel';
	import { fade, fly } from 'svelte/transition';

	let bouldersFromLS: Boulder[] = [];
	let selectedBoulder: Boulder = { id: '', createdAt: 0, path: [] };
	export let isOpen = false;

	const unsubscribe = boulders.subscribe((value) => {
		bouldersFromLS = value.map((boulder: Boulder) => ({
			...boulder,
			createdAt: new Date(boulder.createdAt).toLocaleString()
		}));
		log.info('Boulders:', bouldersFromLS);
	});

	onDestroy(unsubscribe);

	const openDialog = (boulder: Boulder) => {
		selectedBoulder = boulder;
		log.info('selectedBoulder', selectedBoulder);
		isOpen = true;
	};

	const handleRemoveBoulder = (boulderId: string) => {
		boulders.removeBoulder(boulderId);
	};
</script>

<div in:fade>
	{#if bouldersFromLS?.length > 0}
		<div id="table-container" class="my-8 overflow-x-auto">
			<table id="dataTable">
				<thead>
					<tr>
						<th>Name/ID</th>
						<th>Cells</th>
						<th colspan="3"></th>
					</tr>
				</thead>
				<tbody>
					{#each bouldersFromLS as boulder (boulder.id)}
						<tr in:fade out:fly={{ y: -5 }}>
							<td>
								<button
									on:click={() => openDialog(boulder)}
									id={boulder.id}
									data-created={boulder.createdAt}
									class="max-w-xs truncate"
								>
									{boulder.name ? boulder.name : boulder.id}
								</button>
							</td>
							<td>
								{#if boulder.path}
									{#each boulder.path as { id }}
										{id}
									{/each}
								{/if}
								<div>
									{#if boulder.start}
										Start: {boulder.start}
									{/if}
									{#if boulder.top}
										Top: {boulder.top}
									{/if}
								</div>
							</td>
							<td>
								<button on:click={() => handleRemoveBoulder(boulder.id)}>
									<Icon
										path={mdiDelete}
										class="size-5 text-red-500 transition-colors ease-in-out hover:fill-red-600"
									/>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<Alert showIcon>
			Vytvořte si
			<a href="/new-boulder" class="text-blue-600 underline hover:no-underline dark:text-blue-300"
				>novou cestu</a
			> na lezecké stěně.
		</Alert>
	{/if}
</div>

<Toast />

<Dialog {isOpen} on:close={() => (isOpen = false)}>
	<svelte:fragment slot="DialogTitle">
		<div class="max-w-xs truncate">
			{selectedBoulder.name || selectedBoulder.id}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="DialogContent">
		<BoulderComponent selectedBoulderID={selectedBoulder.id} />
	</svelte:fragment>
</Dialog>

<style lang="postcss">
	table {
		@apply text-left text-sm;
	}
	table thead {
		@apply border-b bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800;
	}
	table tbody tr {
		@apply border-b bg-white transition-colors dark:border-slate-700 dark:bg-slate-900;
	}
	table tbody tr:hover {
		@apply bg-gray-100 outline-dotted outline-1 outline-slate-400 dark:bg-slate-700;
	}
	table th {
		@apply px-3 py-2 align-bottom dark:text-slate-300;
		text-wrap: balance;
	}
	table td {
		@apply px-3 py-2 tabular-nums lg:pr-8;
	}
	table td button {
		@apply text-sky-500 underline hover:no-underline dark:text-sky-500 dark:hover:text-sky-400;
	}
</style>
