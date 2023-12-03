let jsonata = `
# jsonata_v0 node documentation

This node simply runs a jsonata expression on its input, and outputs the result.
`;

jsonata = jsonata.replace(/@@(.*?)@@/g, '`$1`');
jsonata = jsonata.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default jsonata;
