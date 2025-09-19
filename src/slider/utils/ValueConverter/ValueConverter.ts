import type {
  TConvertData,
  TPixelInOneStepData
} from "./type";

export default class ValueConverter{
  static pixelInOneStep = ({
    sliderLength,
    max,
    min,
    step,
  }: TPixelInOneStepData): number => {
    return (sliderLength / (max - min)) * step || 1;
  };

  static convertPixelToUnits({
    value,
    pixelInOneStep,
    minValue,
    stepValue,
  }: TConvertData): number {
    return Math.round((value / pixelInOneStep) * stepValue + minValue);
  }

  static convertUnitsToPixels({
    value,
    pixelInOneStep,
    minValue,
    stepValue,
  }: TConvertData): number {
    const withMinValue = value - minValue;
    const pixels = withMinValue * (pixelInOneStep / stepValue);
    return pixels;
  }
}
