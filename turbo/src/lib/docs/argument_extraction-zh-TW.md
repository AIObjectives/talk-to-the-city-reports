argument_extraction_v0 節點用於從 CSV 檔案中提取論點。它會針對每條評論調用一次 OpenAI 的 `gpt-4-1106-preview`，並結合主題和子主題，嘗試提取符合這些主題/子主題的主張。
