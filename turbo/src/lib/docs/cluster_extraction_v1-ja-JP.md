cluster_extraction ノードは、CSV ファイルからクラスターを抽出するために使用されます。CSV ファイル内のすべてのコメントを用いて、OpenAI の`gpt-4-1106-preview`モデルに対して 1 回の呼び出しを行います。

v1 ノードは、プロンプトの JSON 部分を隠しており、技術的ではないエンドユーザーにとって使いやすくなっています。