export const merge = async (node, inputData) => {
	const cluster_extraction =
		inputData.cluster_extraction || inputData[node.data.input_ids.cluster_extraction];
	const argument_extraction =
		inputData.argument_extraction || inputData[node.data.input_ids.argument_extraction];

	console.log('Computing merge');

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
