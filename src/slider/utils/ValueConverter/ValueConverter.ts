import type {
  TConvertData,
  TPixelInOneStepData,
  IValueConverter,
} from "./type";

export default class ValueConverter implements IValueConverter {
  pixelInOneStep = ({
    sliderLength,
    max,
    min,
    step,
  }: TPixelInOneStepData): number => {
    return (sliderLength / (max - min)) * step || 1;
  };

  convertPixelToUnits({
    value,
    pixelInOneStep,
    minValue,
    stepValue,
  }: TConvertData): number {
    return Math.round((value / pixelInOneStep) * stepValue + minValue);
  }

  convertUnitsToPixels({
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
