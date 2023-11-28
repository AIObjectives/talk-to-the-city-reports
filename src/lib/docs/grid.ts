let grid = `
# grid_v0 node documentation

The grid node is used to display the contents of a CSV file.
`;

grid = grid.replace(/@@(.*?)@@/g, '`$1`');
grid = grid.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default grid;
