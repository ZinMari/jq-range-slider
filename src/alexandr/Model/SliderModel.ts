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
    this.setMinValue(minValue);
    this.setMaxValue(maxValue);
    this.setStepValue(stepValue);
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
    this.minPosition = minPosition;
    console.log(this.minPosition);

    this.onThumbsPositionChanged?.('min', this.minPosition);
  }

  setMaxPosition(maxPosition: number) {
    this.maxPosition = maxPosition;

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
}
