export default class ValueConverter implements ValueConverter {
  pixelInOneStep = ({
    sliderLength,
    max,
    min,
    step,
  }: PixelInOneStepData): number => {
    return (sliderLength / (max - min)) * step || 1;
  };

  convertPixelToUnits({
    value,
    pixelInOneStep,
    minValue,
    stepValue,
  }: ConvertData): number {
    return Math.round((value / pixelInOneStep) * stepValue + minValue);
  }

  convertUnitsToPixels({
    value,
    pixelInOneStep,
    minValue,
    stepValue,
  }: ConvertData): number {
    const withMinValue = value - minValue;
    const pixels = withMinValue * (pixelInOneStep / stepValue);
    return pixels;
  }
}
