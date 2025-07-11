export default class ValueConverter {
  pixelInOneStep = ({ sliderLength, max, min, step }: any): number => {
    return (sliderLength / (max - min)) * step || 1;
  };

  convertPixelToUnits({
    pixel,
    pixelInOneStep,
    stepValue,
    minValue,
  }: any): number {
    return Math.round((pixel / pixelInOneStep) * stepValue + minValue);
  }

  convertUnitsToPixels({
    units,
    minValue,
    pixelInOneStep,
    stepValue,
  }: any): number {
    const withMinValue = units - minValue;
    const pixels = withMinValue * (pixelInOneStep / stepValue);
    return pixels;
  }
}
