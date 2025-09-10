export type ValueConverter = {
  pixelInOneStep: (data: PixelInOneStepData) => number;
  convertPixelToUnits: (data: ConvertData) => number;
  convertUnitsToPixels: (data: ConvertData) => number;
};

export type ConvertData = {
  value: number;
  pixelInOneStep: number;
  minValue: number;
  stepValue: number;
};

export type PixelInOneStepData = {
  sliderLength: number;
  max: number;
  min: number;
  step: number;
};
