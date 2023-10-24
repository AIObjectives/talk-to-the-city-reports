import { MouseEventHandler, useMemo } from "react";
import { voronoi } from "@visx/voronoi";
import { Cluster, Argument, Dimensions, CommentsMap, Point } from "@/types";
import { Zoom } from "./useZoom";

const useVoronoiFinder = (
  clusters: Cluster[],
  comments: CommentsMap,
  color: (cluster_id: string) => string,
  zoom: Zoom,
  dimensions?: Dimensions,
  onlyCluster?: string,
  radius = 30
) => {
  return useMemo(() => {
    if (!dimensions) return () => null as any;
    const { width, height, scaleX, scaleY } = dimensions;
    const points: Point[] = clusters.flatMap((cluster) =>
      cluster.arguments.map((arg) => ({
        ...arg,
        ...cluster,
        ...comments[arg.comment_id],
        color: color(cluster.cluster_id),
      }))
    );
    const layout = voronoi<Point>({
      x: (d) => scaleX(d.x),
      y: (d) => scaleY(d.y),
      width,
      height,
    })(points);
    return (mouseEvent: any) => {
      const rect = mouseEvent.target.getBoundingClientRect!();
      const x = zoom.unZoomX(mouseEvent.clientX - rect.left);
      const y = zoom.unZoomY(mouseEvent.clientY - rect.top);
      const found = layout.find(x, y, radius);
      if (onlyCluster && found && found.data.cluster_id !== onlyCluster)
        return null;
      return found;
    };
  }, [clusters, dimensions]);
};

export default useVoronoiFinder;
