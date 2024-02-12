<script>
	import { addToast } from '../utils/TostService.ts';
	import { boulders, clickedCells, selector } from '../molecules/BoulderStore.svelte';
	import { isSkippedCell } from '../utils/constants.mjs';
	import Button from '../atoms/Button.svelte';
	import Toast from '../atoms/Toast.svelte';
	import log from '../utils/logger.ts';

	import {
		rows,
		cols,
		topClass,
		skippedClass,
		startClass,
		clickedClass
	} from '../utils/constants.mjs';

	let selectingMode, selectedStartCell, selectedTopCell;
	selector.subscribe(($selector) => {
		({ selectingMode, selectedStartCell, selectedTopCell } = $selector);
	});

	$: tableRows = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
	$: tableCols = Array.from({ length: cols }, (_, i) => i);

	export const generateBoulderId = () => {
		return '_' + Math.random().toString(36).substring(2, 9);
	};

	const setMode = (mode) => {
		log.trace('here');
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
			addToast('info', 'Vyberte alespoň jednu buňku!');
			return;
		}

		const timestamp = new Date().toLocaleString();

		boulders.update((prevBoulders) => {
			const newBoulders = [
				...prevBoulders,
				{
					id: generateBoulderId(),
					clickedCells: clickedCells,
					pathStart: selector?.selectedStartCell,
					pathEnd: selector?.selectedTopCell,
					timestamp: timestamp
				}
			];

			localStorage.setItem('boulders', JSON.stringify(newBoulders));
			addToast(
				'success',
				'Prudič byl vytvořen',
				'Přejděte na <a href="/">hlavní stránku</a> pro zobrazení.'
			);

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

<Toast />

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
				<th>{String.fromCharCode(65 + rowIndex)}</th>
				{#each tableCols as col}
					{@const cellId = `${row}${col}`}
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
						on:click={() => toggleCell(cellId)}
					>
						{isSkippedCell(cellId) ? '' : cellId}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<div class="grid w-[20.8em] grid-flow-col justify-stretch gap-4 pl-9 pr-1 pt-4 sm:w-[23.5em]">
	<Button variant="outline" on:click={() => setMode('Start')}>Start</Button>
	<Button variant="outline" on:click={() => setMode('Top')}>Top</Button>
	<Button
		emoji="💾"
		variant="outlineGreen"
		aria-label="Save"
		on:click={() => saveBoulder($clickedCells, $selector)}
	></Button>
	<Button emoji="🗑️" variant="outlineYellow" aria-label="Clear" on:click={clearBoulder}></Button>
</div>

<style lang="postcss">
	:global(table.wall) {
		@apply mb-6 table-fixed border-separate text-xs sm:text-base;
	}
	:global(table.wall th) {
		@apply h-7 w-7 rounded-sm text-center slashed-zero tabular-nums text-slate-400 sm:h-8 sm:w-8 dark:text-slate-400;
	}
	:global(table.wall td) {
		@apply h-7 w-7 rounded-sm text-center slashed-zero tabular-nums sm:h-8 sm:w-8;
	}
	:global(table.wall td:not(.skipped)) {
		@apply cursor-pointer border border-sky-300 bg-sky-50 text-sky-600 hover:border-sky-400 hover:bg-sky-100 hover:text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200  dark:hover:bg-sky-900 dark:hover:text-white;
	}
	:global(table.wall td.holds) {
		@apply border-green-300 bg-green-100 text-green-600 hover:border-green-400 hover:bg-green-200 hover:text-green-700 dark:border-green-400 dark:bg-green-600 dark:text-green-200  dark:hover:border-green-200 dark:hover:bg-green-600 dark:hover:text-white;
	}
	:global(table.wall td.start) {
		@apply border-indigo-300 bg-indigo-50 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-100 hover:text-indigo-700 dark:border-indigo-400 dark:bg-indigo-600 dark:text-indigo-200  dark:hover:border-indigo-200 dark:hover:bg-indigo-600 dark:hover:text-white;
	}
	:global(table.wall td.top) {
		@apply border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600 hover:border-fuchsia-400 hover:bg-fuchsia-100 hover:text-fuchsia-700 dark:border-fuchsia-400 dark:bg-fuchsia-600 dark:text-fuchsia-200  dark:hover:border-fuchsia-200 dark:hover:bg-fuchsia-600 dark:hover:text-white;
	}
</style>
