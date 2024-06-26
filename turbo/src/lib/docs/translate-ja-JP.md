translate ノードは JSON ドキュメントを複数のターゲット言語に翻訳し、以下の設定を取ります。

## 入力属性:

- input_language

渡される JSON ドキュメントの言語。

- target_languages

ドキュメントが翻訳される言語。

- language_selector

`translation`出力属性に使用される言語。

## 出力属性:

- translation

この属性は`language_selector`入力属性で定義された言語、または（`language_selector`が指定されていない場合）`translations`オブジェクトで最初に見つかった言語を出力します。

- translations

この属性はすべての言語をオブジェクトとして出力します（言語コードをキー、翻訳オブジェクトを値として）。

## ストレージ

生成された JSON ドキュメントは Google Cloud Storage バケットに保存されます。バケットはノードが初めて実行されたときに自動的に作成されます。ファイルは`uploads/{user-id}/{report-path}`に保存され、ノードまたはレポートが削除されると自動的に削除されます。
