CSV 節點被用作群集和論點提取的主要輸入。您可以在[google 表格](https://docs.google.com/spreadsheets/d/1k8L1M9Ptxz_fBlZlGe0f-X4wCRIfmmRrISLy3c5EqUk/edit#gid=0)上找到一個範例 CSV（如果您打算使用範例 google 表格，請確保點擊檔案 > 下載 > .csv）。

`comment-id`：來自此來源的完整意見或評論
`comment-body`：評論的正文

可選的 'interview' 欄位可以用來標記每行數據的來源，例如一個人的名字或訪談標題。

對於沒有視頻內容的數據集，應將可選的 'video' 和 'timestamp' 欄位留空。

可選列：

`interview`：評論來自的訪談（理想情況下是一個人的名字）
`video`：評論從中提取的視頻，目前僅支持 vimeo 鏈接
`timestamp`：視頻中評論的時間戳，格式為 hh:mm:ss

視頻列應該包含以下格式的連結：

`https://www.youtube.com/embed/<video_id>`

或者

`https://vimeo.com/<video_id>`
