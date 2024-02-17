<script context="module">
	import { addToast } from '../components/utils/ToastService';
	import { generateId } from '../components/utils/utils';
	import { writable } from 'svelte/store';
	import log from '../components/utils/logger.ts';

	// check for browser environment
	const isBrowser = typeof window !== 'undefined';

	// Custom Store for ClickedCells
	const createClickedCellsStore = () => {
		const { subscribe, set, update } = writable(new Set());

		return {
			subscribe,
			toggle: (cellId, selectedMode) => {
				log.info('  createClickedCellsStore.toggle');
				log.info('    Toggle:   ', cellId, 'with mode:', selectedMode);
				update((cells) => {
					const updated = new Set(cells);
					if (selectedMode !== 'Start' && selectedMode !== 'Top') {
						if (updated.has(cellId)) {
							log.info('    Removing: ', cellId);
							updated.delete(cellId);
						} else {
							log.info('    Adding:   ', cellId);
							updated.add(cellId);
						}
					} else {
						log.info('    Adding:   ', cellId);
						updated.add(cellId);
					}
					return updated;
				});
			},
			removeCellById: (cellId) => {
				log.info('createClickedCellsStore.removeCellById');
				update((cells) => {
					const updated = new Set(cells);
					if (updated.has(cellId)) {
						log.info('    Removing: ', cellId);
						updated.delete(cellId);
					}
					return updated;
				});
			},

			clear: () => {
				log.info('createClickedCellsStore.clear');
				set(new Set());
			}
		};
	};

	// Custom Store for Selector
	const createSelectorStore = () => {
		const { subscribe, set, update } = writable({
			selectedMode: null,
			selectedStartCell: null,
			selectedTopCell: null
		});

		return {
			subscribe,
			setMode: (mode) => {
				log.debug('createSelectorStore.setMode with:', mode);
				update((s) => ({ ...s, selectedMode: mode }));
			},

			updateSelector: (cellId, selectedMode) => {
				log.debug('  createSelectorStore.updateSelector');
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
				});
			},

			clear: () => {
				log.info('createSelectorStore.clear');
				set({
					selectedMode: null,
					selectedStartCell: null,
					selectedTopCell: null
				});
			}
		};
	};

	// Custom Store for Boulders
	const createBouldersStore = () => {
		// TODO: @artem: proc initialValue a existingBoulders?
		const initialValue = isBrowser ? JSON.parse(localStorage.getItem('boulders') || '[]') : [];
		const { subscribe, update } = writable(initialValue);

		const addBoulder = (clickedCellsSet, selectorState, name) => {
			log.debug('  createBouldersStore.addBoulder');
			if (!clickedCellsSet.size) {
				log.trace('Pick at least one cell');
				addToast('Vyberte alespoň jednu buňku!');
				return;
			}

			const newBoulder = {
				id: generateId(),
				name: name,
				clickedCells: Array.from(clickedCellsSet),
				pathStart: selectorState.selectedStartCell,
				pathEnd: selectorState.selectedTopCell,
				timestamp: new Date().toISOString() //.toLocaleString()
			};

			update((boulders) => [...boulders, newBoulder]);
			const existingBoulders = JSON.parse(localStorage.getItem('boulders')) || [];
			localStorage.setItem('boulders', JSON.stringify([...existingBoulders, newBoulder]));
			addToast(
				'Prudič byl vytvořen',
				'success',
				'Přejděte na <a href="/">hlavní stránku</a> pro zobrazení.'
			);
		};

		const removeBoulder = (boulderId) => {
			log.debug('createBouldersStore.removeBoulder');
			update((boulders) => {
				const newBoulders = boulders.filter((boulder) => boulder.id !== boulderId);
				localStorage.setItem('boulders', JSON.stringify(newBoulders));
				addToast('Prudič byl odstraněn');
				return newBoulders;
			});
		};

		return { subscribe, addBoulder, removeBoulder };
	};

	// TODO: @artem: proc nesjou funkce exportovany primo
	export const clickedCells = createClickedCellsStore();
	export const selector = createSelectorStore();
	export const boulders = createBouldersStore();
</script>
