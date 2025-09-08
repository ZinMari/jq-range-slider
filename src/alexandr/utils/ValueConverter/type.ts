export interface ValueConverter {
  pixelInOneStep: (data: PixelInOneStepData) => number;
  convertPixelToUnits: (data: ConvertData) => number;
  convertUnitsToPixels: (data: ConvertData) => number;
}