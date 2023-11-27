interface BaseData {
	label: string;
	dirty: boolean;
	compute_type: string;
	input_ids: { [key: string]: string };
}

interface DGEdgeInterface {
	id: string;
	source: string;
	selected: boolean;
	target: string;
}

interface DGNodeInterface {
	id: string;
	position: {
		x: number;
		y: number;
	};
	type?: string;
}
