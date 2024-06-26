# AI パイプラインエンジニアリングガイド #1

## はじめに

---

この _AI パイプラインエンジニアリングガイド #1_ では、_tttc-turbo_ を使用した AI パイプラインの構築の基礎を説明し、CSV 取り込みとレポートクラスター抽出のステップバイステップガイドを提供します。

このガイドの対象読者は以下の通りです：

1. ソフトウェアの上級ユーザー / 技術的な知識のあるユーザー
2. AI / ML の実践者および研究者
3. ソフトウェア開発者 / エンジニア
4. あらゆる種類のパイプラインエンジニアおよびアーキテクト

これらのガイドを通じて、以下の分野において高度な技術を身につけることができます：

- 独自の設計による新しいレポートの作成
- フィードバックラウンド後の既存のレポートの修正 / 強化
- レポーターが使用できるテンプレートとしてのレポートの公開

このガイドではコーディング経験や専門知識は必要ありませんのでご注意ください。

## ビルディングブロックセットとしての AI パイプラインエンジニアリング

これらのガイドを通して覚えておくべき最初のアナロジーを試みましょう：tttc-turbo をビルディングブロックセットと考えてください。画面上に表示されるものすべてが、ビルディングブロックセットのブロックです。

これらのビルディングブロックは、テキストボックスやマークダウン文書、CSV や JSON ファイルのように単純なもの、データ整形ノードのように平凡なもの、あるいは AI や LLM ブロックのように強力なものもあります！

これは、以下の大きな利点を持つ、新しい機能を単に新しいブロックを作成したり、既存のブロックの新しいバージョンを作成したりするだけで追加できる有用なフレームワークも導入します：

- エンティティとしてのブロック
- 新しいブロックとブロックバージョンは既存のパイプラインを妨げない
- カプセル化
- テスト駆動型の「ブロック」開発
- ブロックの再利用性
- ブロックのモジュール性
- 既存のブロックを新しいバージョンにアップグレードするためのアップグレードパス
- など

## 推奨セットアップ

デュアルスクリーンセットアップを強くお勧めします。

- 1 つの画面でガイドを表示
- 2 つ目の画面で tttc-turbo を操作

## 初期レポートの作成

- 2 つ目の「操作」画面で：
  - [ホーム画面](https://tttc-turbo.web.app)に移動します。
  - サインインします。
  - 空のテンプレートに基づいて新しいレポートを作成します。

![create](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-00-52-40.jpeg)

注意：スラッグ（URL）はラテンアルファベットで保持することをお勧めします。一部のブラウザでは拡張 Unicode URL に問題がある場合があります。

## 標準ビュー

---

新しい空のレポートを作成すると、優先ビューに入ります。デフォルトでは、これは _標準ビュー_ です。標準ビューは、レポーターが CSV をアップロードし、作成したパイプラインを実行するために使用されます。

![empty](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-00-55-25.jpeg)

UI コンポーネントを作成した後で、標準ビューに戻ります。

- 右上のメニューで、「グラフビュー」をクリックします。

## グラフビュー

「グラフビュー」では、UI コンポーネントは「ノード」と呼ばれます。まだ何も作成していませんが、これから作成します！

![graph view](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-00-56-48.jpeg)

グラフビューの左上で：

- 「入力」をクリックします
- 「CSV」をグラフビューの中央にドラッグします。
- 画面右上の「保存」アイコンをクリックします（これを頻繁に行うことを忘れないでください）。

![CSV](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-00-58-01.jpeg)

- 以下のことに注意してください：
  - マウスホイールまたはトラックパッドでズームインとズームアウトができます
  - 背景をクリックドラッグしてパンニングできます
  - クリックしてノードを選択できます
  - 背景をクリックしてノードの選択を解除できます
  - クリックドラッグしてノードを移動できます
  - キーボードの Shift キーを押しながらクリックドラッグすると、複数のノードを選択できます
- クエスチョンマークをクリックしてヘルプボックスを表示します。

![help](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-01-00-33.jpeg)

- ヘルプをもう一度クリックして、ノードのヘルプボックスを閉じます。
- デバイス上に "sample.csv" というファイルを作成します。
- 以下の内容をファイルに貼り付けます：

```
interview,comment-body,comment-id
Alice,The weather is indeed pleasant today,0
Bob,When will the rain stop,28
```

- 「CSV」ノードの「アップロード」ボタンをクリックし、`sample.csv` をアップロードします。
- 表示メニューから、「CSV」ノードの下に「グリッド」ノードをドラッグします。
- 「CSV」ノードの下部ハンドルを接続します。
- 画面右上のロボットアイコン（レポートを生成）をクリックします。

![csv grid](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-01-04-41.jpeg)

「グリッド」ノードは非常に便利で、パイプラインを通じてデータがどのように流れていくかを確認できます。AI パイプライン作成プロセスを進める際に、データの明確性を得るために広範囲に使用すべきです。

- グリッドの鉛筆アイコンをクリックします。

![grid json](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-01-06-34.jpeg)

グリッドノードを使用すると、データを JSON 形式で表示できます。時にはパイプラインは、CSV をアップロードし、いくつかの変換を行い、グリッドから結果の文書をコピーし、レポートを削除するだけの単純なものかもしれません。実際、最終製品はパイプライン自体ではなく、それが生成するデータであるため、このような一時的なワークフローは非常に推奨されます。

- LLM メニューから「OpenAI キー」ノードをドラッグします。
- LLM メニューから「クラスター抽出」ノードをドラッグします。
- 「CSV」と「グリッド」ノードを接続しているエッジを右クリックし、「エッジを削除」をクリックします。

![csv key cluster grid](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-01-09-45.jpeg)

- 「OpenAI キー」ノードに OpenAI API キーを貼り付けます。

これでビルディングブロックを接続する準備ができました。

### ノードの接続

- 「OpenAI キー」ノードの下部ハンドルを「クラスター抽出」ノードの上部ハンドルに接続します。
- CSV ノードの下部ハンドルを「クラスター抽出」ノードの上部ハンドルに接続します。
- 「クラスター抽出」ノードの右上に、オレンジ色の「切断」アイコンが表示されていることに注意してください。
- クラスター抽出ノードを右クリックします
  - 「OpenAI キー」ドロップダウンで `open_ai_key_1` を選択します。
  - 「csv」ドロップダウンで `csv_1` を選択します。
- グラフの背景をクリックしてコンテキストメニューを閉じます。
- 「切断」アイコンが消えていることに注意してください。
- 「クラスター抽出」ノードの下部ハンドルを「グリッド」ノードの上部ハンドルに接続します。
- ノードを整理して、うまく流れるように配置します。

![ready to run](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-01-44-12.jpeg)

- 右上の「レポートを生成」（ロボット）アイコンをクリックします。

しばらくすると、クラスターが抽出されます。

![clusters extracted](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-01-50-05.jpeg)

クラスターに「トピック」と「サブトピック」、そして短い説明が含まれていることに注目してください。

- 「グリッド」ノードを右クリックして削除します。
- LLM メニューから：
  - 「議論抽出」ノードをドラッグします。
- 整形メニューから：
  - 「マージ」ノードをドラッグします
- 表示メニューから：
  - 「レポート v0」ノードをドラッグします

![arg extraction](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-02-44-04.jpeg)

- 以下のノードを「議論抽出」ノードに接続します：
  - 「CSV」
  - 「OpenAI キー」
  - 「クラスター抽出」
- 「議論抽出」ノードを右クリックし、以下を行います：
  - `open_ai_key` の下で `open_ai_key_1` をクリックします。
  - `csv` の下で `csv_1` をクリックします。
  - `cluster_extraction` の下で `cluster_extraction_1` をクリックします。

![arg extraction connecting](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-02-46-00.jpeg)

- 以下を「マージ」ノードに接続します：
  - 「クラスター抽出」
  - 「議論抽出」
- 「議論抽出」ノードを右クリックし、以下を行います：
  - `cluster_extraction` の下で `cluster_extraction_1` をクリックします
  - `argument_extraction` の下で `argument_extraction_1` をクリックします

![connect merge](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-02-49-13.jpeg)

- 「マージ」ノードを「レポート v0」ノードに接続します。

![basic pipeline](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-02-54-20.jpeg)

- 「レポートを生成」（ロボット）ボタンをクリックします。
- 右上のメニューで「標準ビュー」をクリックします。
- 下にスクロールします。

![completed](https://talktothecity.s3.amazonaws.com/tttc-turbo/static/images/Monosnap-tttc-turbo-2023-12-20-02-56-14.jpeg)

これで基本的な Talk to the City Turbo パイプラインが完成しました。

標準ビューから特定のノードを非表示にしたい場合は：

- グラフビューに移動します。
- 非表示にしたいノードを右クリックします。
- 「標準ビューで表示」チェックボックスのチェックを外します。
- 「保存」をクリックします。

プライベートウィンドウでレポートを開いて、ログアウトしたビューワーがどのように見えるかを確認してみてください。

### 読者のための演習：

- 「グリッド」ノードを作成し、ノードの下部ハンドルに接続します。
  - 「レポートを生成」（ロボットアイコン）をクリックします。
  - グリッド内のデータと、グリッドノードの JSON モードでデータを研究します。
  - 他のノードでも繰り返します。
