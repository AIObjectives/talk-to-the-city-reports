let report = `
# report_v0 node documentation

The report node simply makes the extraction data available to the rest of the user interface.
`;

report = report.replace(/@@(.*?)@@/g, '`$1`');
report = report.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default report;
