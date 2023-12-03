let stringify = `
# stringify_v0 node documentation

This node simply turns the input data into a string and returns it.
`;

stringify = stringify.replace(/@@(.*?)@@/g, '`$1`');
stringify = stringify.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default stringify;
