export type Mode = 'Finish' | 'Start';

export type Grip = {
	id: string;
	colorBrightness: string;
	start?: string;
	finish?: string;
};

export type Selector = {
	selectedMode: Mode | undefined;
	selectedStartGrip: string | undefined;
	selectedFinishGrip: string | undefined;
};

export type Boulder = {
	id: string;
	createdAt: string;
	name?: string;
	start?: string;
	finish?: string;
	path: Grip[];
};

export type ApiResponse = {
	status: number;
	title: string;
	detail: string;
};
