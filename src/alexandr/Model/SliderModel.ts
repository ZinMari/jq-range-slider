export default class SliderModel {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  type: 'single' | 'double';
  onThumbsPositionChanged?: (type: 'min' | 'max', position: number) => void;
  onStepValueChenged?: (minValue: number, maxValue: number, stepValue: number) => void;
  onMinMaxValuesChanged?: (minValue: number, maxValue: number) => void;

  init({ minValue, maxValue, minPosition, maxPosition, stepValue, type }: AlexandrSettings) {
    this.type = type;
    this.setStepValue(stepValue);
    this.setMinValue(+minValue);
    this.setMaxValue(+maxValue);
    this.setMinPosition(+minPosition);
    if (this.type === 'double') {
      this.setMaxPosition(+maxPosition!);
    }
  }

  setMinValue(minValue: number): void {
    this.minValue = minValue;

    this.onMinMaxValuesChanged?.(this.minValue, this.maxValue);
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  setMaxValue(maxValue: number): void {
    this.maxValue = maxValue <= this.minValue ? this.minValue + this.stepValue : maxValue;

    this.onMinMaxValuesChanged?.(this.minValue, this.maxValue);
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  setStepValue(stepValue: number):void {
    this.stepValue = stepValue;
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  setMinPosition(minPosition: number):void {
    const typeValue = 'min';

    let newPosition = this.equateValueToStep(minPosition);

    newPosition = this.validatePosition(newPosition);

    if (this.type === 'double') {
      newPosition = this.validateDoublePosition(typeValue, newPosition);
    }
    this.minPosition = newPosition;
    this.onThumbsPositionChanged?.('min', this.minPosition);
  }

  setMaxPosition(maxPosition: number):void {
    const typeValue = 'max';
    let newPosition = this.equateValueToStep(maxPosition);
    newPosition = this.validatePosition(newPosition);

    if (this.type === 'double') {
      newPosition = this.validateDoublePosition(typeValue, newPosition);
    }

    this.maxPosition = newPosition;
    this.onThumbsPositionChanged?.('max', this.maxPosition);
  }

  bindThumbsPositionChanged(callback: (type: 'min' | 'max', position: number) => void): void {
    this.onThumbsPositionChanged = callback;
  }

  bindStepValueChanged(callback: (minValue: number, maxValue: number, stepValue: number) => void): void {
    this.onStepValueChenged = callback;
  }

  bindMinMaxValuesChanged(callback: (minValue: number, maxValue: number) => void): void {
    this.onMinMaxValuesChanged = callback;
  }

  validatePosition(value: number): number {
    let validateValue;

    //проверю на пограничное минимальное
    validateValue = value <= this.minValue ? this.minValue : value;

    //проверю на пограничное максимальное
    validateValue = validateValue >= this.maxValue ? this.maxValue : validateValue;

    return validateValue;
  }

  validateDoublePosition(type: 'min' | 'max', value: number): number {
    if (type === 'min' && value >= this.maxPosition) {
      return this.maxPosition - this.stepValue;
    }
    if (type === 'max' && value <= this.minPosition) {
      return this.minPosition + this.stepValue;
    }

    return value;
  }

  equateValueToStep(value: number): number {
    return Math.round(value / this.stepValue) * this.stepValue;
  }
}
