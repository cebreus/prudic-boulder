import log from 'loglevel';
import type { ApiResponse, Boulder } from './BoulderTypes.ts';
import { apiKey } from './services.ts';
import { addToast } from './ToastService.ts';

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

type CssClassName = 'skipped' | 'holds' | 'start' | 'finish';

export const skippedClass: CssClassName = 'skipped';
export const clickedClass: CssClassName = 'holds';
export const startClass: CssClassName = 'start';
export const finishClass: CssClassName = 'finish';

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
export const hexToRgba = (hex: string | undefined, alpha: number): string => {
	if (!hex) {
		return '';
	}

	hex = hex.replace(/^#/, '');
	let r: number,
		g: number,
		b: number,
		a: number = 100;

	if (hex.length === 3) {
		r = parseInt(hex[0] + hex[0], 16);
		g = parseInt(hex[1] + hex[1], 16);
		b = parseInt(hex[2] + hex[2], 16);
	} else if (hex.length === 6) {
		r = parseInt(hex.substring(0, 2), 16);
		g = parseInt(hex.substring(2, 4), 16);
		b = parseInt(hex.substring(4, 6), 16);
		a = alpha !== undefined ? alpha : a;
	} else if (hex.length === 8) {
		r = parseInt(hex.substring(0, 2), 16);
		g = parseInt(hex.substring(2, 4), 16);
		b = parseInt(hex.substring(4, 6), 16);
		a = parseInt(hex.substring(6, 8), 16) / 255;
	} else {
		throw new Error('Invalid hex color format');
	}

	return `rgb(${r} ${g} ${b} / ${a}%)`;
};

export const rgbaToHex = (color: string | undefined): string => {
	if (color === undefined) {
		return '';
	}

	const rgbMatch = color.match(/rgb\((\d{1,3})\s+(\d{1,3})\s+(\d{1,3})(?:\s*\/\s*(\d{1,3})%?)?\)/i);
	if (!rgbMatch) {
		// throw new Error('Invalid RGBA color format');
		log.error('Invalid RGBA color format');
		return '';
	}

	// Directly parse RGB values from the match
	const r = Number(rgbMatch[1]);
	const g = Number(rgbMatch[2]);
	const b = Number(rgbMatch[3]);
	const a = rgbMatch[4] ? Number(rgbMatch[4]) / 100 : 1;

	// Ensure RGB values are within the valid range
	if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
		throw new Error('RGB values must be in the range 0-255');
	}

	// Validate the alpha value is within the correct range
	if (a < 0 || a > 1) {
		throw new Error('Alpha value must be between 0% and 100%');
	}

	// Helper function to convert and clamp each color component
	const convertAndClamp = (component: number): string => {
		const clampedValue = Math.max(0, Math.min(255, Math.round(component * a + 255 * (1 - a))));
		const hex = clampedValue.toString(16);
		return hex.padStart(2, '0');
	};

	// Convert and clamp each RGB component
	const redHex = convertAndClamp(r);
	const greenHex = convertAndClamp(g);
	const blueHex = convertAndClamp(b);

	return `#${redHex}${greenHex}${blueHex}`;
};

export const readFileContent = async (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
		reader.readAsText(file);
	});
};

export const validateAndTransformData = (fileContent: string): Boulder[] => {
	try {
		const data = JSON.parse(fileContent);

		const boulders = Array.isArray(data) ? data : [data];

		return boulders.map((boulder, index) => {
			if (typeof boulder.id !== 'string') {
				throw new Error(`Boulder at index ${index} has an invalid or missing "id" property.`);
			}
			if (!Array.isArray(boulder.path)) {
				throw new Error(`Boulder at index ${index} has an invalid or missing "path" property.`);
			}
			return boulder;
		});
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error(`JSON parsing error: ${error.message}`);
		} else if (error instanceof Error) {
			throw new Error(`Validation error: ${error.message}`);
		} else {
			throw new Error(`Unexpected error: ${String(error)}`);
		}
	}
};

// Define a helper function for creating and downloading the file
const downloadJsonFile = (jsonContent: Boulder | Boulder[], fileName: string) => {
	const jsonString = JSON.stringify(jsonContent);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.download = fileName;
	link.href = url;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

export const exportToJsonFile = (boulderData: Boulder) => {
	downloadJsonFile(boulderData, `boulder-${boulderData.id}.json`);
};

export const exportAllToSingleJsonFile = () => {
	const allBoulders = fetchAllBoulders(); // Assume this function is defined elsewhere and fetches all boulder data
	downloadJsonFile(allBoulders, 'all-boulders.json');
};

const fetchAllBoulders = (): Boulder[] => {
	const bouldersJson = localStorage.getItem('boulders');
	if (bouldersJson) {
		const boulders = JSON.parse(bouldersJson);
		if (boulders.length === 0) {
			log.info('No boulders found');
			addToast('Nejsou bouldery', 'error');
			return [];
		}
		return boulders;
	} else {
		log.info('Boulders key not found in localStorage');
		addToast('Nejsou bouldery', 'error');
		return [];
	}
};
