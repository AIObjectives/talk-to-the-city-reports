報告_v1節點的作用是將提取的數據提供給用戶介面的其他部分。

它需要兩個輸入：合併後的報告數據，以及原始的csv數據。這個節點是為了更複雜的報告而設計的，這些報告可能有不止一個CSV節點，或者是透過JSON節點讀取數據的報告。在這些情況下，需要通過連接明確指出原始數據，這就需要使用報告_v1節點。