import type { Boulder } from './BoulderTypes.ts';
import log from './logger.ts';

const api = import.meta.env.VITE_API_URL as string;
log.debug('api', api);
const saveBoulder = `${api}/save-route`;
const displayBoulder = `${api}/display-route`;

type BoulderData = Omit<Boulder, 'createdAt'>;

export const services = {
	boulder: {
		save: async (boulderData: BoulderData) => {
			try {
				log.debug('Saving boulder data', boulderData);
				const response = await fetch(saveBoulder, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(boulderData)
				});
				if (!response.ok) {
					const message = `An error has occurred: ${response.status}`;
					log.error('Error saving boulder', { message, response });
					throw new Error(message);
				}
				const responseData = await response.json();
				log.info('Boulder saved successfully', responseData);
				return responseData;
			} catch (error) {
				log.error('Error in save function', error);
				throw error;
			}
		},
		display: async (boulderData: BoulderData) => {
			try {
				log.debug('Displaying boulder data', boulderData);
				const response = await fetch(displayBoulder, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(boulderData)
				});
				if (!response.ok) {
					const message = `An error has occurred: ${response.status}`;
					log.error('Error displaying boulder', { message, response });
					throw new Error(message);
				}
				const responseData = await response.json();
				log.info('Boulder data displayed successfully', responseData);
				return responseData;
			} catch (error) {
				log.error('Error in display function', error);
				throw error;
			}
		}
	}
};
