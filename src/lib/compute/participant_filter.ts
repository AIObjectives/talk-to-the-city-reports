export const participant_filter = async (
	node: ParticipantFilterNode,
	inputData: object,
	context
) => {
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

interface ParticipantFilterData extends BaseData {
	text: string;
	output: object;
}

type ParticipantFilterNode = DGNodeInterface & {
	data: ParticipantFilterData;
};

export const participant_filter_node: ParticipantFilterNode = {
	id: 'participant_filter',
	data: {
		label: 'Participant filter',
		text: '',
		dirty: false,
		output: {},
		compute_type: 'participant_filter_v0',
		input_ids: {}
	},
	position: { x: 200, y: 700 },
	type: 'text_input_v0'
};
