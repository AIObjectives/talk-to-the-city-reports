import nodes from '$lib/node_register';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '$lib/firebase';
import categories from '$lib/node_categories';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import type { BaseData } from '$lib/node_data_types';

const $__ = unwrapFunctionStore(format);

interface OpenQuestionsData extends BaseData {
	comments: { [claimId: string]: string[] };
}

export default class OpenQuestionsNode {
	id: string;
	data: OpenQuestionsData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data) {
		const { id, data, position, type } = node_data;
		this.id = id;
		this.data = data;
		this.position = position;
		this.type = type;
	}

	async compute(
		inputData: object,
		context: string,
		info: (arg: string) => void,
		error: (arg: string) => void,
		success: (arg: string) => void,
		slug: string,
		Cookies: any
	) {
		try {
			const q = query(collection(db, 'open_questions'), where('slug', '==', slug));
			const querySnapshot = await getDocs(q);
			this.data.output = {};
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				this.data.output[data.claimId] = data.output;
			});
			this.data.output['22'] = [
				{
					comment: 'I think this is a good idea.',
					user: 'John Doe'
				}
			];
			success($__('comments_loaded_successfully'));
			return this.data.output;
		} catch (e) {
			error($__('error_loading_comments') + `: ${e}`);
		}
	}

	// async addCommentToClaim(claimId: string, comment: string, slug: string) {
	// 	if (!this.data.output[claimId]) {
	// 		this.data.output[claimId] = [];
	// 	}
	// 	this.data.output[claimId].push(comment);
	// 	await addDoc(collection(db, 'open_questions'), {
	// 		slug,
	// 		claimId,
	// 		comments
	// 	});
	// }
}

type OpenQuestionsNodeInterface = DGNodeInterface & {
	data: OpenQuestionsData;
};

export let open_questions_node_data: OpenQuestionsNodeInterface = {
	id: 'open_questions',
	data: {
		label: $__('open_questions'),
		dirty: false,
		output: {},
		compute_type: 'open_questions_v0',
		input_ids: {},
		category: categories.input.id,
		icon: 'open_questions_v0',
		show_in_ui: true
	},
	position: { x: 0, y: 0 },
	type: 'open_questions_v0'
};

export let open_questions_node = new OpenQuestionsNode(open_questions_node_data);

nodes.register(OpenQuestionsNode, open_questions_node_data);
