export default class SliderModel {
  minValue: number;
  maxValue: number;
  stepValue: number;
  startInitialValues: number[];
  type: 'double' | 'single';

  constructor({ minValue, maxValue, stepValue, initialValues, type }: AlexandrSettings) {
    this.minValue = this.setMinValue(minValue, maxValue);
    this.maxValue = this.setMaxValue(minValue, maxValue);
    this.stepValue = this.setStepValue(stepValue);
    this.startInitialValues = this.setInitialValues(initialValues);
    this.type = type;
  }

  setMinValue(minValue: number, maxValue: number): number {
    if (minValue >= maxValue) {
      return maxValue - 100;
    } else {
      return minValue;
    }
  }

  setMaxValue(minValue: number, maxValue: number): number {
    if (maxValue <= minValue) {
      return minValue + 100;
    } else {
      return maxValue;
    }
  }

  setStepValue(value: number): number {
    if (value <= 0) {
      return 1;
    } else if (value >= Math.abs(this.maxValue - this.minValue)) {
      return Math.abs(this.maxValue - this.minValue);
    } else {
      return value;
    }
  }

  setInitialValues(initialValues: number[]) {
    const arrValues = initialValues.map((value) => {
      if (value <= this.minValue) {
        return this.minValue;
      } else if (value >= this.maxValue) {
        return this.maxValue;
      } else {
        return value;
      }
    });

    return arrValues[0] === arrValues[1]
      ? [arrValues[0], arrValues[0] + this.stepValue]
      : arrValues;

    console.log(arrValues);
  }

  init({ minValue, maxValue, stepValue, initialValues, type }: AlexandrSettings):void{
    this.minValue = this.setMinValue(minValue, maxValue);
    this.maxValue = this.setMaxValue(minValue, maxValue);
    this.stepValue = this.setStepValue(stepValue);
    this.startInitialValues = this.setInitialValues(initialValues);
    this.type = type;
  }
}
