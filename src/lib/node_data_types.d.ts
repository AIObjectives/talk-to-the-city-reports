export interface BaseData {
	label: string;
	dirty: boolean;
	compute_type: string;
	input_ids: { [key: string]: string };
	category: string;
}

export interface DGEdgeInterface {
	id: string;
	source: string;
	selected: boolean;
	target: string;
}

export interface DGNodeInterface {
	id: string;
	position: {
		x: number;
		y: number;
	};
	type?: string;
}
