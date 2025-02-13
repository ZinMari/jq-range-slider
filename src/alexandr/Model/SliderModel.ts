export default class SliderModel {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  type: 'single' | 'double';
  onThumbsPositionChanged: any;
  onStepValueChenged: any;
  onMinMaxValuesChanged: any;

  init({ minValue, maxValue, minPosition, maxPosition, stepValue, type }: any) {
    this.type = type;
    this.setStepValue(stepValue);
    this.setMinValue(minValue);
    this.setMaxValue(maxValue);
    this.setMinPosition(minPosition);
    if (this.type === 'double') {
      this.setMaxPosition(maxPosition);
    }
  }

  setMinValue(minValue: number) {
    this.minValue = minValue;

    this.onMinMaxValuesChanged?.(this.minValue, this.maxValue);
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  setMaxValue(maxValue: number) {
    this.maxValue = maxValue;

    this.onMinMaxValuesChanged?.(this.minValue, this.maxValue);
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  setStepValue(stepValue: number) {
    this.stepValue = stepValue;
    this.onStepValueChenged?.(this.minValue, this.maxValue, this.stepValue);
  }

  setMinPosition(minPosition: number) {
    const typeValue = 'min';

    let newPosition = this.equateValueToStep(minPosition);

    newPosition = this.validatePosition(newPosition);

    if (this.type === 'double') {
      newPosition = this.validateDoublePosition(typeValue, newPosition);
    }
    this.minPosition = newPosition;
    this.onThumbsPositionChanged?.('min', this.minPosition);
  }

  setMaxPosition(maxPosition: number) {
    const typeValue = 'max';
    let newPosition = this.equateValueToStep(maxPosition);

    newPosition = this.validatePosition(newPosition);

    if (this.type === 'double') {
      newPosition = this.validateDoublePosition(typeValue, newPosition);
    }

    this.maxPosition = newPosition;
    this.onThumbsPositionChanged?.('max', this.maxPosition);
  }

  bindThumbsPositionChanged(callback: any) {
    this.onThumbsPositionChanged = callback;
  }

  bindStepValueChanged(callback: any) {
    this.onStepValueChenged = callback;
  }

  bindMinMaxValuesChanged(callback: any) {
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
