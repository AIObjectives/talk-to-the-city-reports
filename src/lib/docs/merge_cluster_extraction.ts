let merge_cluster_extraction = `
# merge_cluster_extraction_v0 node documentation

The merge_cluster_extraction_v0 node uses an LLM to merge multiple cluster_extraction nodes.

`;

merge_cluster_extraction = merge_cluster_extraction.replace(/@@(.*?)@@/g, '`$1`');
merge_cluster_extraction = merge_cluster_extraction.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default merge_cluster_extraction;
