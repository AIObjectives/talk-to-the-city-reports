let doc = `
# jq_v0 node documentation

This node simply runs a jq expression on its input, and outputs the result.
`;

doc = doc.replace(/@@(.*?)@@/g, '`$1`');
doc = doc.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default doc;
