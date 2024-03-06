export type Mode = 'Top' | 'Start';

export type Cell = {
	id: string;
	colorBrightness: string;
};

export type Selector = {
	selectedMode: Mode | undefined;
	selectedStartCell: string | undefined;
	selectedTopCell: string | undefined;
};

export type Boulder = {
	id: string;
	createdAt: string;
	name?: string;
	start?: string;
	top?: string;
	path: Cell[];
};
