export default class SliderModel {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  onThumbsPositionChanged: any;
  onStepValueChenged: any;
  onMinMaxValuesChanged: any;

  init({ minValue, maxValue, minPosition, maxPosition, stepValue }: any) {
    this.setStepValue(stepValue);
    this.setMinValue(minValue);
    this.setMaxValue(maxValue);
    this.setMinPosition(minPosition);
    this.setMaxPosition(maxPosition);
    this.setMaxPosition(maxPosition);
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
    // приравниваем значения к шагу
    this.minPosition = this.equateValueToStep(minPosition);
    // проверю чтобы не столкнулись
    this.minPosition = this.validateDoubleValue('min', this.minPosition);
    this.onThumbsPositionChanged?.('min', this.minPosition);
  }

  setMaxPosition(maxPosition: number) {
    // приравниваем значения к шагу
    this.maxPosition = this.equateValueToStep(maxPosition);
    // проверю чтобы не столкнулись
    this.maxPosition = this.validateDoubleValue('max', this.maxPosition);
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

  equateValueToStep = (value: number) => {
    return Math.round(value / this.stepValue) * this.stepValue;
  };

  validateDoubleValue(type: 'min' | 'max', value: number) {
    if (type === 'min' && value >= this.maxPosition - this.stepValue) {
      return this.maxPosition - this.stepValue;
    } else if (type === 'max' && value <= this.minPosition + this.stepValue) {
      return this.minPosition + this.stepValue;
    }
    return value;
  }
}
