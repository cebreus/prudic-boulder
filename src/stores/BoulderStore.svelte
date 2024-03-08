<script context="module" lang="ts">
	import { addToast } from '../components/utils/ToastService';
	import { generateId, clickedClass, startClass, topClass, omit } from '../components/utils/utils';
	import { writable } from 'svelte/store';
	import log from '../components/utils/logger.ts';

	// Define TypeScript types
	import type { Boulder, Mode, Selector } from '../components/utils/BoulderTypes';
	import { services } from '../components/utils/services.ts';

	// check for browser environment
	const isBrowser = typeof window !== 'undefined';

	// Custom Store for ClickedCells
	const createClickedCellsStore = () => {
		const { subscribe, set, update } = writable(new Map());

		return {
			subscribe,
			toggle: (cellId: string, selectedMode: Mode | undefined) => {
				log.info('  createClickedCellsStore.toggle');
				log.info('selectedMode in store:', selectedMode);
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

			removeCellById: (cellId: string) => {
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
		const { subscribe, set, update } = writable<Selector>({
			selectedMode: undefined,
			selectedStartCell: undefined,
			selectedTopCell: undefined
		});

		return {
			subscribe,
			setMode: (mode: Mode) => {
				log.debug('createSelectorStore.setMode with:', mode);
				update((s) => ({ ...s, selectedMode: mode }));
			},

			updateSelector: (cellId: string, selectedMode: Mode | undefined) => {
				log.debug('  createSelectorStore.updateSelector');
				update((prev) => {
					let updatedSelector = { ...prev };

					if (selectedMode === 'Start') {
						if (prev.selectedStartCell) {
							clickedCells.removeCellById(prev.selectedStartCell);
						}
						if (cellId === prev.selectedTopCell) {
							updatedSelector.selectedTopCell = undefined;
						}
						updatedSelector.selectedStartCell = cellId;
					} else if (selectedMode === 'Top') {
						if (prev.selectedTopCell) {
							clickedCells.removeCellById(prev.selectedTopCell);
						}
						if (cellId === prev.selectedStartCell) {
							updatedSelector.selectedStartCell = undefined;
						}
						updatedSelector.selectedTopCell = cellId;
					}
					updatedSelector.selectedMode = undefined;

					return updatedSelector;
				});
			},

			clear: () => {
				log.info('createSelectorStore.clear');
				set({
					selectedMode: undefined,
					selectedStartCell: undefined,
					selectedTopCell: undefined
				});
			}
		};
	};

	// Custom Store for Boulders
	const createBouldersStore = () => {
		const initialValue = isBrowser ? JSON.parse(localStorage.getItem('boulders') || '[]') : [];
		const { subscribe, update } = writable(initialValue);

		const addBoulder = async (
			clickedCellsMap: Map<string, { class: string }>,
			selectorState: Selector,
			name: string | undefined,
			action: 'save' | 'display'
		) => {
			log.debug('createBouldersStore.addBoulder');

			const clickedCellKeys = Array.from(clickedCellsMap.keys());
			const cells = clickedCellKeys.map((key) => {
				// Example of colorBrightness
				const colorBrightness = '255 0 0 / 50%';
				return {
					id: key,
					colorBrightness: colorBrightness
				};
			});

			const newBoulder: Boulder = {
				id: generateId(),
				name: name,
				path: cells,
				start: selectorState.selectedStartCell,
				top: selectorState.selectedTopCell,
				createdAt: new Date().toISOString() //.toLocaleString()
			};

			log.debug('  newBoulder:', newBoulder);

			update((boulders) => [...boulders, newBoulder]);
			const existingBoulders = JSON.parse(localStorage.getItem('boulders') || '[]');
			localStorage.setItem('boulders', JSON.stringify([...existingBoulders, newBoulder]));

			const boulderWithoutCreatedAt = omit(newBoulder, 'createdAt');

			try {
				const response = await services.boulder[action](boulderWithoutCreatedAt);

				log.info('Boulder saved successfully on server', response);
				addToast(
					`Prudič byl  ${action === 'save' ? 'uložen' : 'zobrazen a uložen'}`,
					'success',
					`${action === 'save' ? 'Přejděte na <a href="/">hlavní stránku</a> pro zobrazení' : ''}`
				);
			} catch (error) {
				log.error('Error saving boulder on server', error);
				addToast('Chyba při ukládání boulderu na server', 'error');
			}
		};

		const removeBoulder = (boulderId: string) => {
			log.debug('createBouldersStore.removeBoulder');
			update((boulders) => {
				const newBoulders = boulders.filter((boulder: Boulder) => boulder.id !== boulderId);
				localStorage.setItem('boulders', JSON.stringify(newBoulders));
				addToast('Prudič byl odstraněn');
				return newBoulders;
			});
		};

		const getCellClass = (selectedBoulderId: string, cellId: string) => {
			if (!selectedBoulderId) return 'lol';

			const boulders: Boulder[] = JSON.parse(localStorage.getItem('boulders') || '[]');
			const selectedBoulder = boulders.find((boulder) => boulder.id === selectedBoulderId);

			if (!selectedBoulder) return '';

			if (selectedBoulder.start === cellId) {
				return startClass;
			} else if (selectedBoulder.top === cellId) {
				return topClass;
			} else if (selectedBoulder.path.some((cell) => cell.id === cellId)) {
				return clickedClass;
			}
			return '';
		};

		return { subscribe, addBoulder, removeBoulder, getCellClass };
	};

	export const clickedCells = createClickedCellsStore();
	export const selector = createSelectorStore();
	export const boulders = createBouldersStore();
</script>
