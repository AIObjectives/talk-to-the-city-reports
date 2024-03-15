翻譯節點可將 JSON 文件翻譯成多種目標語言，並具有以下設定：

## 輸入屬性：

- input_language

被傳入的 JSON 文件的語言。

- target_languages

文件被翻譯成的語言。

- language_selector

用作`translation`輸出屬性輸出的語言。

## 輸出屬性：

- translation

此屬性將輸出由`language_selector`輸入屬性定義的語言，或者如果沒有指定`language_selector`，則輸出在`translations`物件中找到的第一種語言。

- translations

此屬性輸出一個包含所有語言的物件（以語言代碼為鍵，翻譯物件為值）。

## 存儲

生成的 JSON 文件存儲在 Google 雲端儲存桶中。節點首次運行時會自動創建該儲存桶。文件保存在`uploads/{user-id}/{report-path}`中。當節點或報告被刪除時，文件會自動刪除。
