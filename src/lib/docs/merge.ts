let merge = `
# merge_v0 node documentation

The merge node merges the results from the cluster_extraction_v0 and argument_extraction_v0 nodes.
`;

merge = merge.replace(/@@(.*?)@@/g, '`$1`');
merge = merge.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default merge;
