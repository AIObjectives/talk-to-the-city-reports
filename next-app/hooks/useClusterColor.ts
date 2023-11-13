import { useCallback, useMemo } from "react";

const colors: string[] = [
  "#4169e1", // Royal Blue
  "#ff6347", // Tomato
  "#2e8b57", // Sea Green
  "#dc143c", // Crimson
  "#ffa500", // Orange
  "#8a2be2", // Purple
  "#8b4513", // Saddle Brown
  "#ff69b4", // Pink
  "#00d3d3", // Cyan
  "#556b2f", // Dark Olive Green
  "#cdcd00", // Yellow
  "#1e90ff", // Blue
  "#ff4500", // Orange-Red
  "#32cd32", // Lime Green
  "#ffd700", // Gold
  "#ff1493", // Deep Pink
  "#00ffff", // Aqua
  "#20b2aa", // Light Sea Green
  "#4b0082", // Indigo
  "#ff8c00", // Dark Orange
  "#008080", // Teal
  "#ff0000", // Red
  "#008000", // Green
  "#9932cc", // Dark Orchid
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
