import type { ApiResponse, Boulder } from './BoulderTypes.ts';
import log from './logger.ts';
import { sendPostRequest } from './utils.ts';

const api = 'https://virtserver.swaggerhub.com/CEBREUS69/Boulder-Route-LED-Control-API/1.2.0';
log.debug('api', api);
const saveBoulder = `${api}/save-route`;
const displayBoulder = `${api}/display-route`;

type BoulderData = Omit<Boulder, 'createdAt'>;

export const services = {
	boulder: {
		save: async (boulderData: BoulderData): Promise<ApiResponse> => {
			return sendPostRequest<BoulderData>(saveBoulder, boulderData);
		},
		display: async (boulderData: BoulderData): Promise<ApiResponse> => {
			return sendPostRequest<BoulderData>(displayBoulder, boulderData);
		}
	}
};
