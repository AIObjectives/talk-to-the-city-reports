# csv_v0 節點文件

CSV 節點作為群集和論點提取的主要輸入使用。您可以在 [google 表格](https://docs.google.com/spreadsheets/d/1k8L1M9Ptxz_fBlZlGe0f-X4wCRIfmmRrISLy3c5EqUk/edit#gid=0) 上找到一個範例 CSV（如果您打算使用範例 google 表格，請確保點擊 文件 > 下載 > .csv）。

`comment-id`：每條評論的唯一標識符  
`comment-body`：評論的內容

可選列：

`interview`：評論來自的訪談（理想情況下是一個人的名字）  
`video`：評論被提取自的影片，目前僅支持 vimeo 鏈接  
`timestamp`：影片中評論的時間戳，格式為 hh:mm:ss