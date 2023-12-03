import categories from '$lib/node_categories';

export const merge = async (
	node: MergeNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	const cluster_extraction =
		inputData.cluster_extraction || inputData[node.data.input_ids.cluster_extraction];
	const argument_extraction =
		inputData.argument_extraction || inputData[node.data.input_ids.argument_extraction];

	if (!cluster_extraction || !argument_extraction || !cluster_extraction.topics) {
		node.data.dirty = false;
		return;
	}

	function findClaimsForSubtopic(topicName, subtopicName) {
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
	}

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

	node.data.output = [];
	node.data.dirty = false;
	return mergedData;
};

interface MergeData extends BaseData {
	output: object;
}

type MergeNode = DGNodeInterface & {
	data: MergeData;
};

export const merge_node: MergeNode = {
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
	position: { x: 200, y: 600 },
	type: 'merge_v0'
};
