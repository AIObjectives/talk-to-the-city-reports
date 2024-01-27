import CryptoJS from 'crypto-js';
import workerpool from 'workerpool';
import mock_responses from '$lib/mock_data/gpt_responses';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import _ from 'lodash';

const $__ = unwrapFunctionStore(format);

let pool = workerpool.pool({ maxWorkers: 50 });

export async function openai(
	apiKey: string,
	messages: [],
	vitest: string,
	hash: string,
	mock_data: any,
	response_format = { type: 'json_object' }
) {
	// Remember: this function is executed in a worker thread.
	// It cannot access the DOM or any variables in the main thread.

	const MAX_RETRIES = 5;
	const BASE_DELAY = 500;
	const MAX_DELAY = 10000;

	function isPlainObject(value) {
		if (Object.prototype.toString.call(value) !== '[object Object]') {
			return false;
		}
		var proto = Object.getPrototypeOf(value);
		if (proto === null) {
			return true;
		}
		while (Object.getPrototypeOf(proto) !== null) {
			proto = Object.getPrototypeOf(proto);
		}
		return Object.getPrototypeOf(value) === proto;
	}

	let retryCount = 0;
	while (retryCount <= MAX_RETRIES) {
		try {
			let response;
			if (vitest == 'true') {
				if (Math.random() < 0.1) {
					throw new Error('`HTTP error! status: 500');
				} else {
					if (mock_data[hash]) {
						if (response_format?.type == 'json_object') return JSON.stringify(mock_data[hash]);
						else return mock_data[hash];
					} else {
						throw new Error('Mock data is missing');
					}
				}
			}
			const body = {
				model: 'gpt-4-1106-preview',
				messages: messages,
				temperature: 0.1
			};
			if (isPlainObject(response_format)) {
				body.response_format = response_format;
			}
			// console.log(JSON.stringify(body));
			response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`
				},
				body: JSON.stringify(body)
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			let resp = data.choices[0].message.content;
			if (resp.startsWith('```json')) {
				const start = resp.indexOf('```json') + 7;
				const end = resp.lastIndexOf('```');
				resp = resp.substring(start, end).trim();
			}
			return resp;
		} catch (error) {
			if (error.message.includes('429') || error.message.includes('500')) {
				retryCount++;
				const delay = Math.min(MAX_DELAY, BASE_DELAY * 2 ** retryCount);
				const jitter = Math.random() * delay * 0.2;
				await new Promise((resolve) => setTimeout(resolve, delay + jitter));
			} else {
				throw error;
			}
		}
	}
	throw new Error('Max retries exceeded');
}

export default async function gpt(
	apiKey: string,
	replacements: {},
	prompt: string,
	system_prompt: string,
	info,
	error,
	success,
	i,
	total,
	todo,
	response_format = { type: 'json_object' }
) {
	let arg_prompt = prompt;
	if (!_.isEmpty(replacements))
		for (const [key, value] of Object.entries(replacements)) {
			arg_prompt = arg_prompt.replace(`{${key}}`, value);
		}
	const messages = [
		{ role: 'system', content: system_prompt },
		{ role: 'user', content: arg_prompt }
	];
	const stringified = JSON.stringify(messages);
	const hash = CryptoJS.SHA256(stringified).toString();
	// needed for mocks:
	// console.log(hash);
	try {
		const result = await pool.exec(openai, [
			apiKey,
			messages,
			import.meta.env.VITEST,
			hash,
			mock_responses,
			response_format
		]);
		todo.delete(i);
		info(`${$__('done_calling_openai')}. ${$__('calls_left')}: ${todo.size}`);
		return result;
	} catch (e) {
		console.error(e);
		error(`${$__('error_calling_openai')} ${i + 1}/${total} {error.message}`);
		return 'ERROR';
	}
}
