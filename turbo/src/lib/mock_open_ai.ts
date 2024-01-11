import CryptoJS from 'crypto-js';
import merged_clusters from '$lib/mock_data/cluster_extraction/merged_cluster_extraction.json';
import sample from '$lib/mock_data/speech_to_text/sample.json';
import responses from '$lib/mock_data/gpt_responses';

type Message = {
	role: 'system' | 'user';
	content: string;
};

type CompletionRequest = {
	messages: Message[];
	model: string;
	temperature: number;
};

type TranscriptionRequest = {
	file: any;
	model: string;
	response_format: 'verbose_json' | 'json' | 'text' | 'srt' | 'vtt' | undefined;
	prompt: string;
	temperature: number;
	language: string;
};

type CompletionResponse = {
	choices: { message: { content: string } }[];
};

type TranscriptionResponse = {
	task: string;
	language: string;
	duration: number;
	text: string;
	segments: {
		id: number;
		seek: number;
		start: number;
		end: number;
		text: string;
		tokens: number[];
		temperature: number;
		avg_logprob: number;
		compression_ratio: number;
		no_speech_prob: number;
	}[];
};

export default class OpenAI {
	apiKey: string;
	dangerouslyAllowBrowser: boolean;
	chat: {
		completions: {
			create: (request: CompletionRequest) => Promise<CompletionResponse>;
		};
	};
	audio: {
		transcriptions: {
			create: (request: TranscriptionRequest) => Promise<TranscriptionResponse>;
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
		this.audio = {
			transcriptions: {
				create: this.createTranscription.bind(this)
			}
		};
	}

	async createTranscription({
		file,
		model,
		response_format,
		prompt,
		language,
		temperature
	}: TranscriptionRequest): Promise<TranscriptionResponse> {
		return sample;
	}

	async createCompletion({
		messages,
		model,
		temperature
	}: CompletionRequest): Promise<CompletionResponse> {
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
