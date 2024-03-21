<script lang="ts">
	import { boulders } from '../../stores/BoulderStore.svelte';
	import { exportAllToSingleJsonFile, exportToJsonFile } from '../../utils/utils';
	import { mdiDelete, mdiFileExportOutline, mdiFileImportOutline } from '@mdi/js';
	import { onDestroy } from 'svelte';
	import Alert from '../atoms/Alert.svelte';
	import BoulderComponent from '../atoms/Boulder.svelte';
	import Button from '../atoms/Button.svelte';
	import Dialog from '../molecules/Dialog.svelte';
	import Icon from '../atoms/Icon.svelte';
	import Import from '../molecules/Import.svelte';
	import log from 'loglevel';
	import Toast from '../atoms/Toast.svelte';

	import type { Boulder } from '../../utils/BoulderTypes';

	let bouldersFromLS: Boulder[] = [];
	let selectedBoulder: Boulder;
	let addBoulder: (() => void) | undefined;

	// export let isOpen = false;
	export let isOpenImport = false;

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
		window.dispatchEvent(
			new CustomEvent('dialog-opened', {
				detail: { dialogId: 'dialog-boulder' }
			})
		);
	};

	const handleRemoveBoulder = (boulderId: string) => {
		boulders.removeBoulder(boulderId);
	};

	const handleCloseDialog = () => {
		isOpenImport = false;
	};

	const registerAddBoulderFunction = (addBoulderFn: () => void): void => {
		addBoulder = addBoulderFn;
	};
	const onAddBoulderClick = (): void => {
		if (addBoulder) {
			addBoulder();
		}
	};

	const openImportDialog = () => {
		window.dispatchEvent(
			new CustomEvent('dialog-opened', { detail: { dialogId: 'dialog-import' } })
		);
	};
</script>

<main class="container mx-auto px-4 py-12">
	<h1 class="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Vytvořené bouldery</h1>
	<div class="flex space-x-4">
		<Button on:click={openImportDialog} class=" flex items-center justify-center">
			<Icon
				path={mdiFileImportOutline}
				class="text-white-100 hover:text-white-300 -ml-1 mr-2 h-4 w-4 transition-colors"
			/>
			Importovat
		</Button>

		<Button on:click={exportAllToSingleJsonFile} class=" flex items-center justify-center">
			<Icon
				path={mdiFileExportOutline}
				class="text-white-100 hover:text-white-300 -ml-1 mr-2 h-4 w-4 transition-colors"
			/>
			Exportovat
		</Button>
	</div>

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
						<th><span class="sr-only">Akce</span></th>
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
								<Button on:click={() => exportToJsonFile(boulder)} variant="">
									<Icon
										path={mdiFileExportOutline}
										class="size-4 text-sky-500 transition-colors hover:text-sky-700"
									/>
								</Button>
								<Button on:click={() => handleRemoveBoulder(boulder.id)} variant="">
									<Icon
										path={mdiDelete}
										class="size-5 text-red-500 transition-colors hover:fill-red-600"
									/>
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</main>

<Toast />

<Dialog dialogId="dialog-boulder">
	<svelte:fragment slot="DialogTitle">
		<div class="max-w-xs truncate">
			{selectedBoulder.name || selectedBoulder.id}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="DialogContent">
		<BoulderComponent selectedBoulderID={selectedBoulder.id} />
	</svelte:fragment>
</Dialog>

<Dialog dialogId="dialog-import">
	<svelte:fragment slot="DialogTitle">
		<div class="max-w-xs">Import</div>
	</svelte:fragment>
	<svelte:fragment slot="DialogContent">
		<Import {registerAddBoulderFunction} />
	</svelte:fragment>
	<svelte:fragment slot="DialogFooter">
		<div class="flex gap-4">
			<Button on:click={() => handleCloseDialog()} variant="link">Zrušit</Button>
			<Button on:click={onAddBoulderClick} variant="primary">Importovat</Button>
		</div>
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
