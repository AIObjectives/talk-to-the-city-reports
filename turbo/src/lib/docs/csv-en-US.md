The CSV node is used as the primary input for cluster and argument extraction. A sample CSV can be found on [google sheets](https://docs.google.com/spreadsheets/d/1k8L1M9Ptxz_fBlZlGe0f-X4wCRIfmmRrISLy3c5EqUk/edit#gid=0) (if you intend on using the sample google sheet, make sure you click on File > Download > .csv).

`comment-id`: the full opinion or comment from this source
`comment-body`: the body of the comment

The optional 'interview' field can be used to label the source of the data in each row, such as a person's name or an interview title.

The optional 'video' and 'timestamp' fields should be left blank for datasets without video content.

Optional columns:

`interview`: the interview (ideally a person's name) the comment was taken from  
`video`: the video the comment was extracted from, currently only vimeo links are supported  
`timestamp`: the timestamp of the comment in the video, in the format hh:mm:ss

The `video` column should contain links in the form:

`https://www.youtube.com/embed/<video_id>`

or

`https://vimeo.com/<video_id>`
