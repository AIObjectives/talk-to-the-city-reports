import _ from 'lodash';
import nodes from '$lib/node_register';
import DeepCopy from 'deep-copy';
import { db } from '$lib/firebase';
import categories from '$lib/node_categories';
import type { BaseData } from '$lib/node_data_types';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore/lite';

const $__ = unwrapFunctionStore(format);

interface FeedbackData extends BaseData {
	comments: { [claimId: string]: string[] };
}

export default class FeedbackNode {
	id: string;
	data: FeedbackData;
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
		this.data.dirty = false;
		const input = _.head(_.values(inputData));
		let output = DeepCopy(input);
		try {
			const q = query(collection(db, 'feedback'), where('slug', '==', slug));
			const querySnapshot = await getDocs(q);
			const oq = {};
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				oq[data.claimId] = data;
			});

			// get the keys of entries where the value is doesNotBelong
			const removeIds = _.keys(_.pickBy(oq, (value) => value.doesNotBelong)) || [];
			const moveIds = _.keys(_.pickBy(oq, (value) => value.miscategorized)) || [];
			const rephraseIds = _.keys(_.pickBy(oq, (value) => value.inaccurate)) || [];

			this.removeIdsFromClaims(output, removeIds);

			// success($__('comments_loaded_successfully'));
			return output;
		} catch (e) {
			error($__('error_loading_comments') + `: ${e}`);
		}
	}

	removeIdsFromClaims(data, ids) {
		_.forEach(ids, (id) => {
			_.forIn(data, (item) => _.remove(item.claims, { claim: id }));
		});
	}

	async addCommentToClaim(claims, slug, submitData: any, success, error) {
		_.forEach(claims, async (claim) => {
			try {
				const docRef = await addDoc(collection(db, 'feedback'), {
					slug: slug,
					claimId: claim.claim,
					...submitData
				});

				if (docRef.id) {
					success($__('success'));
				} else {
					error($__('error'));
				}
			} catch (e) {
				error(e);
			}
		});
	}
}

type FeedbackNodeInterface = DGNodeInterface & {
	data: FeedbackData;
};

export let feedback_node_data: FeedbackNodeInterface = {
	id: 'feedback',
	data: {
		label: $__('feedback'),
		dirty: false,
		output: {},
		compute_type: 'feedback_v0',
		input_ids: {},
		category: categories.input.id,
		icon: 'feedback_v0',
		show_in_ui: false
	},
	position: { x: 0, y: 0 },
	type: 'feedback_v0'
};

export let feedback_node = new FeedbackNode(feedback_node_data);

nodes.register(FeedbackNode, feedback_node_data);
