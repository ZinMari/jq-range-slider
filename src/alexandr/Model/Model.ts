import Observer from "../Observer/Observer";

class Model extends Observer {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  type: "single" | "double";

  init({
    minValue,
    maxValue,
    minPosition,
    maxPosition,
    stepValue,
    type,
  }: AlexandrSettings): {
    minValue: number;
    maxValue: number;
    minPosition: number;
    maxPosition: number;
    stepValue: number;
  } {
    this.type = type;
    this.setMaxValue(Number(maxValue));
    this.setMinValue(Number(minValue));
    this.setStepValue(Number(stepValue));
    this.setMaxValue(Number(maxValue));
    this.setMinPosition(Number(minPosition));
    if (this.type === "double") {
      this.setMaxPosition(Number(maxPosition));
    }

    return {
      minValue: this.minValue,
      maxValue: this.maxValue,
      minPosition: this.minPosition,
      maxPosition: this.maxPosition,
      stepValue: this.stepValue,
    };
  }

  setMinPosition(minPosition: number): void {
    const typeValue = "min";

    let newPosition = this._equateValueToStep(minPosition);
    newPosition = this._validatePosition(newPosition);
    if (this.type === "double") {
      newPosition = this._validateDoublePosition(typeValue, newPosition);
    }
    this.minPosition = newPosition;

    super.notify({
      event: "modelThumbsPositionChanged",
      type: "min",
      currentValue: this.minPosition,
    });
  }

  setMaxPosition(maxPosition: number): void {
    const typeValue = "max";
    let newPosition = this._equateValueToStep(maxPosition);
    newPosition = this._validatePosition(newPosition);

    if (this.type === "double") {
      newPosition = this._validateDoublePosition(typeValue, newPosition);
    }

    this.maxPosition = newPosition;
    super.notify({
      event: "modelThumbsPositionChanged",
      type: "max",
      currentValue: this.maxPosition,
    });
  }

  setMinValue(minValue: number): void {
    this.minValue =
      minValue >= this.maxValue || Number.isNaN(minValue)
        ? this.maxValue - this.stepValue
        : minValue;

    super.notify({
      event: "modelMinMaxValuesChanged",
      min: this.minValue,
      max: this.maxValue,
    });
    super.notify({
      event: "modelStepValueChenged",
      min: this.minValue,
      max: this.maxValue,
      step: this.stepValue,
    });
  }

  setMaxValue(maxValue: number): void {
    this.maxValue =
      maxValue <= this.minValue || Number.isNaN(maxValue)
        ? this.minValue + this.stepValue
        : maxValue;
    super.notify({
      event: "modelMinMaxValuesChanged",
      min: this.minValue,
      max: this.maxValue,
    });
    super.notify({
      event: "modelStepValueChenged",
      min: this.minValue,
      max: this.maxValue,
      step: this.stepValue,
    });
  }

  setStepValue(stepValue: number): void {
    const isValueLessThanZero = stepValue <= 0;
    const isValueGreaterThanMax = stepValue >= this.maxValue;
    const valueIsNaN = Number.isNaN(stepValue);

    this.stepValue =
      isValueLessThanZero || valueIsNaN || isValueGreaterThanMax
        ? 1
        : stepValue;

    super.notify({
      event: "modelStepValueChenged",
      min: this.minValue,
      max: this.maxValue,
      step: this.stepValue,
    });
  }

  private _validatePosition(value: number): number {
    let validateValue;

    //проверю на пограничное минимальное
    validateValue = value <= this.minValue ? this.minValue : value;

    //проверю на пограничное максимальное
    validateValue =
      validateValue >= this.maxValue ? this.maxValue : validateValue;

    return validateValue;
  }

  private _validateDoublePosition(type: "min" | "max", value: number): number {
    if (type === "min" && value >= this.maxPosition) {
      return this.maxPosition - this.stepValue;
    }
    if (type === "max" && value <= this.minPosition) {
      return this.minPosition + this.stepValue;
    }

    return value;
  }

  private _equateValueToStep(value: number): number {
    return Math.round(value / this.stepValue) * this.stepValue || this.minValue;
  }
}

export default Model;
