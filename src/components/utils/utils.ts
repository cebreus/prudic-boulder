import * as t from 'io-ts';
import { isRight } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';
import type { Boulder } from './BoulderTypes.ts';

export const cellsToSkip: ReadonlySet<string> = new Set([
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

export const isSkippedCell = (cellId: string): boolean => {
	return cellsToSkip.has(cellId);
};

export const rows: number = 18;
export const cols: number = 10;

type CssClassName = 'skipped' | 'holds' | 'start' | 'top';

export const skippedClass: CssClassName = 'skipped';
export const clickedClass: CssClassName = 'holds';
export const startClass: CssClassName = 'start';
export const topClass: CssClassName = 'top';

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

const CellCodec = t.type({
	id: t.string,
	colorBrightness: t.string
});

const BoulderCodec = t.type({
	id: t.string,
	name: t.union([t.string, t.undefined]),
	path: t.array(CellCodec),
	start: t.union([t.string, t.undefined]),
	top: t.union([t.string, t.undefined]),
	createdAt: t.union([t.string, t.undefined])
});

export const BouldersCodec = t.array(BoulderCodec);

export const readFileContent = async (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
		reader.readAsText(file);
	});
};

export const validateAndTransformData = (fileContent: string): Boulder[] => {
	const parsedData = JSON.parse(fileContent);

	// This allows for both single objects and arrays of objects in the input JSON
	const dataToValidate = Array.isArray(parsedData) ? parsedData : [parsedData];

	// Validate the (potentially modified) data structure
	const validationResult = BouldersCodec.decode(dataToValidate);

	if (isRight(validationResult)) {
		// If validation succeeds, transform the data as before
		return validationResult.right.map(
			(boulder): Boulder => ({
				...boulder,
				createdAt: boulder.createdAt || new Date().toISOString()
			})
		);
	} else {
		const errors = PathReporter.report(validationResult);
		throw new Error(`Invalid data format: ${errors.join(', ')}`);
	}
};
