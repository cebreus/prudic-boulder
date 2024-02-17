<script lang="ts">
	import { boulders } from '../../stores/BoulderStore.svelte';
	import { onDestroy } from 'svelte';
	import Alert from '../atoms/Alert.svelte';
	import BoulderComponent from './Boulder.svelte';
	import Icon from '../../components/atoms/Icon.svelte';
	import Dialog from './Dialog.svelte';
	import Toast from '../atoms/Toast.svelte';

	// Define TypeScript types
	import type { Boulder, BouldersArray, BoulderId } from '../utils/BoulderTypes';

	let bouldersFromLS: BouldersArray = [];
	let selectedBoulder: Boulder = { id: '', createdAt: 0, path: [] };
	export let isOpen = false;

	const unsubscribe = boulders.subscribe((value) => {
		bouldersFromLS = value.map((boulder: Boulder) => ({
			...boulder,
			createdAt: new Date(boulder.createdAt).toLocaleString()
		}));
	});

	onDestroy(unsubscribe);
	function openDialog(boulder: Boulder) {
		console.log('boulder:', boulder);
		selectedBoulder = boulder;
		console.log('selectedBoulder', selectedBoulder);
		isOpen = true;
	}

	function handleRemoveBoulder(boulderId: BoulderId) {
		boulders.removeBoulder(boulderId);
	}
</script>

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
					<tr>
						<td>
							<button
								on:click={() => openDialog(boulder)}
								id={boulder.id}
								data-created={boulder.createdAt}
							>
								{boulder.name ? boulder.name : boulder.id}
							</button>
						</td>
						<td>
							{Array.from(boulder.path)}
							<div>
								{#if boulder.pathStart}
									Start: {boulder.pathStart}
								{/if}
								{#if boulder.pathEnd}
									Top: {boulder.pathEnd}
								{/if}
							</div>
						</td>
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

<Dialog {isOpen} on:close={() => (isOpen = false)} type="basic">
	<BoulderComponent {selectedBoulder} variant="preview" />
</Dialog>

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
