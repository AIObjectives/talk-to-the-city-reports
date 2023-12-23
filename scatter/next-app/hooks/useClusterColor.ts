import { useCallback, useMemo } from "react";

const colors: string[] = [
  "#8a2be2", // Purple
  "#ff69b4", // Pink
  "#1e90ff", // Blue
  "#008080", // Teal
  "#00d3d3", // Cyan
  "#cdcd00", // Yellow
  "#ffa500", // Orange
  "#ff0000", // Red
  "#008000", // Green
  "#ff4500", // Orange-Red
  "#32cd32", // Lime Green
  "#ff1493", // Deep Pink
  "#9932cc", // Dark Orchid
  "#20b2aa", // Light Sea Green
  "#ff6347", // Tomato
  "#4169e1", // Royal Blue
  "#2e8b57", // Sea Green
  "#8b4513", // Saddle Brown
  "#00ffff", // Aqua
  "#ffd700", // Gold
  "#4b0082", // Indigo
  "#ff8c00", // Dark Orange
  "#dc143c", // Crimson
  "#556b2f", // Dark Olive Green
];

const useClusterColor = (clusterIds: string[]) => {
  const mapping = useMemo(() => {
    const map: { [key: string]: string } = {};
    clusterIds.forEach((id, i) => {
      map[id] = colors[i % colors.length];
    });
    return map;
  }, [clusterIds]);
  return useCallback(
    (id: string, onlyCluster?: string) =>
      onlyCluster && onlyCluster !== id ? "lightgray" : mapping[id],
    [mapping]
  );
};

export type ColorFunc = ReturnType<typeof useClusterColor>;

export default useClusterColor;
