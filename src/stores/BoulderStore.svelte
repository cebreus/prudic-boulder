<script context="module">
	import { addToast } from '../components/utils/ToastService';
	import { generateId } from '../components/utils/utils';
	import { writable } from 'svelte/store';
	import log from '../components/utils/logger.ts';

	// check for browser environment
	const isBrowser = typeof window !== 'undefined';

	// Custom Store for ClickedCells
	function createClickedCellsStore() {
		const { subscribe, set, update } = writable(new Set());

		return {
			subscribe,
			toggle: (cellId, selectedMode) => {
				log.info('cellId:', cellId, 'selectedMode:', selectedMode);
				update((cells) => {
					const updated = new Set(cells);
					if (selectedMode !== 'Start' && selectedMode !== 'Top') {
						if (updated.has(cellId)) {
							updated.delete(cellId);
						} else {
							updated.add(cellId);
						}
					} else {
						updated.add(cellId);
					}
					return updated;
				});
			},
			removeCellById: (cellId) => {
				update((cells) => {
					const updated = new Set(cells);
					if (updated.has(cellId)) {
						updated.delete(cellId);
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
			selectedMode: null,
			selectedStartCell: null,
			selectedTopCell: null
		});

		return {
			subscribe,
			setMode: (mode) => update((s) => ({ ...s, selectedMode: mode })),
			updateSelector: (cellId, selectedMode) =>
				update((prev) => {
					let updatedSelector = { ...prev };

					if (selectedMode === 'Start') {
						if (prev.selectedStartCell) {
							clickedCells.removeCellById(prev.selectedStartCell);
						}
						if (cellId === prev.selectedTopCell) {
							updatedSelector.selectedTopCell = null;
						}
						updatedSelector.selectedStartCell = cellId;
					} else if (selectedMode === 'Top') {
						if (prev.selectedTopCell) {
							clickedCells.removeCellById(prev.selectedTopCell);
						}
						if (cellId === prev.selectedStartCell) {
							updatedSelector.selectedStartCell = null;
						}
						updatedSelector.selectedTopCell = cellId;
					}

					updatedSelector.selectedMode = null;

					return updatedSelector;
				}),

			clear: () =>
				set({
					selectedMode: null,
					selectedStartCell: null,
					selectedTopCell: null
				})
		};
	}

	// Custom Store for Boulders
	function createBouldersStore() {
		const initialValue = isBrowser ? JSON.parse(localStorage.getItem('boulders') || '[]') : [];
		const { subscribe, update } = writable(initialValue);

		const addBoulder = (clickedCellsSet, selectorState, name) => {
			if (!clickedCellsSet.size) {
				addToast('info', 'Vyberte alespoň jednu buňku!');
				return;
			}

			const newBoulder = {
				id: generateId(),
				name: name,
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
