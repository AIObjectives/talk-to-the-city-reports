report_v1 節點簡單地使提取數據可供其餘的使用者介面使用。請注意，合併/翻譯數據被緩存到 GCS 中，並且此節點首先被加載，以優化報告的加載速度。

輸入屬性：
csv
此輸入屬性接受原始 CSV 數據，用於生成報告。

merge
合併數據，即包含主題、子主題和主張。

translations
一個物件，以地區代碼為鍵，翻譯後的合併數據為值。

輸出屬性：
csv
用於生成報告的原始 CSV 數據。

merge
合併數據，即包含主題、子主題和主張。
