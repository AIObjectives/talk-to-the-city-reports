let markdown = `
# markdown_v0 node documentation

The markdown node simply renders the input text as markdown. It also accepts markdown as in input from other downs.
`;

markdown = markdown.replace(/@@(.*?)@@/g, '`$1`');
markdown = markdown.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default markdown;
