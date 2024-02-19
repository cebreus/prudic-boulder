<script context="module" lang="ts">
	import { addToast } from '../components/utils/ToastService';
	import { generateId, clickedClass, startClass, topClass } from '../components/utils/utils';
	import { writable } from 'svelte/store';
	import log from '../components/utils/logger.ts';

	// Define TypeScript types
	import type { CellId, BoulderId, Boulder, Selector } from '../components/utils/BoulderTypes';

	// check for browser environment
	const isBrowser = typeof window !== 'undefined';

	// Custom Store for ClickedCells
	const createClickedCellsStore = () => {
		const { subscribe, set, update } = writable(new Map());

		return {
			subscribe,
			toggle: (cellId: CellId, selectedMode) => {
				log.info('  createClickedCellsStore.toggle');
				log.info('    Toggle:   ', cellId, 'with mode:', selectedMode);
				update((cells) => {
					const updated = new Map(cells);

					let cellClass = '';
					if (selectedMode === 'Start') cellClass = startClass;
					else if (selectedMode === 'Top') cellClass = topClass;
					else cellClass = clickedClass;

					if (selectedMode !== 'Start' && selectedMode !== 'Top') {
						if (updated.has(cellId)) {
							log.info('    Removing: ', cellId);
							updated.delete(cellId);
						} else {
							log.info('    Adding:   ', cellId);
							updated.set(cellId, { class: cellClass });
						}
					} else {
						log.info('    Adding:   ', cellId);
						updated.set(cellId, { class: cellClass });
					}
					return updated;
				});
			},

			removeCellById: (cellId: CellId) => {
				log.info('createClickedCellsStore.removeCellById');
				update((cells) => {
					const updated = new Map(cells);
					if (updated.has(cellId)) {
						log.info('    Removing: ', cellId);
						updated.delete(cellId);
					}
					return updated;
				});
			},
			clear: () => {
				log.info('createClickedCellsStore.clear');
				set(new Map());
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
			setMode: (mode: string) => {
				log.debug('createSelectorStore.setMode with:', mode);
				update((s) => ({ ...s, selectedMode: mode }));
			},

			updateSelector: (cellId: CellId, selectedMode) => {
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

		const addBoulder = (
			clickedCellsMap: Map<CellId, { class: string }>,
			selectorState: Selector,
			name: string | null
		) => {
			log.debug('createBouldersStore.addBoulder');
			console.log('hete!!!');
			if (!clickedCellsMap.size) {
				log.trace('Pick at least one cell');
				addToast('Vyberte alespoň jednu buňku!');
				return;
			}

			const clickedCellKeys = Array.from(clickedCellsMap.keys());

			const newBoulder = {
				id: generateId(),
				name: name,
				path: clickedCellKeys,
				pathStart: selectorState.selectedStartCell,
				pathEnd: selectorState.selectedTopCell,
				createdAt: new Date().toISOString() //.toLocaleString()
			};

			log.debug('  newBoulder:', newBoulder);

			update((boulders) => [...boulders, newBoulder]);
			const existingBoulders = JSON.parse(localStorage.getItem('boulders') || '[]');
			console.log(existingBoulders);
			localStorage.setItem('boulders', JSON.stringify([...existingBoulders, newBoulder]));
			addToast(
				'Prudič byl vytvořen',
				'success',
				'Přejděte na <a href="/">hlavní stránku</a> pro zobrazení.'
			);
		};

		const removeBoulder = (boulderId: BoulderId) => {
			log.debug('createBouldersStore.removeBoulder');
			update((boulders) => {
				const newBoulders = boulders.filter((boulder: Boulder) => boulder.id !== boulderId);
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
