export type Cell = {
	id: string;
	colorBrightness: string;
};

export type Selector = {
	selectedMode: string | null;
	selectedStartCell: string | null;
	selectedTopCell: string | null;
};

export type Boulder = {
	id: string;
	createdAt: number;
	name?: string;
	start?: string;
	top?: string;
	path: Cell[];
};
