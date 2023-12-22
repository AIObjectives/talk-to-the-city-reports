import nodes from '$lib/node_register';
import categories from '$lib/node_categories';

export default class ParticipantFilterNode {
	id: string;
	data: ParticipantFilterData;
	position: { x: number; y: number };
	type: string;

	constructor(node_data: ParticipantFilterNodeInterface) {
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
		const input = inputData[Object.keys(inputData)[0]];
		if (input && input.topics) {
			const copy = JSON.parse(JSON.stringify(input));
			const participantName = this.data.text.toLowerCase();
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
	}
}

interface ParticipantFilterData extends BaseData {
	text: string;
	output: object;
	placehoder: string;
}

type ParticipantFilterNodeInterface = DGNodeInterface & {
	data: ParticipantFilterData;
};

export let participant_filter_node_data: ParticipantFilterNodeInterface = {
	id: 'participant_filter',
	data: {
		label: 'participant_filter',
		text: '',
		dirty: false,
		output: {},
		compute_type: 'participant_filter_v0',
		input_ids: {},
		category: categories.wrangling.id,
		icon: 'participant_filter_v0',
		show_in_ui: true,
		placeholder: ''
	},
	position: { x: 0, y: 0 },
	type: 'text_input_v0'
};

export let participant_filter_node = new ParticipantFilterNode(participant_filter_node_data);

nodes.register(ParticipantFilterNode, participant_filter_node_data);
