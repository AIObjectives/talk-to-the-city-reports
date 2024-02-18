argument_extraction 節點用於從 CSV 檔案中提取論點。它對每條評論調用一次 OpenAI 的 `gpt-4-1106-preview`，並提供主題和子主題，試圖提取適合這些主題/子主題的主張。

v0 節點，其在提示中包含了 JSON 格式，正逐漸被淘汰，以便轉向使用 v1 節點。
