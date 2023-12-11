import CryptoJS from 'crypto-js';
import merged_clusters from '$lib/mock_data/cluster_extraction/merged_cluster_extraction.json';

type Message = {
	role: 'system' | 'user';
	content: string;
};

type CompletionRequest = {
	messages: Message[];
	model: string;
	temperature: number;
};

type CompletionResponse = {
	choices: { message: { content: string } }[];
};

export default class OpenAI {
	apiKey: string;
	dangerouslyAllowBrowser: boolean;
	chat: {
		completions: {
			create: (request: CompletionRequest) => Promise<CompletionResponse>;
		};
	};

	constructor({
		apiKey,
		dangerouslyAllowBrowser
	}: {
		apiKey: string;
		dangerouslyAllowBrowser: boolean;
	}) {
		this.apiKey = apiKey;
		this.dangerouslyAllowBrowser = dangerouslyAllowBrowser;
		this.chat = {
			completions: {
				create: this.createCompletion.bind(this)
			}
		};
	}

	async createCompletion({
		messages,
		model,
		temperature
	}: CompletionRequest): Promise<CompletionResponse> {
		const responses = {
			'809b22fd4e501625a223249f71bdc0d0fbf813b22fd86747a6f8f93f620878ec': {
				claims: [
					{
						claim: 'The rain in the city is persistent.',
						quote: 'When will the rain stop.',
						topicName: 'Weather Patterns',
						subtopicName: 'Rain Duration'
					}
				]
			},
			'977c58066de14556ef281ccd17a1da1e34cbde1ef324ad83641ebc7312a40677': {
				claims: [
					{
						claim: 'The weather is currently pleasant in the city.',
						quote: 'The weather is indeed pleasant today',
						topicName: 'Current Conditions',
						subtopicName: 'Pleasant Weather'
					}
				]
			},
			fe1f30e4f5c78ec13d3e562fee66a76ac5fc73abffe458ce633ac6748d5641ed: {
				topics: [
					{
						topicName: 'Current Conditions',
						topicShortDescription: 'Describes the present state of the weather.',
						subtopics: [
							{
								subtopicName: 'Pleasant Weather',
								subtopicShortDescription:
									'References to the weather being enjoyable or comfortable at the moment.'
							}
						]
					},
					{
						topicName: 'Weather Patterns',
						topicShortDescription: 'Discusses the trends and changes in weather over time.',
						subtopics: [
							{
								subtopicName: 'Rain Duration',
								subtopicShortDescription:
									'Concerns about the length of time the rain is expected to last.'
							}
						]
					}
				]
			},
			ab2c974812cfbc6ffe18d755100b22f063794b5e4f41f2c4cfa27c075c5e6823: merged_clusters,
			'80e0e107ae12a48f2f643f6e9ea0bd78ca2afd6161d89f39043f80db3413d94d': {
				score: 0.5,
				explanation: 'This is a test explanation.'
			}
		};
		const hash = CryptoJS.SHA256(JSON.stringify(messages)).toString();
		let resp = '{}';
		if (responses[hash]) {
			resp = JSON.stringify(responses[hash]);
		}
		const mockResponse: CompletionResponse = {
			choices: [{ message: { content: resp } }]
		};

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(mockResponse);
			}, 100);
		});
	}
}
