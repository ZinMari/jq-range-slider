export default class ValueConverter {
  pixelInOneStep = ({sliderLength, max, min, step}: any):number => {
    return (sliderLength / (max - min)) * step ||
      1;
  } 
//   toPixels(value: number): number 
//   toUnits(pixels: number): number 
//   alignPixelsToStep(pixels: number): number 
//   alignValueToStep(value: number): number
}