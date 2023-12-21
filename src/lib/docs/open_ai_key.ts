let open_ai_key = `
# open_ai_key_v0 node documentation

The open_ai_key node is used to set the OpenAI API key for the report. The API key is used to access the OpenAI API, which is used for translation, cluster and argument extraction etc.

## Storage

For security reasons, API keys are stored locally, and accessible to you only.

`;

open_ai_key = open_ai_key.replace(/@@(.*?)@@/g, '`$1`');
open_ai_key = open_ai_key.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default open_ai_key;
