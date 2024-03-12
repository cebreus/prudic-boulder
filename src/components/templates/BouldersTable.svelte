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

	let bouldersFromLS: Boulder[] = [];
	let selectedBoulder: Boulder;
	export let isOpen = false;

	const unsubscribe = boulders.subscribe((value) => {
		bouldersFromLS = value.map((boulder: Boulder) => ({
			...boulder,
			createdAt: new Date(boulder.createdAt).toLocaleString()
		}));
		log.info('BouldersFrom LS:', bouldersFromLS);
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

<main class="container mx-auto px-4 py-12">
	<h1 class="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Vytvořené bouldery</h1>
	{#if bouldersFromLS.length === 0}
		<Alert showIcon>
			Vytvořte si
			<a href="/new-boulder" class="text-blue-600 underline hover:no-underline dark:text-blue-300"
				>novou cestu</a
			> na lezecké stěně.
		</Alert>
	{/if}
	{#if bouldersFromLS?.length > 0}
		<div id="table-container" class="my-8 overflow-x-auto">
			<table id="dataTable">
				<thead>
					<tr>
						<th>Name/ID</th>
						<th>Grips</th>
						<th colspan="3"></th>
					</tr>
				</thead>
				<tbody>
					{#each bouldersFromLS as boulder (boulder.id)}
						<tr>
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
									{#each boulder.path as grip}
										{#if grip.start}
											<p>Start: {grip.id}</p>
										{/if}
										{#if grip.finish}
											<p>Finish: {grip.id}</p>
										{/if}
									{/each}
								</div>
							</td>
							<td>
								<button on:click={() => handleRemoveBoulder(boulder.id)}>
									<Icon
										path={mdiDelete}
										class="size-5 text-red-500 transition-colors hover:fill-red-600"
									/>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</main>

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
		@apply border-dotted border-sky-400 bg-sky-50 dark:bg-slate-700;
	}
	table th {
		@apply px-3 py-2 align-bottom dark:text-slate-300;
		text-wrap: balance;
	}
	table td {
		@apply px-3 py-2 tabular-nums lg:pr-8;
	}
	table td button {
		@apply text-sky-500 underline hover:text-sky-600 hover:no-underline dark:text-sky-500 dark:hover:text-sky-400;
	}
</style>
