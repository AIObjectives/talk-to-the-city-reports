import categories from '$lib/node_categories';

export const participant_filter = async (
	node: ParticipantFilterNode,
	inputData: object,
	context: string,
	info: (arg: string) => void,
	error: (arg: string) => void,
	success: (arg: string) => void,
	slug: string
) => {
	node.data.dirty = false;
	const input = inputData[Object.keys(inputData)[0]];
	if (input && input.topics) {
		const copy = JSON.parse(JSON.stringify(input));
		const participantName = node.data.text.toLowerCase();
		copy.topics.forEach((topic: any) => {
			topic.subtopics.forEach((subtopic: any) => {
				subtopic.claims = subtopic.claims.filter((claim: any) => {
					if (claim.interview) return claim.interview.toLowerCase().includes(participantName);
					else return true;
				});
			});
			topic.subtopics = topic.subtopics.filter((subtopic: any) => subtopic.claims.length > 0);
		});
		copy.topics = copy.topics.filter((topic: any) => topic.subtopics.length > 0);
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
		input_ids: {},
		category: categories.wrangling.id,
		icon: 'participant_filter_v0'
	},
	position: { x: 200, y: 700 },
	type: 'text_input_v0'
};
