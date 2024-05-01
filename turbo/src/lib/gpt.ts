import CryptoJS from 'crypto-js';
import workerpool from 'workerpool';
import mock_responses from '$lib/mock_data/gpt_responses';
import { format, unwrapFunctionStore } from 'svelte-i18n';
import _ from 'lodash';

const $__ = unwrapFunctionStore(format);

const pool = workerpool.pool({ maxWorkers: 50 });

export async function openai(
  apiKey: string,
  messages: Record<string, string>[],
  vitest: string,
  hash: string,
  mock_data: any,
  response_format: Record<string, string> = { type: 'json_object' },
  tools: any = null
) {
  // Remember: this function is executed in a worker thread.
  // It cannot access the DOM or any variables in the main thread.

  const MAX_RETRIES = 5;
  const TIMEOUT_DURATION = 5 * 60 * 1000;

  function isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
      return false;
    }
    let proto = Object.getPrototypeOf(value);
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
    let timeoutId;
    let didTimeout = false;
    try {
      const fetchPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          didTimeout = true;
          reject(new Error('OpenAI request timed out'));
        }, TIMEOUT_DURATION);

        const proceedWithFetch = async () => {
          let response;
          if (vitest == 'true') {
            if (Math.random() < 0.1) {
              reject(new Error('`HTTP error! status: 500'));
            } else {
              clearTimeout(timeoutId);
              if (mock_data[hash]) {
                if (response_format?.type == 'json_object')
                  resolve(JSON.stringify(mock_data[hash]));
                else resolve(mock_data[hash]);
              } else {
                reject(new Error('Mock data is missing'));
              }
            }
          } else {
            const body = {
              model: 'gpt-4-1106-preview',
              messages: messages,
              temperature: 0.1
            };
            if (Array.isArray(tools) && tools.length > 0) {
              // @ts-ignore
              body.tools = tools;
            }
            if (isPlainObject(response_format)) {
              // @ts-ignore
              body.response_format = response_format;
            }
            console.log(JSON.stringify(body));
            response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
              },
              body: JSON.stringify(body)
            });

            clearTimeout(timeoutId);
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error text:', errorText);
              reject(new Error(`HTTP error! status: ${response.status} with text: ${errorText}`));
            } else {
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                const mes = data.choices[0].message;
                if (mes.tool_calls) {
                  resolve(mes.tool_calls);
                  return;
                }
                let resp = mes.content;
                if (resp?.startsWith('```json')) {
                  const start = resp.indexOf('```json') + 7;
                  const end = resp.lastIndexOf('```');
                  resp = resp.substring(start, end).trim();
                }
                resolve(resp);
              } else {
                const rawData = await response.text();
                console.warn('Response received is not in JSON format:', rawData);
                reject(new Error(`content type error`));
              }
            }
          }
        };
        proceedWithFetch().catch(reject);
      });

      return await fetchPromise;
    } catch (error) {
      clearTimeout(timeoutId);
      if (
        (didTimeout || error.message.includes('429') || error.message.includes('500')) &&
        retryCount < MAX_RETRIES
      ) {
        retryCount++;
        console.log(`Retrying OpenAI request (${retryCount}/${MAX_RETRIES})...`);
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
      arg_prompt = arg_prompt.replace(`{${key}}`, value as string);
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
    info(`${$__('calling_openai')}. ${$__('calls_left')}: ${todo.size}`, messages);
    const result = await pool.exec(openai, [
      apiKey,
      messages,
      import.meta.env.VITEST,
      hash,
      mock_responses,
      response_format
    ]);
    info(`${$__('called_openai')}. ${$__('calls_left')}: ${todo.size}`, result);
    console.log(result);
    todo.delete(i);
    return result;
  } catch (e) {
    console.error(e);
    error(`${$__('error_calling_openai')} ${i + 1}/${total}`, e);
    return 'ERROR';
  }
}
