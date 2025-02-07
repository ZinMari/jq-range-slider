export default class SliderModel {
  minValue: number;
  maxValue: number;
  stepValue: number;
  startInitialValues: number[];
  type: 'double' | 'single';

  setMinValue(minValue: number, maxValue: number): void {
    if (minValue >= maxValue) {
      this.minValue =  maxValue - 100;
    } else {
      this.minValue =  minValue;
    }
  }

  setMaxValue(minValue: number, maxValue: number): void {
    if (maxValue <= minValue) {
      this.maxValue =  minValue + 100;
    } else {
      this.maxValue =  maxValue;
    }
  }

  setStepValue(value: number): void {
    if (value <= 0) {
      this.stepValue =  1;
    } else if (value >= Math.abs(this.maxValue - this.minValue)) {
      this.stepValue =  Math.abs(this.maxValue - this.minValue);
    } else {
      this.stepValue =  value;
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

    this.startInitialValues =  arrValues[0] === arrValues[1]
      ? [arrValues[0], arrValues[0] + this.stepValue]
      : arrValues;
  }

  init({ minValue, maxValue, stepValue, initialValues, type }: AlexandrSettings):void{
    this.setMinValue(minValue, maxValue);
    this.setMaxValue(minValue, maxValue);
    this.setStepValue(stepValue);
    this.setInitialValues(initialValues);
    this.type = type;
  }
}
