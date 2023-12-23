import { useCallback, useMemo } from "react";

import { Cluster, CommentsMap, Argument } from "@/types";

const useFilter = (
  clusters: Cluster[],
  comments: CommentsMap,
  minVotes: number,
  minConsensus: number,
  dataHasVotes: boolean
) => {
  const filter = useCallback(
    (arg: Argument) => {
      if (!dataHasVotes) return true;
      const comment = comments[arg.comment_id];
      const votes = comment.agrees! + comment.disagrees!;
      const consensus =
        (100 * Math.max(comment.agrees!, comment.disagrees!)) / votes;
      return votes >= minVotes && consensus >= minConsensus!;
    },
    [minVotes, minConsensus]
  );
  const stats = useMemo(() => {
    let total = 0;
    let filtered = 0;
    clusters.forEach((c) =>
      c.arguments.forEach((arg) => {
        total++;
        if (!filter(arg)) filtered++;
      })
    );
    return { total, filtered };
  }, [filter]);
  return { filter, ...stats };
};

export default useFilter;
