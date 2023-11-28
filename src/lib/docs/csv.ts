let csv = `
# csv_v0 node documentation

The CSV node is used as the primary input for cluster and argument extraction. It is, in fact, a regular CSV file which does not require any special formatting, since the CSV data can be reformatted further down the pipeline.

**However** for a straight forward use case, the CSV file should have the following columns:

@@comment-id@@: a unique identifier for each comment  
@@comment-body@@: the body of the comment 

Optional columns:

@@interview@@: the interview (ideally a person's name) the comment was taken from  
@@video@@: the video the comment was extracted from, currently only vimeo links are supported  
@@timestamp@@: the timestamp of the comment in the video, in the format hh:mm:ss  

## Storage

The CSV node stores the CSV file in a Google Cloud Storage bucket. The bucket is automatically created when the node is first run. The file is saved in @@uploads/{user-id}/{report-path}@@. The file is automatically deleted when the node or report are deleted.
`;

csv = csv.replace(/@@(.*?)@@/g, '`$1`');
csv = csv.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default csv;
