import type { ApiResponse, Boulder } from './BoulderTypes.ts';
import log from './logger.ts';
import { sendPostRequest } from './utils.ts';

const api = import.meta.env.VITE_API_URL as string;

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
