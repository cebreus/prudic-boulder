<script context="module">
	import { addToast } from '../utils/ToastService.ts';
	import { generateBoulderId } from '../utils/functions.js';
	import { isSkippedCell } from '../utils/constants.mjs';
	import { writable } from 'svelte/store';
	import log from '../utils/logger.ts';

	// Custom Store for ClickedCells
	function createClickedCellsStore() {
		const { subscribe, set, update } = writable(new Set());

		return {
			subscribe,
			toggle: (cellId) => {
				log.debug('cellId:', cellId);
				if (isSkippedCell(cellId)) return;
				update((cells) => {
					const updated = new Set(cells);
					if (updated.has(cellId)) {
						updated.delete(cellId);
					} else {
						updated.add(cellId);
					}
					return updated;
				});
			},
			clear: () => set(new Set())
		};
	}

	// Custom Store for Selector
	function createSelectorStore() {
		const { subscribe, set, update } = writable({
			selectingMode: null,
			selectedStartCell: null,
			selectedTopCell: null
		});

		return {
			subscribe,
			setMode: (mode) => update((s) => ({ ...s, selectingMode: mode })),
			updateSelector: (cellId) =>
				update((prev) => {
					const updatedSelector = { ...prev, selectingMode: null };
					if (prev.selectingMode === 'Start') updatedSelector.selectedStartCell = cellId;
					else if (prev.selectingMode === 'Top') updatedSelector.selectedTopCell = cellId;
					return updatedSelector;
				}),
			clear: () =>
				set({
					selectingMode: null,
					selectedStartCell: null,
					selectedTopCell: null
				})
		};
	}

	// Custom Store for Boulders
	function createBouldersStore() {
		const { subscribe, update } = writable([]);

		const addBoulder = (clickedCellsSet, selectorState) => {
			if (!clickedCellsSet.size) {
				addToast('info', 'Vyberte alespoň jednu buňku!');
				return;
			}

			const newBoulder = {
				id: generateBoulderId(),
				clickedCells: Array.from(clickedCellsSet),
				pathStart: selectorState.selectedStartCell,
				pathEnd: selectorState.selectedTopCell,
				timestamp: new Date().toLocaleString()
			};

			update((boulders) => [...boulders, newBoulder]);

			// Update localStorage
			const existingBoulders = JSON.parse(localStorage.getItem('boulders')) || [];
			localStorage.setItem('boulders', JSON.stringify([...existingBoulders, newBoulder]));

			addToast(
				'success',
				'Prudič byl vytvořen',
				'Přejděte na <a href="/">hlavní stránku</a> pro zobrazení.'
			);
		};

		const removeBoulder = (boulderId) => {
			update((boulders) => {
				const newBoulders = boulders.filter((boulder) => boulder.id !== boulderId);

				// Update localStorage
				localStorage.setItem('boulders', JSON.stringify(newBoulders));

				addToast('info', 'Prudič byl odstraněn');

				return newBoulders;
			});
		};

		return {
			subscribe,
			addBoulder,
			removeBoulder
		};
	}

	export const clickedCells = createClickedCellsStore();
	export const selector = createSelectorStore();
	export const boulders = createBouldersStore();
</script>
