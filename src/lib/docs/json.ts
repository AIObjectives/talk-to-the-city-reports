let json = `
# json_v0 node documentation

Loads a @@.json@@ file.

`;

json = json.replace(/@@(.*?)@@/g, '`$1`');
json = json.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default json;
