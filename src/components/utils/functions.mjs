import { generateBoulderId, cellsToSkip } from './utils.mjs';

import { clickedCells, boulders, selector } from '../molecules/BoulderStore.svelte';

export const isSkippedCell = (cellId) => {
	return cellsToSkip.has(cellId);
};

export const selectedStart = (cellId) => {
	clickedCells.update((prevClickedCells) => {
		prevClickedCells = new Set([cellId, ...prevClickedCells]);
		return prevClickedCells;
	});
};

export const selectedTop = (cellId) => {
	clickedCells.update((prevClickedCells) => {
		const newClickedCells = new Set(prevClickedCells);
		newClickedCells.delete(cellId);
		newClickedCells.add(cellId);
		return newClickedCells;
	});
};

export const setMode = (mode) => {
	selector.update((prevSelector) => {
		return {
			...prevSelector,
			selectingMode: mode
		};
	});
};

export const clearBoulder = () => {
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

export const saveBoulder = (clickedCells) => {
	// TODO: @artem add timestamp `YYYY-MMM-DD HH:mm`
	console.log('array:', Array.from(clickedCells)); // nic neni

	boulders.update((prevBoulders) => {
		const newBoulders = [
			...prevBoulders,
			{
				id: generateBoulderId(),
				clickedCells: Array.from(clickedCells),
				pathStart: null,
				pathEnd: null
			}
		];

		localStorage.setItem('boulders', JSON.stringify(newBoulders));

		// TODO: @artem remove, because user should be able to continue in cration and save as next iteration
		clearBoulder();

		return newBoulders;
	});
};

export const removeBoulder = (boulderId) => {
	boulders.update((prevBoulders) => {
		const newBoulders = prevBoulders.filter((boulder) => boulder.id !== boulderId);
		localStorage.setItem('boulders', JSON.stringify(newBoulders));
		return newBoulders;
	});
};

export const toggleCell = (cellId) => {
	if (isSkippedCell(cellId)) {
		return; // Do nothing if the cell is skipped
	}

	selector.update((prevSelector) => {
		let updatedSelector = { ...prevSelector, selectingMode: null };

		if (prevSelector.selectingMode === 'Start') {
			selectedStart(cellId);
			updatedSelector.selectedStartCell = cellId;
		} else if (prevSelector.selectingMode === 'Top') {
			selectedTop(cellId);
			updatedSelector.selectedTopCell = cellId;
		} else {
			clickedCells.update((prevClickedCells) => {
				const newClickedCells = new Set(prevClickedCells);
				newClickedCells.has(cellId) ? newClickedCells.delete(cellId) : newClickedCells.add(cellId);
				console.log('new clicked cells:', newClickedCells);
				return newClickedCells;
			});
		}

		return updatedSelector;
	});
};
