export type Mode = 'Top' | 'Start';

export type Variant = 'default' | 'play';

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
	createdAt: number;
	name?: string;
	start?: string;
	top?: string;
	path: Cell[];
};
