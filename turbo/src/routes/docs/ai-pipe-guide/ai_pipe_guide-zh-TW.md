## 導論

---

在這份 _AI 管線工程指南 #1_ 中，我們將涵蓋使用 _tttc-turbo_ 建立 AI 管線的一些基礎知識，並提供 CSV 收集和報告叢集提取的逐步指南。

這些指南的目標讀者是：

1. 軟體的高級使用者 / 技術傾向的使用者。
2. AI / ML 實踐者和研究人員。
3. 軟體開發者 / 工程師
4. 各種管線工程師和架構師。

通過這些指南，您可以成為以下方面的首選工程師：

- 創建您自己設計的新報告
- 在反饋回合後修改/增強現有報告。
- 發布可供記者使用的報告模板。

請注意，本指南不需要任何編碼經驗或專業知識。

## 以積木為基礎的 AI 流水線工程

讓我們嘗試一個首次的類比，以便在這些指南中和以後記住：將 tttc-turbo 想象為一套積木。您在屏幕上看到的每一樣東西都是積木套裝中的一塊。

這些積木可以像文本框或 Markdown 文件、CSV 或 JSON 檔案一樣簡單；像數據整理節點一樣平凡；或者像 AI 和 LLM 塊一樣強大！

這還引入了一個有用的框架，在這個框架中，可以通過簡單地創建新的積木，或現有積木的新版本，來添加新功能，具有以下明顯優勢：

- 積木作為實體。
- 新的積木和積木版本不會干擾現有的流水線。
- 封裝。
- 以測試驅動的「積木」開發。
- 積木的可重用性。
- 積木的模塊化。
- 升級路徑，用於將現有積木升級到它們的新版本。
- 等等。

## 推薦設置

強烈推薦使用雙屏幕設置。

- 一個屏幕用於指南。
- 第二個屏幕用於操作 tttc-turbo。

## 初始報告創建

- 在您的第二個 '操作' 屏幕上：
  - 導航至[首頁](https://tttc-turbo.web.app)。
  - 登入。
  - 根據空白模板創建一個新報告。

![創建](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-00-38-36.jpeg)

N.B 您建議保持簡稱（url）使用拉丁字母，因為某些瀏覽器對於擴展的 Unicode URL 有問題。

## 標準視圖

---

在建立一個新的空白報告後，您可以進入您偏好的視圖。預設情況下是*標準視圖*。標準視圖被記者用來上傳他們的 CSV 並運行您為他們創建的流程。

![empty](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-20-08-24.jpeg)

我們稍後會回到標準視圖，之後我們創建了 UI 組件。

- 在右上角的菜單中，點擊「圖表視圖」。

## 圖表視圖

在「圖表視圖」中，UI 組件被稱為「節點」。我們還沒有創建任何節點，但即將開始！

![graph view](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-20-16-55.jpeg)

在圖表視圖的左上角：

- 點擊輸入
- 將一個「CSV」拖動到圖表視圖的中心。
- 點擊屏幕右上角的「儲存」圖標（記得經常這麼做）。

![CSV](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-20-55-13.jpeg)

- 注意您可以：
  - 使用滑鼠滾輪或觸控板放大和縮小
  - 通過點擊拖動背景來平移
  - 通過點擊它來選擇節點
  - 通過點擊背景來取消選擇節點
  - 通過點擊拖動來移動節點
  - 按住鍵盤上的 shift 鍵，並點擊拖動以選擇多個節點
- 點擊問號以顯示幫助框。

![help](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-20-56-33.jpeg)

- 再次點擊幫助以關閉節點的幫助框。
- 在您的設備上創建一個名為「sample.csv」的文件
- 將以下內容粘貼到文件中：

```
interview,comment-body,comment-id
Alice,The weather is indeed pleasant today,0
Bob,When will the rain stop,28
```

- 在「CSV」節點中點擊「上傳」按鈕，並上傳 `sample.csv`。
- 從顯示菜單中，將一個「格網」節點拖到「CSV」節點下方。
- 連接「CSV」節點底部的把手。
- 在屏幕右上角點擊機器人圖標（建立報告）。

![csv grid](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-21-21-57.jpeg)

「格網」節點非常方便，因為它使我們能夠查看數據隨著我們的流程向下流動。在 AI 流程創建過程中，應該廣泛使用它來清晰我們的數據。

- 點擊格網中的鉛筆圖標。

![grid json](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-21-23-31.jpeg)

格網節點使我們能夠以 JSON 格式查看我們的數據。有時候，一個流程可以很簡單，就是上傳一個 CSV，進行一些轉換，從格網中複製結果文檔，然後刪除報告。事實上，這種短暫的工作流程是非常推薦的，因為最終產品不是流程本身，而是它產生的數據。

- 從 LLM 菜單中拖入一個「OpenAI 金鑰」節點。
- 從 LLM 菜單中拖入一個「叢集提取」節點。
- 右鍵點擊連接「CSV」和「格網」節點的邊界，然後點擊「刪除邊界」。

![csv key cluster grid](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-21-30-37.jpeg)

- 在「OpenAI 金鑰」節點中粘貼您的 OpenAI API 金鑰。

我們現在準備連接我們的建築塊。

### 連接節點

- 將「OpenAI 金鑰」節點的下方把手連接到「叢集提取」節點的上方把手。
- 將 CSV 節點的下方把手連接到「叢集提取」節點的上方把手。
- 注意「叢集提取」節點右上角的橙色「未連接」圖標。
- 在叢集提取節點上點擊右鍵
  - 在「OpenAI 金鑰」下拉選單中選擇 `open_ai_key_1`。
  - 在 'csv' 下拉選單中選擇 `csv_1`。
- 點擊圖表背景以關閉上下文選單。
- 注意「未連接」圖標現已消失。
- 將「叢集提取」節點的下方把手連接到「格網」節點的上方把手。
- 重新組織您的節點，使它們流暢地連接。

![準備運行](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-21-39-05.jpeg)

- 點擊右上角的「建立報告」（機器人）圖標。

經過一段時間，叢集已被提取。

![叢集提取](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-21-45-44.jpeg)

注意我們的叢集包含「主題」和「子主題」以及簡短的描述。

- 通過在其上點擊右鍵來刪除「格網」節點。
- 從 LLM 選單中：
  - 拖動一個「論點提取」節點。
- 從資料處理選單中：
  - 拖動一個「合併」節點
- 從顯示選單中：
  - 拖動一個「報告 v0」節點

![論點提取](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-21-51-32.jpeg)

- 將以下節點連接到「論點提取」節點：
  - 「CSV」
  - 「OpenAI 金鑰」
  - 「叢集提取」
- 在「論點提取」節點上點擊右鍵，並且：
  - 在 `open_ai_key` 下點擊 `open_ai_key_1`。
  - 在 `csv` 下點擊 `csv_1`。
  - 在 `cluster_extraction` 下點擊 `cluster_extraction_1`。

![論點提取連接](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-22-00-00.jpeg)

- 將以下連接到「合併」節點：
  - 「叢集提取」
  - 「論點提取」
- 在「論點提取」節點上點擊右鍵，並且：
  - 在 `cluster_extraction` 下點擊 `cluster_extraction_1`
  - 在 `argument_extraction` 下點擊 `argument_extraction_1`

![連接合併](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-22-04-23.jpeg)

- 將「合併」節點連接到「報告 v0」節點。

![基本流程](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-22-06-28.jpeg)

- 點擊「建立報告」（機器人）按鈕。
- 在右上角選單點擊「標準視圖」。
- 向下滾動。

![完成](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-00-44-09.jpeg)

您的基本 Talk to the City Turbo 流程現已完成。

如果您想要在標準視圖中隱藏某些節點：

- 轉到圖表視圖。
- 在您想要隱藏的節點上點擊右鍵。
- 取消勾選「以標準視圖顯示」複選框。
- 點擊「儲存」。

嘗試在隱私窗口中打開您的報告，以查看未登入的觀眾會如何看到它。

### 讀者練習：

- 建立一個「格網」節點，並將一個節點的下方把手連接到它。
  - 點擊「建立報告」（機器人圖標）。
  - 研究格網中的數據，以及格網節點的 JSON 模式。
  - 重複其他節點的操作。
