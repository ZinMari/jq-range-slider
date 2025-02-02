export default class SliderModel {
  minValue: number;
  maxValue: number;
  stepValue: number;
  constructor({ minValue, maxValue, stepValue }: AlexandrSettings) {
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.stepValue = stepValue;
  }
}
