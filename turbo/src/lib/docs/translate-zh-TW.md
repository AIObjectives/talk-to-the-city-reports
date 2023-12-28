翻譯節點使用 GPT4 將 CSV 欄位翻譯成目標語言。可以指定多個欄位。

## 儲存

生成的 JSON 文件將儲存在 Google Cloud Storage 桶中。當節點首次運行時，將自動創建該桶。文件保存在 `uploads/{user-id}/{report-path}`。當節點或報告被刪除時，文件將自動被刪除。