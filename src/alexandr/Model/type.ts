export interface Model extends Observer<ModelEvents> {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  pixelInOneStep: number;
  type: "single" | "double";
  moveDirection: "top" | "left";
  orientation: "horizontal" | "vertical";
  setThumbsPosition: (thumbType: "min" | "max", value: number) => void;
  setMinValue: (minValue: number) => void;
  setMaxValue: (maxValue: number) => void;
  setStepValue: (value: number) => void;
  updateThumbPosition: (options: UpdateThumbData) => void;
  clickOnSlider: (options: { pixelClick: number }) => void;
  modelGetCordsView: (viewCoords: ViewCoords) => void;
  setProgressBarSize: () => void;
  setInitialValues: () => void;
  setOrientation: (orientation: "vertical" | "horizontal") => void;
  refreshOptions: (options: AlexandrSettings) => void;
}