let open_ai_key = `
# open_ai_key_v0 node documentation

The open_ai_key node is used to set the OpenAI API key for the report. The API key is used to access the OpenAI API, which is used for translation, cluster and argument extraction etc.

## Storage

For security reasons, the API key is neither stored in Firestore, nor in Google Cloud Storage. Instead it is stored in your cookies, and is only accessible to you.

You will need to re-enter it each time you create a new report. After entering it, the UI will still only display @@sk-...@@.

`;

open_ai_key = open_ai_key.replace(/@@(.*?)@@/g, '`$1`');
open_ai_key = open_ai_key.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default open_ai_key;
