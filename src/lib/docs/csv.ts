let csv = `
# csv_v0 node documentation

The CSV node is used as the primary input for cluster and argument extraction. A sample CSV can be found on [google sheets](https://docs.google.com/spreadsheets/d/1k8L1M9Ptxz_fBlZlGe0f-X4wCRIfmmRrISLy3c5EqUk/edit#gid=0) (if you intend on using the sample google sheet, make sure you click on File > Download > .csv).

@@comment-id@@: a unique identifier for each comment  
@@comment-body@@: the body of the comment 

Optional columns:

@@interview@@: the interview (ideally a person's name) the comment was taken from  
@@video@@: the video the comment was extracted from, currently only vimeo links are supported  
@@timestamp@@: the timestamp of the comment in the video, in the format hh:mm:ss  
`;

csv = csv.replace(/@@(.*?)@@/g, '`$1`');
csv = csv.replace(/(.+)(\n|$)/g, '$1<br>\n');

export default csv;
