export const participant_filter = async (node: ParticipantFilterNode, inputData: object) => {
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];
	console.log('participant_filter', input);
	if (input && input.topics) {
		const copy = JSON.parse(JSON.stringify(input));
		const participantName = node.data.text.toLowerCase();
		console.log('participantName', participantName);
		copy.topics.forEach((topic: any) => {
			topic.subtopics.forEach((subtopic: any) => {
				subtopic.claims = subtopic.claims.filter((claim: any) =>
					claim.interview.toLowerCase().includes(participantName)
				);
			});
			topic.subtopics = topic.subtopics.filter((subtopic: any) => subtopic.claims.length > 0);
		});
		copy.topics = copy.topics.filter((topic: any) => topic.subtopics.length > 0);
		console.log('copy', copy);
		return copy;
	}
};
