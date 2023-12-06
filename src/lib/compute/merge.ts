import nodes from '$lib/node_register';
import categories from '$lib/node_categories';

export default class MergeNode {
	id: string;
	data: MergeData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data: MergeNodeInterface) {
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
		slug: string
	) {
		const cluster_extraction =
			inputData.cluster_extraction || inputData[this.data.input_ids.cluster_extraction];
		const argument_extraction =
			inputData.argument_extraction || inputData[this.data.input_ids.argument_extraction];

		if (!cluster_extraction || !argument_extraction || !cluster_extraction.topics) {
			this.data.dirty = false;
			return;
		}

		const findClaimsForSubtopic = (topicName, subtopicName) => {
			const claims = [];
			Object.values(argument_extraction).forEach((argument) => {
				argument.claims.forEach((claim) => {
					if (claim.topicName === topicName && claim.subtopicName === subtopicName) {
						claim.interview = argument.interview;
						claim.id = argument.id;
						claims.push(claim);
					}
				});
			});
			return claims;
		};

		const mergedData = {
			topics: cluster_extraction.topics.map((topic) => {
				const filteredSubtopics = topic.subtopics
					.map((subtopic) => {
						const claims = findClaimsForSubtopic(topic.topicName, subtopic.subtopicName);
						return claims.length > 0 ? { ...subtopic, claims } : null;
					})
					.filter((subtopic) => subtopic !== null);

				return {
					...topic,
					subtopics: filteredSubtopics
				};
			})
		};

		this.data.output = mergedData;
		this.data.dirty = false;
		return mergedData;
	}
}

interface MergeData extends BaseData {
	output: object;
}

type MergeNodeInterface = DGNodeInterface & {
	data: MergeData;
};

export let merge_node_data: MergeNodeInterface = {
	id: 'merge',
	data: {
		label: 'Merge',
		output: {},
		dirty: false,
		compute_type: 'merge_v0',
		input_ids: { cluster_extraction: '', argument_extraction: '' },
		category: categories.wrangling.id,
		icon: 'merge_v0'
	},
	position: { x: 0, y: 0 },
	type: 'merge_v0'
};

export let merge_node = new MergeNode(merge_node_data);

nodes.register(MergeNode, merge_node_data);
