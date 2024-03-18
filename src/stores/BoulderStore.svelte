<script context="module" lang="ts">
	import { addToast } from '../utils/ToastService';
	import {
		generateId,
		clickedClass,
		startClass,
		finishClass,
		validateAndTransformData
	} from '../utils/utils';
	import { writable } from 'svelte/store';
	import log from '../utils/logger';

	// Define TypeScript types
	import type { Boulder, Grip, Mode, Selector } from '../utils/BoulderTypes';
	import { services } from '../utils/services';

	// check for browser environment
	const isBrowser = typeof window !== 'undefined';

	// Custom Store for ClickedGrips
	const createClickedGripsStore = () => {
		const { subscribe, set, update } = writable(new Map());

		return {
			subscribe,
			toggle: (gripId: string, selectedMode: Mode | undefined, color: string | undefined) => {
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
							// updated.set(gripId, { class: gripClass, color: undefined });
							updated.delete(gripId);
						} else {
							log.info('    Adding:   ', gripId);
							log.info('    Class:   ', gripClass);
							log.info('    color:   ', color);
							updated.set(gripId, { class: gripClass, color: color });
						}
					} else {
						log.info('    Adding:   ', gripId);
						updated.set(gripId, { class: gripClass, color: color });
					}
					return updated;
				});
			},

			setColorForGrip: (gripId: string, color: string) => {
				log.info('My color:', color);
				update((grips) => {
					const updated = new Map(grips);
					const grip = updated.get(gripId) || {};
					grip.color = color;
					updated.set(gripId, grip);
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
			clickedGripsMap: Map<string, { class: string; color: string }>,
			selectorState: Selector,
			name: string | undefined,
			action: 'save' | 'display'
		) => {
			log.debug('createBouldersStore.addBoulder');
			if (!clickedGripsMap.size) {
				log.trace('Pick at least one grip');
				addToast('Vyberte alespoň jednu buňku!');
				return;
			}

			const clickedGripKeys = Array.from(clickedGripsMap.keys());

			const grips = clickedGripKeys.map((key) => {
				const gripData = clickedGripsMap.get(key);
				// Example of colorBrightness
				let colorBrightness = 'rgb(252 237 170/ 100%)'; // Default color if no specific color is provided

				colorBrightness = gripData?.color || colorBrightness;

				let grip: Grip = {
					id: key,
					colorBrightness: colorBrightness
				};

				if (selectorState.selectedStartGrip === key && !gripData?.color) {
					grip = {
						...grip,
						start: selectorState.selectedStartGrip,
						colorBrightness: 'rgb(121 206 147 / 100%)'
					};
				} else if (selectorState.selectedFinishGrip === key && !gripData?.color) {
					grip = {
						...grip,
						finish: selectorState.selectedFinishGrip,
						colorBrightness: 'rgb(208 151 220 / 100%)'
					};
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

			// Update the boulders store with the new boulder
			update((boulders) => [...boulders, newBoulder]);
			// Get existing boulders from localStorage, add the new boulder, and update localStorage
			const existingBoulders = JSON.parse(localStorage.getItem('boulders') || '[]');
			localStorage.setItem('boulders', JSON.stringify([...existingBoulders, newBoulder]));

			addToast(
				`Prudič byl uložen`,
				'success',
				'Přejděte na <a href="/">hlavní stránku</a> pro zobrazení'
			);

			try {
				const response = await services.boulder[action](newBoulder);

				log.info('Boulder saved successfully on server', response);
				addToast(
					`Prudič byl  ${action === 'save' ? 'uložen' : 'zobrazen a uložen na server'}`,
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

		const updateStore = (
			bouldersToImport: Boulder[],
			shouldReplace: boolean,
			errorCallback: (message: string) => void
		) => {
			update((currentBoulders: Boulder[]) => {
				if (bouldersToImport.length === 0) {
					throw new Error(`žádná data`);
				}

				const duplicateBoulder = bouldersToImport.find((importedBoulder) =>
					currentBoulders.some((existingBoulder) => existingBoulder.id === importedBoulder.id)
				);

				if (duplicateBoulder && !shouldReplace) {
					errorCallback(`Boulder s ID ${duplicateBoulder.id} již existuje. Import byl zrušen.`);
					throw new Error(`Boulder s ID ${duplicateBoulder.id} již existuje. Import byl zrušen.`);
				}

				const newBoulders = shouldReplace
					? [...bouldersToImport]
					: [...currentBoulders, ...bouldersToImport];
				localStorage.setItem('boulders', JSON.stringify(newBoulders));
				addToast(`Boldery byly ${shouldReplace ? 'nahrazený' : 'přidáný'}`, 'success');
				return newBoulders;
			});
		};

		const importBoulder = async (
			fileContent: string,
			shouldReplace: boolean,
			errorCallback: (errorMessage: string) => void
		) => {
			try {
				const bouldersToImport = validateAndTransformData(fileContent);
				updateStore(bouldersToImport, shouldReplace, errorCallback);
			} catch (error) {
				log.error('Error importing boulders:', error);
				errorCallback(
					`Chyba při importu bolderů: ${error instanceof Error ? error.message : String(error)}`
				);
				throw error;
			}
		};

		const getGripClass = (selectedBoulderId: string | undefined, gripId: string) => {
			if (!selectedBoulderId) return { class: '', color: '' };

			const boulders: Boulder[] = JSON.parse(localStorage.getItem('boulders') || '[]');
			const selectedBoulder = boulders.find((boulder) => boulder.id === selectedBoulderId);

			if (!selectedBoulder) return { class: '', color: '' };

			// Find the grip within the path of the selected boulder that matches the provided gripId
			const grip = selectedBoulder.path.find((grip) => grip.id === gripId);
			// If the gri isn't part of the selected boulder's path, return default values
			if (!grip) return { class: '', color: '' };

			let gripClass = '';

			if (selectedBoulder.path.find((grip) => grip.start === gripId)) gripClass = startClass;
			else if (selectedBoulder.path.find((grip) => grip.finish === gripId)) gripClass = finishClass;
			else gripClass = clickedClass;

			return { class: gripClass, color: grip.colorBrightness || '' };
		};

		return { subscribe, addBoulder, removeBoulder, getGripClass: getGripClass, importBoulder };
	};

	export const clickedGrips = createClickedGripsStore();
	export const selector = createSelectorStore();
	export const boulders = createBouldersStore();
</script>
