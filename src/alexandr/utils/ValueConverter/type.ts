export interface ValueConverter {
  pixelInOneStep: (data: PixelInOneStepData) => number;
  convertPixelToUnits: (data: ConvertData) => number;
  convertUnitsToPixels: (data: ConvertData) => number;
}

export interface ConvertData {
  value: number;
  pixelInOneStep: number;
  minValue: number;
  stepValue: number;
}