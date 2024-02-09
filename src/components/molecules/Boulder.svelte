<script>
	import { boulders, clickedCells, selector } from '../molecules/BoulderStore.svelte';
	import Button from '../atoms/Button.svelte';
	import { addToast } from '../utils/TostService.mjs';
	import Toast from '../atoms/Toast.svelte';
	import { mdiAccountCircle } from '@mdi/js';
	import Icon from '../../icons/Icon.svelte';

	let rows = 18;
	let cols = 10;

	const skippedClass = `skipped`;
	const clickedClass = `holds`;
	const startClass = `start`;
	const topClass = `top`;

	let selectingMode, selectedStartCell, selectedTopCell;
	selector.subscribe(($selector) => {
		({ selectingMode, selectedStartCell, selectedTopCell } = $selector);
	});

	$: tableRows = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
	$: tableCols = Array.from({ length: cols }, (_, i) => i);

	export const cellsToSkip = new Set([
		'B0',
		'B3',
		'B6',
		'B9',
		'C1',
		'C2',
		'C4',
		'C5',
		'C7',
		'C8',
		'D0',
		'D3',
		'D6',
		'D9',
		'E1',
		'E2',
		'E4',
		'E5',
		'E7',
		'F0',
		'F3',
		'F6',
		'F9',
		'G1',
		'G2',
		'G4',
		'G5',
		'G7',
		'G8',
		'H0',
		'H3',
		'H6',
		'H9',
		'I1',
		'I2',
		'I4',
		'I5',
		'I7',
		'I8',
		'J0',
		'J3',
		'J6',
		'J9',
		'K1',
		'K2',
		'K4',
		'K5',
		'K7',
		'K8',
		'L0',
		'L3',
		'L6',
		'L9',
		'M1',
		'M2',
		'M4',
		'M5',
		'M7',
		'M8',
		'N0',
		'N3',
		'N6',
		'N9',
		'O1',
		'O2',
		'O4',
		'O5',
		'O7',
		'O8',
		'P0',
		'P3',
		'P6',
		'P9',
		'Q0',
		'Q1',
		'Q4',
		'Q5',
		'Q8',
		'Q9',
		'R1',
		'R3',
		'R6',
		'R8'
	]);

	export const generateBoulderId = () => {
		return '_' + Math.random().toString(36).substring(2, 9);
	};

	const isSkippedCell = (cellId) => {
		return cellsToSkip.has(cellId);
	};

	const setMode = (mode) => {
		selector.update((prevSelector) => {
			return {
				...prevSelector,
				selectingMode: mode
			};
		});
	};

	const clearBoulder = () => {
		clickedCells.update((prevClickedCells) => {
			prevClickedCells = new Set();
			return prevClickedCells;
		});
		selector.update((prevSelector) => {
			return {
				...prevSelector,
				selectedStartCell: null,
				selectedTopCell: null
			};
		});
	};

	export const saveBoulder = (clickedCells, selector) => {
		if (clickedCells.size === 0) {
			addToast('info', 'Vyberte alespoň jednu buňku!', '');
			return;
		}

		const timestamp = new Date().toLocaleString();

		boulders.update((prevBoulders) => {
			const newBoulders = [
				...prevBoulders,
				{
					id: generateBoulderId(),
					clickedCells: Array.from(clickedCells),
					pathStart: selector?.selectedStartCell,
					pathEnd: selector?.selectedTopCell,
					timestamp: timestamp
				}
			];

			localStorage.setItem('boulders', JSON.stringify(newBoulders));
			addToast('info', 'Prudič byl vytvořen', 'Přejděte na hlavní stránku pro zobrazení');

			return newBoulders;
		});
	};
	const toggleCell = (cellId) => {
		if (isSkippedCell(cellId)) {
			return;
		}

		selector.update((prevSelector) => {
			let updatedSelector = { ...prevSelector, selectingMode: null };

			if (prevSelector.selectingMode === 'Start') {
				updatedSelector.selectedStartCell = cellId;
			} else if (prevSelector.selectingMode === 'Top') {
				updatedSelector.selectedTopCell = cellId;
			}
			clickedCells.update((prevClickedCells) => {
				const newClickedCells = new Set(prevClickedCells);
				newClickedCells.has(cellId) ? newClickedCells.delete(cellId) : newClickedCells.add(cellId);
				console.log('new clicked cells:', newClickedCells);
				return newClickedCells;
			});

			return updatedSelector;
		});
	};
</script>

<!-- 
Buttons: 

- Top: sets the end of the path
- Start: sets start of path
- Show: sends data to server, server lights up wall
- Clear: clears set data Boulder
- Save: send data to server
-->
<!--{#if showAlert}-->
<!--	<Alert variation="warning">Vyberte prosím alespoň jednu buňku!</Alert>-->
<!--{/if}-->

<Toast/>

<table class="wall">
	<thead>
		<tr>
			<th></th>
			{#each Array(cols) as _, col (col)}
				<th>{col}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each tableRows as row, rowIndex}
			<tr>
				<th>
					{String.fromCharCode(65 + rowIndex)}
				</th>
				{#each tableCols as col}
					{@const cellId = row + col}
					<td
						class={(selectingMode === 'Start' && selectedStartCell === cellId) ||
						selectedStartCell === cellId
							? startClass
							: (selectingMode === 'Top' && selectedTopCell === cellId) ||
								  selectedTopCell === cellId
								? topClass
								: $clickedCells?.has(cellId)
									? clickedClass
									: isSkippedCell(cellId)
										? skippedClass
										: ''}
						on:click={() => {
							toggleCell(cellId);
						}}
					>
						{isSkippedCell(cellId) ? '' : cellId}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<div class="grid w-[20.8em] grid-flow-col justify-stretch gap-4 pl-9 pr-1 pt-4 sm:w-[23.5em]">
	<Button variant="outline" on:click={setMode('Start')}>Start</Button>
	<Button variant="outline" on:click={setMode('Top')}>Top</Button>
	<Button
		emoji="💾"
		variant="outlineGreen"
		aria-label="Save"
		on:click={saveBoulder($clickedCells, $selector)}
	></Button>
	<Button emoji="🗑️" variant="outlineYellow" aria-label="Clear" on:click={clearBoulder}></Button>

</div>

<style lang="postcss">
	:global(table.wall) {
		@apply mb-6 table-fixed border-separate text-xs sm:text-base;
	}
	:global(table.wall th) {
		@apply h-7 w-7 rounded-sm text-center slashed-zero tabular-nums text-slate-400 sm:h-8 sm:w-8;
	}
	:global(table.wall td) {
		@apply h-7 w-7 rounded-sm text-center slashed-zero tabular-nums sm:h-8 sm:w-8;
	}
	:global(table.wall td:not(.skipped)) {
		@apply cursor-pointer border border-sky-300 bg-sky-50 text-sky-600 hover:border-sky-400 hover:bg-sky-100 hover:text-sky-700;
	}
	:global(table.wall td.holds) {
		@apply border-green-300 bg-green-100 text-green-600 hover:border-green-400 hover:bg-green-200 hover:text-green-700;
	}
	:global(table.wall td.start) {
		@apply border-indigo-300 bg-indigo-50 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-100 hover:text-indigo-700;
	}
	:global(table.wall td.top) {
		@apply border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600 hover:border-fuchsia-400 hover:bg-fuchsia-100 hover:text-fuchsia-700;
	}
</style>
