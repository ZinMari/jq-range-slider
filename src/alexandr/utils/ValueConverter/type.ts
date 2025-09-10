export interface IValueConverter {
  pixelInOneStep: (data: TPixelInOneStepData) => number;
  convertPixelToUnits: (data: TConvertData) => number;
  convertUnitsToPixels: (data: TConvertData) => number;
}

export type TConvertData = {
  value: number;
  pixelInOneStep: number;
  minValue: number;
  stepValue: number;
};

export type TPixelInOneStepData = {
  sliderLength: number;
  max: number;
  min: number;
  step: number;
};
