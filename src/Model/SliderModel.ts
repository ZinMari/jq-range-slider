export default class SliderModel {
  minValue: any;
  maxValue: any;
  stepValue: any;
  constructor({ minValue, maxValue, stepValue }: any) {
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.stepValue = stepValue;
  }
}
