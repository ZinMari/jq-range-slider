import Observer from "../Observer/Observer";
import ValueConverter from "../utils/ValueConverter";

class Model extends Observer<ModelEvents> implements Model {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  type: "single" | "double";
  orientation: "horizontal" | "vertical";
  pixelInOneStep: number;
  moveDirection: "top" | "left";
  minThumbPixelPosition: number;
  maxThumbPixelPosition: number;
  sliderLength: number;
  minThumbWidth: number;
  minThumbHeight: number;
  maxThumbWidth: number;
  maxThumbHeight: number;
  valueConverter: ValueConverter;
  showRuler: boolean;

  constructor({
    minValue,
    maxValue,
    minPosition,
    maxPosition,
    stepValue,
    type,
    orientation,
    showRuler,
  }: AlexandrSettings) {
    super();
    this.valueConverter = new ValueConverter();

    this.type = type;
    this.orientation = orientation;
    this.moveDirection = this.orientation === "vertical" ? "top" : "left";

    this.minValue = Math.min(minValue, maxValue);
    this.maxValue = Math.max(minValue, maxValue);
    this.minPosition =
      minPosition >= this.minValue ? minPosition : this.minValue;
    this.maxPosition =
      maxPosition <= this.maxValue ? maxPosition : this.maxValue;
    this.stepValue = stepValue;

    this.showRuler = showRuler;
  }

  refreshOptions = (options: AlexandrSettings): void => {
    if (options.minValue) {
      this.setMinValue(Number(options.minValue));
    }
    if (options.maxValue) {
      this.setMaxValue(Number(options.maxValue));
    }
    if (options.minPosition) {
      this.setThumbsPosition("min", Number(options.minPosition));
    }
    if (options.maxPosition) {
      this.setThumbsPosition("max", Number(options.maxPosition));
    }
    if (options.stepValue) {
      this.setStepValue(options.stepValue);
    }
    if (options.orientation) {
      this.setOrientation(options.orientation);
    }
    if ("showRuler" in options) {
      this.setRuler(options.showRuler);
    }
  };

  modelGetCordsView = ({
    sliderLength,
    minThumbWidth,
    minThumbHeight,
    maxThumbWidth,
    maxThumbHeight,
  }: ViewCoords) => {
    this.sliderLength = sliderLength;
    this.minThumbWidth = minThumbWidth;
    this.minThumbHeight = minThumbHeight;
    this.maxThumbWidth = maxThumbWidth;
    this.maxThumbHeight = maxThumbHeight;

    this.pixelInOneStep = this.valueConverter.pixelInOneStep({
      sliderLength: this.sliderLength,
      max: this.maxValue,
      min: this.minValue,
      step: this.stepValue,
    });
  };

  setInitialValues() {
    this.setMaxValue(Number(this.maxValue));
    this.setMinValue(Number(this.minValue));
    this.setStepValue(Number(this.stepValue));

    if (this.type === "double") {
      this.setThumbsPosition("max", Number(this.maxPosition));
    }
    this.setThumbsPosition("min", Number(this.minPosition));

    this.setRuler(this.showRuler);
    this.setOrientation(this.orientation);
  }

  setRuler = (isSetRuler: boolean) => {
    this.notify("modelSetRulerChanged", {
      isSetRuler,
    });
  };

  setOrientation = (orientation: "vertical" | "horizontal") => {
    this.orientation = orientation;
    this.moveDirection = this.orientation === "vertical" ? "top" : "left";

    this.notify("modelOrientationChanged", {
      orientation,
    });
    this.setThumbsPosition("min", this.minPosition);
    if (this.type === "double") {
      this.setThumbsPosition("min", this.minPosition);
    }
  };

  setThumbsPosition = (typeThumb: "min" | "max", value: number): void => {
    value = Number.isNaN(value) ? 0 : value;

    let newPosition = this._equateValueToStep(value);

    newPosition = this._validatePosition(newPosition);

    if (this.type === "double") {
      newPosition = this._validateDoublePosition(typeThumb, newPosition);
    }

    this[`${typeThumb}Position`] = newPosition;
    this[`${typeThumb}ThumbPixelPosition`] =
      this.valueConverter.convertUnitsToPixels({
        value: this[`${typeThumb}Position`],
        minValue: this.minValue,
        pixelInOneStep: this.pixelInOneStep,
        stepValue: this.stepValue,
      });

    this.setProgressBarSize();

    this.notify("modelThumbsPositionChanged", {
      type: typeThumb,
      currentValue: this[`${typeThumb}Position`],
      pixelPosition: this[`${typeThumb}ThumbPixelPosition`],
      moveDirection: this.moveDirection,
    });
  };

  setProgressBarSize = (): void => {
    const halfMinThumb =
      this.orientation === "vertical"
        ? this.minThumbHeight / 2
        : this.minThumbWidth / 2;

    const halfMaxThumb =
      this.orientation === "vertical"
        ? this.maxThumbHeight / 2
        : this.maxThumbWidth / 2;

    let from =
      this.type === "single" ? 0 : this.minThumbPixelPosition + halfMinThumb;

    let to =
      this.type === "single"
        ? this.minThumbPixelPosition + halfMinThumb
        : this.maxThumbPixelPosition - this.minThumbPixelPosition;

    this.notify("modelProgressbarUpdated", {
      from,
      to,
    });
  };

  setMinValue(minValue: number): void {
    minValue = Number.isNaN(minValue) ? 0 : minValue;
    this.minValue =
      minValue >= this.maxValue || Number.isNaN(minValue)
        ? this.maxValue - this.stepValue
        : minValue;

    this.pixelInOneStep = this.valueConverter.pixelInOneStep({
      sliderLength: this.sliderLength,
      max: this.maxValue,
      min: this.minValue,
      step: this.stepValue,
    });

    this.notify("modelMinMaxValuesChanged", {
      min: this.minValue,
      max: this.maxValue,
    });
  }

  setMaxValue(maxValue: number): void {
    maxValue = Number.isNaN(maxValue) ? 0 : maxValue;
    this.maxValue =
      maxValue <= this.minValue || Number.isNaN(maxValue)
        ? this.minValue + this.stepValue
        : maxValue;
    this.pixelInOneStep = this.valueConverter.pixelInOneStep({
      sliderLength: this.sliderLength,
      max: this.maxValue,
      min: this.minValue,
      step: this.stepValue,
    });

    this.notify("modelMinMaxValuesChanged", {
      min: this.minValue,
      max: this.maxValue,
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

    this.pixelInOneStep = this.valueConverter.pixelInOneStep({
      sliderLength: this.sliderLength,
      max: this.maxValue,
      min: this.minValue,
      step: this.stepValue,
    });

    this.notify("modelStepValueChanged", { stepValue: this.stepValue });
  }

  updateThumbPosition = (options: UpdateThumbData) => {
    let value: number = this._getNewThumbCord({
      clientEvent: options.clientEvent,
      clientLineCoordsOffset: options.clientLineCoordsOffset,
      clientLineCoordsSize: options.clientLineCoordsSize,
      clientThumbCoordsSize: options.clientThumbCoordsSize,
      shiftClickThumb: options.shiftClickThumb,
    });

    this.setThumbsPosition(
      options.type,
      this.valueConverter.convertPixelToUnits({
        value,
        pixelInOneStep: this.pixelInOneStep,
        stepValue: this.stepValue,
        minValue: this.minValue,
      }),
    );
  };

  clickOnSlider({ pixelClick }: { pixelClick: number }) {
    const stepLeft = this._equatePixelValueToStep(pixelClick);

    if (this.type === "single") {
      this.setThumbsPosition(
        "min",
        this.valueConverter.convertPixelToUnits({
          value: stepLeft,
          pixelInOneStep: this.pixelInOneStep,
          stepValue: this.stepValue,
          minValue: this.minValue,
        }),
      );
    }

    if (this.type === "double") {
      const middlePixels =
        this.minThumbPixelPosition +
        (this.maxThumbPixelPosition - this.minThumbPixelPosition) / 2;

      if (stepLeft < middlePixels) {
        this.setThumbsPosition(
          "min",
          this.valueConverter.convertPixelToUnits({
            value: stepLeft,
            pixelInOneStep: this.pixelInOneStep,
            stepValue: this.stepValue,
            minValue: this.minValue,
          }),
        );
      } else {
        this.setThumbsPosition(
          "max",
          this.valueConverter.convertPixelToUnits({
            value: stepLeft,
            pixelInOneStep: this.pixelInOneStep,
            stepValue: this.stepValue,
            minValue: this.minValue,
          }),
        );
      }
    }
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

  private _getNewThumbCord({
    clientEvent,
    clientLineCoordsOffset,
    clientLineCoordsSize,
    clientThumbCoordsSize,
    shiftClickThumb,
  }: GetNewThumbCordData): number {
    let newLeft = clientEvent - shiftClickThumb - clientLineCoordsOffset;

    //подгоним движение под шаг
    newLeft = this._equatePixelValueToStep(newLeft);

    // курсор вышел из слайдера => оставить бегунок в его границах.
    if (newLeft < 0) {
      newLeft = 0;
    }
    const rightEdge = clientLineCoordsSize - clientThumbCoordsSize;

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    return newLeft;
  }

  private _equatePixelValueToStep(value: number): number {
    if (isNaN(value)) {
      throw new Error("Получено NaN");
    }
    return Math.round(value / this.pixelInOneStep) * this.pixelInOneStep;
  }

  private _equateValueToStep(value: number): number {
    if (isNaN(value)) {
      throw new Error("Получено NaN");
    }
    return Math.round(value / this.stepValue) * this.stepValue;
  }
}
export default Model;
