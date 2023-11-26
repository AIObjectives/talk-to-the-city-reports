interface BaseData {
	label: string;
	dirty: boolean;
	compute_type: string;
	input_ids: { [key: string]: string };
}

interface OpenAIKeyData extends BaseData {
	text: string;
}

interface TranslateData extends BaseData {
	target_language: string;
	gcs_path: string;
	keys: string[];
}

interface CSVData extends BaseData {
	csv: string;
	filename: string;
	size_kb: number;
	gcs_path: string;
}

interface EditCSVData extends BaseData {
	generate: { [key: string]: string };
	delete: string[];
	rename: { [key: string]: string };
}

interface LimitCSVData extends BaseData {
	number: number;
}

interface ClusterExtractionData extends BaseData {
	output: object;
	text: string;
	system_prompt: string;
	prompt: string;
	csv_length: number;
}

interface ArgumentExtractionData extends ClusterExtractionData {
	// Inherits all properties from ClusterExtractionData
}

interface ReportData extends BaseData {
	output: object;
}

interface ParticipantFilterData extends BaseData {
	text: string;
	output: object;
}

interface MergeData extends BaseData {
	output: object;
}

interface DGNode {
	id: string;
	position: {
		x: number;
		y: number;
	};
	type?: string;
}

type OpenAIKeyNode = DGNode & {
	data: OpenAIKeyData;
};

type TranslateNode = DGNode & {
	data: TranslateData;
};

type CSVNode = DGNode & {
	data: CSVData;
};

type EditCSVNode = DGNode & {
	data: EditCSVData;
};

type LimitCSVNode = DGNode & {
	data: LimitCSVData;
};

type ClusterExtractionNode = DGNode & {
	data: ClusterExtractionData;
};

type ArgumentExtractionNode = DGNode & {
	data: ArgumentExtractionData;
};

type ReportNode = DGNode & {
	data: ReportData;
};

type ParticipantFilterNode = DGNode & {
	data: ParticipantFilterData;
};

type MergeNode = DGNode & {
	data: MergeData;
};
