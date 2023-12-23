import { Dimensions } from "@/types";
import { MouseEventHandler, WheelEventHandler, useState } from "react";

const minZoom = 0.2;
const maxZoom = 5;

const useZoom = (dimensions?: Dimensions, allowZoom?: boolean) => {
  const [zoom, setZoom] = useState({ scale: 1, panx: 0, pany: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [moved, setMoved] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const onWheel: WheelEventHandler<SVGSVGElement> = (e) => {
    if (!allowZoom || disabled) return;
    const rect = (e.target as any).getBoundingClientRect!();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newScale = Math.max(
      minZoom,
      Math.min(maxZoom, zoom.scale - e.deltaY / 1000)
    );
    const newPanx = x - (x - zoom.panx) * (newScale / zoom.scale);
    const newPany = y - (y - zoom.pany) * (newScale / zoom.scale);
    setZoom({ scale: newScale, panx: newPanx, pany: newPany });
  };

  const onMouseDown: MouseEventHandler<SVGSVGElement> = (e: any) => {
    if (!allowZoom || disabled) return;
    const rect = (e.target as any).getBoundingClientRect!();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragging(true);
    setDragStart({ x, y });
    setMoved(false);
  };

  const onMouseMove =
    (onMove: any, onDrag: any): any =>
    (e: any) => {
      onMove(e);
      if (!allowZoom || disabled) return;
      if (!dragging) return;
      onDrag();
      const rect = (e.target as any).getBoundingClientRect!();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const panx = zoom.panx + (x - dragStart.x);
      const pany = zoom.pany + (y - dragStart.y);
      setDragStart({ x, y });
      setMoved(true);
      setZoom({ ...zoom, panx, pany });
    };

  const onMouseUp =
    (onClick: any): any =>
    (e: any) => {
      if (!moved) {
        onClick(e);
      }
      setDragging(false);
    };

  const events = ({ onMove, onDrag, onClick }: any): any => {
    return {
      onWheel,
      onMouseDown: onMouseDown,
      onMouseMove: onMouseMove(onMove, onDrag),
      onMouseUp: onMouseUp(onClick),
    };
  };

  const zoomX = (x: number) => x * zoom.scale + zoom.panx;
  const zoomY = (y: number) => y * zoom.scale + zoom.pany;
  const unZoomX = (x: number) => (x - zoom.panx) / zoom.scale;
  const unZoomY = (y: number) => (y - zoom.pany) / zoom.scale;

  const reset =
    zoom.scale == 1 && zoom.panx == 0 && zoom.pany == 0
      ? false
      : () => {
          setZoom({ scale: 1, panx: 0, pany: 0 });
        };

  return {
    ...zoom,
    events,
    dragging,
    zoomX,
    zoomY,
    unZoomX,
    unZoomY,
    reset,
    disable: () => setDisabled(true),
    enable: () => setDisabled(false),
  };
};

export type Zoom = ReturnType<typeof useZoom>;

export default useZoom;
