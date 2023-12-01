let merge_cluster_extraction = `
# merge_cluster_extraction_v0 node documentation

The merge_cluster_extraction_v0 node uses an LLM to merge multiple cluster_extraction nodes.

## Storage

The resulting JSON document is stored in a Google Cloud Storage bucket. The bucket is automatically created when the node is first run. The file is saved in @@uploads/{user-id}/{report-path}@@. The file is automatically deleted when the node or report are deleted.
`;

merge_cluster_extraction = merge_cluster_extraction.replace(/@@(.*?)@@/g, '`$1`');
merge_cluster_extraction = merge_cluster_extraction.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default merge_cluster_extraction;
