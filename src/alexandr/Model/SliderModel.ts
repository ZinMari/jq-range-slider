export default class SliderModel {
  minValue: number;
  maxValue: number;
  stepValue: number;
  minPosition: number;
  maxPosition: number;
  type: 'double' | 'single';

  setMinValue(minValue: number, maxValue: number): void {
    if (minValue >= maxValue) {
      this.minValue = maxValue - 100;
    } else {
      this.minValue = minValue;
    }
  }

  setMaxValue(minValue: number, maxValue: number): void {
    if (maxValue <= minValue) {
      this.maxValue = minValue + 100;
    } else {
      this.maxValue = maxValue;
    }
  }

  setStepValue(value: number): void {
    if (value <= 0) {
      this.stepValue = 1;
    } else if (value >= Math.abs(this.maxValue - this.minValue)) {
      this.stepValue = Math.abs(this.maxValue - this.minValue);
    } else {
      this.stepValue = value;
    }
  }

  //   setInitialValues(initialValues: number[]) {
  //     const arrValues = initialValues.map((value) => {
  //       if (value <= this.minValue) {
  //         return this.minValue;
  //       } else if (value >= this.maxValue) {
  //         return this.maxValue;
  //       } else {
  //         return value;
  //       }
  //     });

  //     this.startInitialValues =
  //       arrValues[0] === arrValues[1] ? [arrValues[0], arrValues[0] + this.stepValue] : arrValues;
  //   }

  setMinPosition(minPosition: number) {
    if (minPosition <= this.minValue) {
      this.minPosition = this.minValue;
    } else if (minPosition >= this.maxValue) {
      this.minPosition = this.maxValue - this.stepValue;
    } else {
      this.minPosition = minPosition;
    }
  }

  setMaxPosition(maxPosition: number) {
    if (maxPosition <= this.minPosition) {
      this.maxPosition = this.minPosition + this.stepValue;
    } else if (maxPosition >= this.maxValue) {
      this.maxPosition = this.maxValue;
    } else {
      this.maxPosition = maxPosition;
    }
  }

  init({ minValue, maxValue, stepValue, minPosition, maxPosition, type }: AlexandrSettings): void {
    this.setMinValue(minValue, maxValue);
    this.setMaxValue(minValue, maxValue);
    this.setMinPosition(minPosition);
    this.setMaxPosition(maxPosition);
    this.setStepValue(stepValue);
    // this.setInitialValues(initialValues);
    this.type = type;
  }
}
