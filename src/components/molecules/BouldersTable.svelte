<script>
	import { boulders } from '../../stores/BoulderStore.svelte';
	import Alert from '../atoms/Alert.svelte';
	import Icon from '../../icons/Icon.svelte';
	import Toast from '../atoms/Toast.svelte';
	import Boulder from './Boulder.svelte';
	import { onDestroy } from 'svelte';
	import Modal from '../atoms/Modal.svelte';

	let bouldersFromLS = [];
	let selectedBoulder = [];
	export let isOpen = false;

	const unsubscribe = boulders.subscribe((value) => {
		bouldersFromLS = value;
	});

	onDestroy(unsubscribe);
	function openModal(boulder) {
		selectedBoulder = boulder;
		isOpen = true;
	}

	function handleRemoveBoulder(boulderId) {
		boulders.removeBoulder(boulderId);
	}
</script>

{#if bouldersFromLS?.length > 0}
	<div id="table-container" class="my-8 overflow-x-auto">
		<table id="dataTable">
			<thead>
				<tr>
					<th>Name</th>
					<th>ID</th>
					<th colspan="3">Cells</th>
				</tr>
			</thead>
			<tbody>
				{#each bouldersFromLS as boulder (boulder.id)}
					<tr>
						<td>
							{boulder.name}
						</td>
						<td>
							<button on:click={() => openModal(boulder)}>
								{boulder.id}
							</button>
						</td>
						<td>{Array.from(boulder.clickedCells)}</td>
						<td>
							<button on:click={() => handleRemoveBoulder(boulder.id)}>
								<Icon iconName="mdiDelete" class="h-5 w-5 text-red-500" />
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

<Toast />

<Modal {isOpen} on:close={() => (isOpen = false)} type="basic" title={selectedBoulder.name}>
	<Boulder {selectedBoulder} />
</Modal>

<style lang="postcss">
	table {
		@apply text-left text-sm;
	}
	table thead {
		@apply border-b bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800;
	}
	table tbody tr {
		@apply border-b bg-white dark:border-slate-700 dark:bg-slate-900;
	}
	table tbody tr:hover {
		@apply outline-dotted outline-1 outline-slate-700 dark:outline-slate-500;
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
