let limit_csv = `
# limit_csv_v0 node documentation

The default value of 2 limits the pipeline processing to the first two comments in the CSV file.

The limit_csv node is useful when first starting to work on a report, as it allows you to limit the number of comments that are processed, and thus the amount of time it takes to run the pipeline.
`;

limit_csv = limit_csv.replace(/@@(.*?)@@/g, '`$1`');
limit_csv = limit_csv.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default limit_csv;
