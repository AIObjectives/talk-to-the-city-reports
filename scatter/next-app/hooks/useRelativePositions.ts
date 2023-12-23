import { Cluster } from "@/types";

const useRelativePositions = (clusters: Cluster[]): Cluster[] => {
  const args = clusters.map((cluster) => cluster.arguments).flat();
  const X = args.map((arg) => arg.x);
  const Y = args.map((arg) => arg.y);
  const minX = Math.min(...X);
  const minY = Math.min(...Y);
  const maxX = Math.max(...X);
  const maxY = Math.max(...Y);
  return clusters.map((cluster) => {
    const args = cluster.arguments.map((arg) => {
      const x = (arg.x - minX) / (maxX - minX);
      const y = (arg.y - minY) / (maxY - minY);
      return { ...arg, x, y };
    });
    return { ...cluster, arguments: args };
  });
};

export default useRelativePositions;
