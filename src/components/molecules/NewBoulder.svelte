<script>
	import { addToast } from '../utils/ToastService.ts';
	import { boulders, clickedCells, selector } from '../molecules/BoulderStore.svelte';
	import { isSkippedCell } from '../utils/constants.mjs';
	import BoulderButtons from '../atoms/BoulderButtons.svelte';
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

<BoulderButtons
	{setMode}
	{saveBoulder}
	{clearBoulder}
	clickedCells={$clickedCells}
	selector={$selector}
/>
