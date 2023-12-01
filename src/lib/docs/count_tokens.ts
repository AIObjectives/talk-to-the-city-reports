let count_tokens = `
# count_tokens_v0 node documentation

This node takes CSV data as input, and counts the aggregate number of tokens in the @@comment-body@@ columnt.

Supported models are:

- gpt2
- r50k_base
- p50k_base
- p50k_edit
- cl100k_base
`;

count_tokens = count_tokens.replace(/@@(.*?)@@/g, '`$1`');
count_tokens = count_tokens.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default count_tokens;
