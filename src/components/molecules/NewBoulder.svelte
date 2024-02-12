<script>
	import { addToast } from '../utils/ToastService.ts';
	import { boulders, clickedCells, selector } from '../molecules/BoulderStore.svelte';
	import { isSkippedCell } from '../utils/constants.mjs';
	import Button from '../atoms/Button.svelte';
	import Toast from '../atoms/Toast.svelte';
	import Boulder from '../atoms/Boulder.svelte';

	let selectingMode = null;
	let selectedStartCell = null;
	let selectedTopCell = null;

	selector.subscribe(($selector) => {
		({ selectingMode, selectedStartCell, selectedTopCell } = $selector);
	});

	export const generateBoulderId = () => '_' + Math.random().toString(36).substr(2, 9);

	const setMode = (mode) => {
		selector.update((prev) => ({ ...prev, selectingMode: mode }));
		console.log(`Změna zežimu ${mode}`);
	};

	const clearBoulder = () => {
		clickedCells.set(new Set());
		selector.set({ selectingMode: null, selectedStartCell: null, selectedTopCell: null });
		console.log('Cesta smazána');
	};

	export const saveBoulder = (clickedCellsSet, currentSelector) => {
		if (!clickedCellsSet.size) {
			addToast('info', 'Vyberte alespoň jednu buňku!');
			return;
		}

		const newBoulder = {
			id: generateBoulderId(),
			clickedCells: clickedCellsSet,
			pathStart: currentSelector.selectedStartCell,
			pathEnd: currentSelector.selectedTopCell,
			timestamp: new Date().toLocaleString()
		};

		boulders.update((bouldersList) => [...bouldersList, newBoulder]);
		localStorage.setItem('boulders', JSON.stringify(newBoulder));
		addToast(
			'success',
			'Prudič byl vytvořen',
			'Přejděte na <a href="/">hlavní stránku</a> pro zobrazení.'
		);
		console.log('Cesta uložena', newBoulder);
	};

	const toggleCell = (cellId) => {
		if (isSkippedCell(cellId)) return;

		clickedCells.update((cells) => {
			const updatedCells = new Set(cells);
			updatedCells.has(cellId) ? updatedCells.delete(cellId) : updatedCells.add(cellId);
			return updatedCells;
		});

		selector.update((prev) => {
			const updatedSelector = { ...prev, selectingMode: null };
			if (prev.selectingMode === 'Start') updatedSelector.selectedStartCell = cellId;
			else if (prev.selectingMode === 'Top') updatedSelector.selectedTopCell = cellId;
			return updatedSelector;
		});

		console.log(`Buňka ${cellId} změněna`);
	};
</script>

<Toast />
<Boulder
	{selectingMode}
	{selectedStartCell}
	{selectedTopCell}
	{toggleCell}
	clickedCells={$clickedCells}
/>

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
