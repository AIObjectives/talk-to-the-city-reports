export const mean = (arr: number[]) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

export const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
