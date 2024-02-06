import { generateBoulderId, cellsToSkip } from './utils.mjs';

import { clickedCells, boulders, selector, clickedCellsArray } from '../Store.svelte';

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

export const saveBoulder = () => {
	boulders.update((prevBoulders) => {
		const newBoulders = [
			...prevBoulders,
			{
				id: generateBoulderId(),
				clickedCells: $clickedCellsArray,
				pathStart: null,
				pathEnd: null
			}
		];

		localStorage.setItem('boulders', JSON.stringify(newBoulders));

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
	console.log('im here');
	if (!isSkippedCell(cellId)) {
		selector.update((prevSelector) => {
			if (prevSelector.selectingMode === 'Start') {
				selectedStart(cellId);
				return {
					...prevSelector,
					selectedStartCell: cellId,
					selectingMode: null
				};
			} else if (prevSelector.selectingMode === 'Top') {
				selectedTop(cellId);
				return {
					...prevSelector,
					selectedTopCell: cellId,
					selectingMode: null
				};
			} else {
				clickedCells.update((prevClickedCells) => {
					const newClickedCells = new Set(prevClickedCells);
					if (newClickedCells.has(cellId)) {
						newClickedCells.delete(cellId);
					} else {
						newClickedCells.add(cellId);
					}
					console.log('new clicked cells:', newClickedCells);
					return newClickedCells;
				});
				return {
					...prevSelector,
					selectingMode: null
				};
			}
		});
	}
};
