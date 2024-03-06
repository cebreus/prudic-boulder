import type { Boulder } from './BoulderTypes.ts';
import logger from './logger.ts';

const api = 'https://virtserver.swaggerhub.com/CEBREUS69/Boulder-Route-LED-Control-API/1.1.0';
const saveBoulder = `${api}/save-route`;
const displayBoulder = `${api}/display-route`;

type BoulderData = Omit<Boulder, 'createdAt'>;

export const services = {
	boulder: {
		save: async (boulderData: BoulderData) => {
			try {
				logger.debug('Saving boulder data', boulderData);
				const response = await fetch(saveBoulder, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(boulderData)
				});
				if (!response.ok) {
					const message = `An error has occurred: ${response.status}`;
					logger.error('Error saving boulder', { message, response });
					throw new Error(message);
				}
				const responseData = await response.json();
				logger.info('Boulder saved successfully', responseData);
				return responseData;
			} catch (error) {
				logger.error('Error in save function', error);
				throw error;
			}
		},
		display: async (boulderData: BoulderData) => {
			try {
				logger.debug('Displaying boulder data', boulderData);
				const response = await fetch(displayBoulder, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(boulderData)
				});
				if (!response.ok) {
					const message = `An error has occurred: ${response.status}`;
					logger.error('Error displaying boulder', { message, response });
					throw new Error(message);
				}
				const responseData = await response.json();
				logger.info('Boulder data displayed successfully', responseData);
				return responseData;
			} catch (error) {
				logger.error('Error in display function', error);
				throw error;
			}
		}
	}
};
