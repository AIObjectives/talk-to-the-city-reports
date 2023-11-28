let translate = `
# translate_v0 node documentation

The translate node translates CSV columns using GPT4, to the target language. Multiple columns can be specified.

## Storage

The resulting JSON document is stored in a Google Cloud Storage bucket. The bucket is automatically created when the node is first run. The file is saved in @@uploads/{user-id}/{report-path}@@. The file is automatically deleted when the node or report are deleted.
`;

translate = translate.replace(/@@(.*?)@@/g, '`$1`');
translate = translate.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default translate;
