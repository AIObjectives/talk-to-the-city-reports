# tttc-turbo 文件說明

Talk to the City Turbo 是一款應用程式，它使使用者能夠將他們透過訪談、調查、論壇、即時通訊頻道等方式獲取的數據轉換成被歸類到主題和子主題的原子「主張」，並以報告的形式展現。

這些報告允許讀者以結構化且視覺上吸引人的方式瀏覽收集到的資訊。

因此，大致上有三種類型的使用者：

- 匿名觀眾
- 報告者
- AI 流程工程師

## 匿名觀眾

匿名觀眾是指任何擁有現代支援 JavaScript 的瀏覽器的互聯網使用者。這些使用者可以看到主題和子主題的圖形、左側欄，以及內容（即被歸類的主張）。

![anon](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-19-19-18-47.jpeg)

## 報告者

報告者是收集數據、以 CSV 格式上傳數據、提供他們的 OpenAI API 金鑰，並點擊「建立報告」的使用者。

![report](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-03-10-33.jpeg)

假設報告者是非技術性的。因此，他們相關的電腦技能應該假設為不超過以下能力：

- 使用 Google 帳戶登入
- 使用正確的模板創建新報告
- 上傳 CSV
- 可選：修改提示
- 點擊「建立報告」按鈕。

## AI 管線工程師

tttc-turbo 的使用者介面和使用者體驗旨在明確區分匿名使用者和報導者的體驗，與管線工程師的“後端”體驗，後者是隱藏起來的。

請注意，以下的[AI 管線工程指南 #1](/docs/ai-pipe-guide)並非針對匿名使用者或報導者，而是針對有興趣從頭開始構建管線的開發人員和工程師。

以下是一些更深入探討管線建置各個方面的進階文章：

- [基於圖形的機器學習應用的非預期效果](/docs/ai-pipe-guide/unintended-effects)
- [Whisper](/docs/whisper)
