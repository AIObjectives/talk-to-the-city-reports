let cluster_extraction = `
# cluster_extraction_v0 node documentation

The cluster_extraction_v0 node is used to extract clusters from a CSV file. It makes one call to OpenAI's @@gpt-4-1106-preview@@ model with all the comments in the CSV file.

## Storage

The resulting JSON document is stored in a Google Cloud Storage bucket. The bucket is automatically created when the node is first run. The file is saved in @@uploads/{user-id}/{report-path}@@. The file is automatically deleted when the node or report are deleted.
`;

cluster_extraction = cluster_extraction.replace(/@@(.*?)@@/g, '`$1`');
cluster_extraction = cluster_extraction.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default cluster_extraction;
