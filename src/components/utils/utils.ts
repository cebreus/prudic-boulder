import log from 'loglevel';
import type { ApiResponse } from './BoulderTypes.ts';
import { apiKey } from './services.ts';

export const gripsToSkip: ReadonlySet<string> = new Set([
	'B0',
	'B3',
	'B6',
	'B9',
	'C1',
	'C2',
	'C4',
	'C5',
	'C7',
	'C8',
	'D0',
	'D3',
	'D6',
	'D9',
	'E1',
	'E2',
	'E4',
	'E5',
	'E7',
	'F0',
	'F3',
	'F6',
	'F9',
	'G1',
	'G2',
	'G4',
	'G5',
	'G7',
	'G8',
	'H0',
	'H3',
	'H6',
	'H9',
	'I1',
	'I2',
	'I4',
	'I5',
	'I7',
	'I8',
	'J0',
	'J3',
	'J6',
	'J9',
	'K1',
	'K2',
	'K4',
	'K5',
	'K7',
	'K8',
	'L0',
	'L3',
	'L6',
	'L9',
	'M1',
	'M2',
	'M4',
	'M5',
	'M7',
	'M8',
	'N0',
	'N3',
	'N6',
	'N9',
	'O1',
	'O2',
	'O4',
	'O5',
	'O7',
	'O8',
	'P0',
	'P3',
	'P6',
	'P9',
	'Q0',
	'Q1',
	'Q4',
	'Q5',
	'Q8',
	'Q9',
	'R1',
	'R3',
	'R6',
	'R8'
]);

export const isSkippedGrip = (gripId: string): boolean => {
	return gripsToSkip.has(gripId);
};

export const rows: number = 18;
export const cols: number = 10;

type CssClassName = 'skipped' | 'holds' | 'start' | 'top';

export const skippedClass: CssClassName = 'skipped';
export const clickedClass: CssClassName = 'holds';
export const startClass: CssClassName = 'start';
export const finishClass: string = 'finish';

export const generateId = (name: string = ''): string => {
	return `${name}${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 8)}`;
};

const BaseTimeoutMilliseconds = 2000;
const MillisecondsPerCharacter = 30;

export const calculateTimeout = (title: string = '', description: string = ''): number => {
	const totalInputLength = title.length + description.length;
	const additionalTimeout = totalInputLength * MillisecondsPerCharacter;
	return BaseTimeoutMilliseconds + additionalTimeout;
};

export const sendPostRequest = async <T>(url: string, data: T): Promise<ApiResponse> => {
	try {
		log.debug('Sending POST request', { url, data });
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const message = `An error has occurred: ${response.status}`;
			log.error('Error during POST request', { message, response });
			throw new Error(message);
		}

		return await response.json();
	} catch (error) {
		log.error('Error in sendPostRequest function', error);
		throw error;
	}
};

export const adjustColor = (hex: string, brightness: number): string => {
	let [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
	const factor = brightness / 100;
	[r, g, b] = [r, g, b].map((c) => Math.round(c * factor));
	return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
};
