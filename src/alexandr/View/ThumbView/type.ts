export interface ThumbView {
  showFlag: () => void;
  hideFlag: () => void;
  updateFlagValues: (thumb: "min" | "max", position: number) => void;
  updateThumbsPosition: (
    thumb: "min" | "max",
    position: number,
    moveDirection: "top" | "left",
  ) => void;
}