<script context="module" lang="ts">
	import { addToast } from '../components/utils/ToastService';
	import { generateId, clickedClass, startClass, finishClass } from '../components/utils/utils';
	import { writable } from 'svelte/store';
	import log from '../components/utils/logger.ts';

	// Define TypeScript types
	import type { Boulder, Grip, Mode, Selector } from '../components/utils/BoulderTypes';
	import { services } from '../components/utils/services.ts';

	// check for browser environment
	const isBrowser = typeof window !== 'undefined';

	// Custom Store for ClickedGrips
	const createClickedGripsStore = () => {
		const { subscribe, set, update } = writable(new Map());

		return {
			subscribe,
			toggle: (gripId: string, selectedMode: Mode | undefined) => {
				log.info('  createClickedGripsStore.toggle');
				log.info('selectedMode in store:', selectedMode);
				log.info('    Toggle:   ', gripId, 'with mode:', selectedMode);
				update((grips) => {
					const updated = new Map(grips);

					let gripClass = '';
					if (selectedMode === 'Start') gripClass = startClass;
					else if (selectedMode === 'Finish') gripClass = finishClass;
					else gripClass = clickedClass;

					if (selectedMode !== 'Start' && selectedMode !== 'Finish') {
						if (updated.has(gripId)) {
							log.info('    Removing: ', gripId);
							updated.delete(gripId);
						} else {
							log.info('    Adding:   ', gripId);
							updated.set(gripId, { class: gripClass });
						}
					} else {
						log.info('    Adding:   ', gripId);
						updated.set(gripId, { class: gripClass });
					}
					return updated;
				});
			},

			removeGripById: (gripId: string) => {
				log.info('createClickedGripsStore.removeGripById');
				update((grips) => {
					const updated = new Map(grips);
					if (updated.has(gripId)) {
						log.info('    Removing: ', gripId);
						updated.delete(gripId);
					}
					return updated;
				});
			},
			clear: () => {
				log.info('createClickedGripsStore.clear');
				set(new Map());
			}
		};
	};

	// Custom Store for Selector
	const createSelectorStore = () => {
		const { subscribe, set, update } = writable<Selector>({
			selectedMode: undefined,
			selectedStartGrip: undefined,
			selectedFinishGrip: undefined
		});

		return {
			subscribe,
			setMode: (mode: Mode) => {
				log.debug('createSelectorStore.setMode with:', mode);
				update((s) => ({ ...s, selectedMode: mode }));
			},

			updateSelector: (gripId: string, selectedMode: Mode | undefined) => {
				log.debug('  createSelectorStore.updateSelector');
				update((prev) => {
					let updatedSelector = { ...prev };

					if (selectedMode === 'Start') {
						if (prev.selectedStartGrip) {
							clickedGrips.removeGripById(prev.selectedStartGrip);
						}
						if (gripId === prev.selectedFinishGrip) {
							updatedSelector.selectedFinishGrip = undefined;
						}
						updatedSelector.selectedStartGrip = gripId;
					} else if (selectedMode === 'Finish') {
						if (prev.selectedFinishGrip) {
							clickedGrips.removeGripById(prev.selectedFinishGrip);
						}
						if (gripId === prev.selectedStartGrip) {
							updatedSelector.selectedStartGrip = undefined;
						}
						updatedSelector.selectedFinishGrip = gripId;
					}
					updatedSelector.selectedMode = undefined;

					return updatedSelector;
				});
			},

			clear: () => {
				log.info('createSelectorStore.clear');
				set({
					selectedMode: undefined,
					selectedStartGrip: undefined,
					selectedFinishGrip: undefined
				});
			}
		};
	};

	// Custom Store for Boulders
	const createBouldersStore = () => {
		const initialValue = isBrowser ? JSON.parse(localStorage.getItem('boulders') || '[]') : [];
		const { subscribe, update } = writable(initialValue);

		const addBoulder = async (
			clickedGripsMap: Map<string, { class: string }>,
			selectorState: Selector,
			name: string | undefined,
			action: 'save' | 'display'
		) => {
			log.debug('createBouldersStore.addBoulder');

			const clickedGripKeys = Array.from(clickedGripsMap.keys());

			const grips = clickedGripKeys.map((key) => {
				// Example of colorBrightness
				const colorBrightness = '255 0 0 / 50%';
				let grip: Grip = {
					id: key,
					colorBrightness: colorBrightness
				};

				if (selectorState.selectedStartGrip === key) {
					grip = { ...grip, start: selectorState.selectedStartGrip };
				} else if (selectorState.selectedFinishGrip === key) {
					grip = { ...grip, finish: selectorState.selectedFinishGrip };
				}

				return grip;
			});

			const newBoulder: Boulder = {
				id: generateId(),
				name: name,
				path: grips,
				createdAt: new Date().toISOString() //.toLocaleString()
			};

			log.debug('  newBoulder:', newBoulder);

			update((boulders) => [...boulders, newBoulder]);
			const existingBoulders = JSON.parse(localStorage.getItem('boulders') || '[]');
			localStorage.setItem('boulders', JSON.stringify([...existingBoulders, newBoulder]));

			try {
				const response = await services.boulder[action](newBoulder);

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

		const getGripClass = (selectedBoulderId: string, gripId: string) => {
			const boulders: Boulder[] = JSON.parse(localStorage.getItem('boulders') || '[]');
			const selectedBoulder = boulders.find((boulder) => boulder.id === selectedBoulderId);

			if (!selectedBoulder) return '';

			if (selectedBoulder.start === gripId) return startClass;
			if (selectedBoulder.finish === gripId) return finishClass;
			if (selectedBoulder.path.some((grip) => grip.id === gripId)) return clickedClass;

			return '';
		};

		return { subscribe, addBoulder, removeBoulder, getGripClass: getGripClass };
	};

	export const clickedGrips = createClickedGripsStore();
	export const selector = createSelectorStore();
	export const boulders = createBouldersStore();
</script>
