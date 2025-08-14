CSV ノードは、クラスタリングおよび引数抽出のための主要入力として使用されます。サンプルの CSV は[google sheets](https://docs.google.com/spreadsheets/d/1k8L1M9Ptxz_fBlZlGe0f-X4wCRIfmmRrISLy3c5EqUk/edit#gid=0)で見つけられます（サンプルの Google シートを使用する場合は、ファイル > ダウンロード > .csv をクリックすることを確認してください）。

`comment-id`: このソースからの完全な意見またはコメント
`comment-body`: コメントの本文

オプションの 'interview' フィールドは、各行のデータソース（例えば、人の名前やインタビューのタイトル）をラベル付けするために使用できます。

オプションの 'video' および 'timestamp' フィールドは、ビデオコンテンツのないデータセットの場合は空白のままにしておいてください。

オプションの列:

`interview`: コメントが取られたインタビュー（理想的には人の名前）  
`video`: コメントが抽出されたビデオ、現在は vimeo リンクのみがサポートされています  
`timestamp`: ビデオ内のコメントのタイムスタンプ、hh:mm:ss 形式で

`video`列には次の形式のリンクを含める必要があります：

`https://www.youtube.com/embed/<video_id>`

または

`https://vimeo.com/<video_id>`
