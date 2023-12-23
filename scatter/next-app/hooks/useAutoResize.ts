import { useState, useEffect, useCallback } from "react";
import { Dimensions } from "@/types";

const getDimensions = (width?: number, height?: number, padding?: number) => {
  console.log("getDimensions", window.innerWidth);
  const dims =
    window.innerWidth < 500
      ? {
          width: window.innerWidth! - 100,
          height: window.innerWidth! - 100,
          padding: 10,
        }
      : {
          width: width || window.innerWidth!,
          height: height || window.innerHeight!,
          padding: padding || 30,
        };
  console.log(dims);
  return {
    ...dims,
    scaleX: (x: number) => dims.padding + x * (dims.width! - 2 * dims.padding),
    scaleY: (y: number) => dims.padding + y * (dims.height! - 2 * dims.padding),
  };
};

const useResize = (width?: number, height?: number, padding?: number) => {
  const [dimensions, setDimensions] = useState<Dimensions>(
    getDimensions(width, height, padding) as any
  );
  useEffect(() => {
    const update = () => {
      setDimensions(getDimensions(width, height, padding) as any);
    };
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);
  return dimensions;
};

export default useResize;
