export default class ValueConverter {
  pixelInOneStep = ({sliderLength, max, min, step}: any):number => {
    return (sliderLength / (max - min)) * step ||
      1;
  }

  convertPixelToUnits({pixel, pixelInOneStep, stepValue, minValue}: any): number {
    return Math.round(
      (pixel / pixelInOneStep) * stepValue + minValue,
    );
  }

  convertUnitsToPixels({units, minValue, pixelInOneStep, stepValue}: any): number {
    const withMinvalue = units - minValue;
    const pixels = withMinvalue * (pixelInOneStep / stepValue);
    return pixels;
  }
}