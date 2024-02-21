export type CellId = string;
export type BoulderId = string;

export type Cell = {
	id: CellId;
	colorBrightness: string;
};

export type Selector = {
	selectedMode: string | null;
	selectedStartCell: string | null;
	selectedTopCell: string | null;
};

export type Boulder = {
	id: BoulderId;
	createdAt: number;
	name?: string;
	start?: string;
	top?: string;
	path: Cell[];
};

export type BouldersArray = Boulder[];
