# 節點文件

節點使用 GPT4 來翻譯 CSV 欄位至目標語言。可以指定多個欄位。

## 儲存

結果的 JSON 文件會被儲存在 Google Cloud Storage 桶中。當節點首次運行時，桶會自動創建。文件會被保存在 `uploads/{user-id}/{report-path}`。當節點或報告被刪除時，文件會自動被刪除。