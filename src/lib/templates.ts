import { getDocs, doc, setDoc, addDoc, query } from '@firebase/firestore/lite';
import { templatesCollection } from '$lib/firebase';
import { extraction_prompt, summary_prompt } from './prompts';

const open_ai_key: OpenAIKeyNode = {
	id: 'open_ai_key',
	data: {
		label: 'OpenAI Key',
		text: 'sk-...',
		dirty: false,
		save_output: false,
		compute_type: 'open_ai_key_v0',
		input_ids: {}
	},
	position: { x: -200, y: 50 },
	type: 'text_input_v0'
};

const translate: TranslateNode = {
	id: 'translate',
	data: {
		label: 'Translate',
		target_language: 'English',
		keys: [],
		dirty: false,
		save_output: true,
		compute_type: 'translate_v0',
		input_ids: { open_ai_key: '', data: '' }
	},
	position: { x: -200, y: 50 },
	type: 'translate_v0'
};

let csv: CSVNode = {
	id: 'csv',
	data: {
		label: 'CSV',
		csv: '',
		filename: '',
		size_kb: 0,
		dirty: false,
		save_output: true,
		compute_type: 'csv_v0',
		input_ids: {}
	},
	position: { x: 100, y: -50 },
	type: 'csv_v0'
};

let limit_csv: LimitCSVNode = {
	id: 'limit_csv',
	data: {
		label: 'Limit CSV',
		dirty: false,
		number: 2,
		save_output: false,
		compute_type: 'limit_csv_v0',
		input_ids: { csv: '' }
	},
	position: { x: 100, y: -50 },
	type: 'number_input_v0'
};

let edit_csv: EditCSVNode = {
	id: 'edit_csv',
	data: {
		label: 'Edit CSV',
		dirty: false,
		generate: {},
		delete: [],
		rename: {},
		save_output: false,
		compute_type: 'edit_csv_v0',
		input_ids: { csv: '' }
	},
	position: { x: 100, y: -50 },
	type: 'edit_csv_v0'
};

const cluster_extraction: ClusterExtractionNode = {
	id: 'cluster_extraction',
	data: {
		label: 'Cluster Extraction',
		output: {},
		text: '',
		system_prompt:
			'You are a professional research assistant. You have helped run many public consultations, surveys and citizen assemblies.',
		prompt: summary_prompt,
		dirty: false,
		save_output: true,
		compute_type: 'cluster_extraction_v0',
		input_ids: { open_ai_key: '', csv: '' }
	},
	position: { x: 100, y: 100 },
	type: 'prompt_v0'
};

const argument_extraction: ArgumentExtractionNode = {
	id: 'argument_extraction',
	data: {
		label: 'Argument Extraction',
		output: {},
		text: '',
		system_prompt:
			'You are a professional research assistant. You have helped run many public consultations, surveys and citizen assemblies. You have good instincts when it comes to extracting interesting insights. You are familiar with public consultation tools like Pol.is and you understand the benefits for working with very clear, concise claims that other people would be able to vote on.',
		prompt: extraction_prompt,
		dirty: false,
		save_output: true,
		compute_type: 'argument_extraction_v0',
		input_ids: { open_ai_key: '', csv: '', cluster_extraction: '' }
	},
	position: { x: 0, y: 350 },
	type: 'prompt_v0'
};

const report: ReportNode = {
	id: 'report',
	data: {
		label: 'Report',
		output: {},
		dirty: false,
		save_output: false,
		compute_type: 'report_v0',
		input_ids: {}
	},
	position: { x: 200, y: 850 },
	type: 'report_v0'
};

const participant_filter: ParticipantFilterNode = {
	id: 'participant_filter',
	data: {
		label: 'Participant filter',
		text: '',
		dirty: false,
		save_output: false,
		output: {},
		compute_type: 'participant_filter_v0',
		input_ids: {}
	},
	position: { x: 200, y: 700 },
	type: 'text_input_v0'
};

const merge: MergeNode = {
	id: 'merge',
	data: {
		label: 'Merge',
		output: {},
		dirty: false,
		save_output: false,
		compute_type: 'merge_v0',
		input_ids: { cluster_extraction: '', argument_extraction: '' }
	},
	position: { x: 200, y: 600 },
	type: 'merge_v0'
};

export let node_register = [
	open_ai_key,
	csv,
	edit_csv,
	cluster_extraction,
	argument_extraction,
	merge,
	participant_filter,
	report,
	limit_csv,
	translate
];

export let templates = {
	heal_michigan: {
		nodes: [
			open_ai_key,
			csv,
			cluster_extraction,
			argument_extraction,
			merge,
			participant_filter,
			report
		],
		edges: [
			{
				id: 'open_ai_key-cluster_extraction',
				source: 'open_ai_key',
				target: 'cluster_extraction'
			},
			{
				id: 'open_ai_key-argument_extraction',
				source: 'open_ai_key',
				target: 'argument_extraction'
			},
			{
				id: 'csv-cluster_extraction',
				source: 'csv',
				target: 'cluster_extraction'
			},
			{
				id: 'cluster_extraction-argument_extraction',
				source: 'cluster_extraction',
				target: 'argument_extraction'
			},
			{
				id: 'csv-argument_extraction',
				source: 'csv',
				target: 'argument_extraction'
			},
			{
				id: 'argument_extraction-merge',
				source: 'argument_extraction',
				target: 'merge'
			},
			{
				id: 'cluster_extraction-merge',
				source: 'cluster_extraction',
				target: 'merge'
			},
			{
				id: 'merge-participant_filter',
				source: 'merge',
				target: 'participant_filter'
			},
			{
				id: 'participant_filter-report',
				source: 'participant_filter',
				target: 'report'
			}
		]
	}
};

export async function loadTemplates() {
	const q = query(templatesCollection);
	const querySnapshot = await getDocs(q);
	let templates = {};
	querySnapshot.docs.forEach((doc) => {
		templates[doc.id] = doc.data();
	});
	return templates;
}

export async function saveTemplate(name: string, data: any) {
	for (const node of data.nodes) {
		if (!node.data.output) {
			node.data.output = {};
		}
	}
	try {
		const docRef = doc(templatesCollection, name);
		await setDoc(docRef, data);
		console.log(`Template '${name}' successfully updated.`);
	} catch (error) {
		console.error('Error updating template:', error);
	}
}
