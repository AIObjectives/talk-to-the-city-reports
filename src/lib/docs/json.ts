let json = `
# json_v0 node documentation

Loads a @@.json@@ file.

## Storage

The JSON node stores the JSON file in a Google Cloud Storage bucket. The bucket is automatically created when the node is first run. The file is saved in @@uploads/{user-id}/{report-path}@@. The file is automatically deleted when the node or report are deleted.
`;

json = json.replace(/@@(.*?)@@/g, '`$1`');
json = json.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default json;
