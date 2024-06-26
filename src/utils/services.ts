import { sendPostRequest } from './utils';
import log from './logger';

import type { ApiResponse, Boulder } from './BoulderTypes';

export const apiKey = import.meta.env.VITE_API_KEY as string;
const api = import.meta.env.VITE_BASE_URL as string;

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
