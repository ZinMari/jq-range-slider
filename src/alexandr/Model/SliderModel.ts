export default class SliderModel {
  minValue: number;
  maxValue: number;
  stepValue: number;
  minPosition: number;
  maxPosition: number;
  type: 'double' | 'single';
  onStepValueChanged: any;
  onThumbPositionChanged: any;

  setMinValue(minValue: number, maxValue: number): void {
    if (minValue >= maxValue) {
      this.minValue = maxValue - 100;
    } else {
      this.minValue = minValue;
    }

    this.onStepValueChanged(this.stepValue, this.maxValue, this.minValue);
  }

  setMaxValue(minValue: number, maxValue: number): void {
    if (maxValue <= minValue) {
      this.maxValue = minValue + 100;
    } else {
      this.maxValue = maxValue;
    }

    this.onStepValueChanged(this.stepValue, this.maxValue, this.minValue);
  }

  setStepValue(value: number): void {
    if (value <= 0) {
      this.stepValue = 1;
    } else if (value >= Math.abs(this.maxValue - this.minValue)) {
      this.stepValue = Math.abs(this.maxValue - this.minValue);
    } else {
      this.stepValue = value;
    }

    this.onStepValueChanged(this.stepValue, this.maxValue, this.minValue);
  }

  setMinPosition(minPosition: number) {
    if (minPosition <= this.minValue) {
      this.minPosition = this.minValue;
    } else if (minPosition >= this.maxValue) {
      this.minPosition = this.maxValue - this.stepValue;
    } else {
      this.minPosition = minPosition;
    }

    if (this.onThumbPositionChanged) {
      this.onThumbPositionChanged('min', this.minPosition);
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

    if (this.onThumbPositionChanged) {
      this.onThumbPositionChanged('max', this.maxPosition);
    }
  }

  init({ minValue, maxValue, stepValue, minPosition, maxPosition, type }: AlexandrSettings): void {
    this.setMinValue(minValue, maxValue);
    this.setMaxValue(minValue, maxValue);
    this.setMinPosition(minPosition);
    this.setMaxPosition(maxPosition);
    this.setStepValue(stepValue);
    this.type = type;
  }

  bindStepValueChanged(callback: any) {
    this.onStepValueChanged = callback;
  }

  bindThumbPositionChanged(callback: any) {
    this.onThumbPositionChanged = callback;
  }
}
