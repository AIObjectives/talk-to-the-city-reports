CSV 節點作為群集和論點提取的主要輸入。可以在 [Google 表格](https://docs.google.com/spreadsheets/d/1k8L1M9Ptxz_fBlZlGe0f-X4wCRIfmmRrISLy3c5EqUk/edit#gid=0) 中找到樣本 CSV（如果您打算使用樣本 Google 表格，請確保點擊 文件 > 下載 > .csv）。

`comment-id`：來自此來源的完整意見或評論
`comment-body`：評論的正文

可選的 'interview' 欄位可用於標記每行數據的來源，如一個人的名字或訪談標題。

對於沒有視頻內容的數據集，應將 'video' 和 'timestamp' 欄位留空。

可選列：

`interview`：評論來自的訪談（理想情況下是一個人的名字）
`video`：評論從中提取的視頻，目前僅支持 Vimeo 連結
`timestamp`：視頻中評論的時間戳，格式為 hh:mm:ss
