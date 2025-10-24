import Observer from "../Observer/Observer";
import ValueConverter from "./ValueConverter/ValueConverter";

import type { TUpdateThumbData } from "../View/ThumbView/type";
import type { TViewCoordinates } from "../View/View/type";
import type { GetNewThumbCordData, IModel, TModelEvents } from "./type";
import type { TSliderSettings, TUserSliderSettings } from "../Slider/type";

class Model extends Observer<TModelEvents> implements IModel {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number | null;
  stepValue: number;
  type: "single" | "double";
  orientation: "horizontal" | "vertical";
  pixelInOneStep!: number;
  minThumbPixelPosition!: number;
  maxThumbPixelPosition!: number | null;
  sliderLength!: number;
  minThumbWidth!: number;
  minThumbHeight!: number;
  maxThumbWidth!: number;
  maxThumbHeight!: number;
  showRuler: boolean;
  showValueFlag: boolean;

  constructor({
    minValue,
    maxValue,
    minPosition,
    maxPosition,
    stepValue,
    type,
    orientation,
    showRuler,
    showValueFlag,
  }: TSliderSettings) {
    super();

    this.type = type;
    this.orientation = orientation;

    this.minValue = minValue;
    this.maxValue = maxValue;
    this.minPosition = minPosition;
    this.maxPosition = maxPosition;

    this.stepValue = stepValue;
    this.showRuler = showRuler;
    this.showValueFlag = showValueFlag;

    this._normalizeValues();
  }

  private _normalizeValues() {
    this._normalizeMinMaxValues();
    this._normalizeStepValue();
    this._normalizeMinMaxPositions();
  }

  private _normalizeStepValue() {
    const isValueLessThanZero = this.stepValue <= 0;
    const isValueGreaterThanMax =
      this.stepValue >=
      Math.abs(Math.abs(this.maxValue) - Math.abs(this.minValue));
    const valueIsNaN = Number.isNaN(this.stepValue);

    this.stepValue = isValueLessThanZero || valueIsNaN ? 1 : this.stepValue;
    this.stepValue = isValueGreaterThanMax
      ? Math.abs(this.maxValue) - Math.abs(this.minValue)
      : this.stepValue;
  }

  private _normalizeMinMaxValues() {
    const min = this.minValue;
    const max = this.maxValue;

    this.minValue = Math.min(min, max);
    this.maxValue = Math.max(min, max);
  }

  private _normalizeMinMaxPositions() {
    if (this.type === "double" && typeof this.maxPosition === "number") {
      const min = this.minPosition;
      const max = this.maxPosition;

      this.minPosition = Math.min(min, max);
      this.maxPosition = Math.max(min, max);
    }

    //проверю на пограничные минимальное
    this.minPosition =
      this.minPosition < this.minValue ? this.minValue : this.minPosition;

    this.minPosition =
      this.minPosition > this.maxValue ? this.maxValue : this.minPosition;

    if (this.type === "double" && typeof this.maxPosition === "number") {
      //проверю на пограничные максимальное
      this.maxPosition =
        this.maxPosition > this.maxValue ? this.maxValue : this.maxPosition;

      this.maxPosition =
        this.maxPosition < this.minValue ? this.minValue : this.maxPosition;
    }
  }

  refreshOptions = (options: TUserSliderSettings): void => {
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
    if (options.showRuler) {
      this.setRuler(options.showRuler);
    }
    if (options.showValueFlag) {
      this.setValueFlag(options.showValueFlag);
    }
    if (options.type) {
      this.setType(options.type);
    }
  };

  modelGetCordsView = ({
    sliderLength,
    minThumbWidth,
    minThumbHeight,
    maxThumbWidth,
    maxThumbHeight,
  }: TViewCoordinates) => {
    this.sliderLength = sliderLength;
    this.minThumbWidth = minThumbWidth;
    this.minThumbHeight = minThumbHeight;
    this.maxThumbWidth = maxThumbWidth ?? 0;
    this.maxThumbHeight = maxThumbHeight ?? 0;

    this.pixelInOneStep = ValueConverter.pixelInOneStep({
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
    this.setOrientation(this.orientation);
    this.setType(this.type);

    if (this.type === "double") {
      this.setThumbsPosition("max", Number(this.maxPosition));
    }
    this.setThumbsPosition("min", Number(this.minPosition));
    this.setRuler(this.showRuler);
    this.setValueFlag(this.showValueFlag);
  }

  setRuler = (isSetRuler: boolean) => {
    this.notify("modelSetRulerChanged", {
      isSetRuler,
    });
  };

  setValueFlag = (isSetValueFlag: boolean) => {
    this.notify("modelShowFlagChanged", {
      isSetValueFlag,
    });
  };

  setType = (type: "single" | "double") => {
    this.type = type;

    if (type === "single") {
      this.maxPosition = null;
      this.maxThumbPixelPosition = null;
    } else {
      this.maxPosition = this.minPosition;
    }

    this.notify("modelTypeChanged", {
      type,
    });

    this.setThumbsPosition("min", this.minPosition);

    if (this.maxPosition != null) {
      this.setThumbsPosition("max", this.maxPosition);
    }
  };

  setOrientation = (orientation: "vertical" | "horizontal") => {
    this.orientation = orientation;

    this.notify("modelOrientationChanged", {
      orientation,
    });
    this.setThumbsPosition("min", this.minPosition);
    if (this.type === "double" && this.maxPosition != null) {
      this.setThumbsPosition("max", this.maxPosition);
    }
  };

  setThumbsPosition = (typeThumb: "min" | "max", value: number): void => {
    if (value === null) return;

    const positionProperty = `${typeThumb}Position` as const;
    const pixelPositionProperty = `${typeThumb}ThumbPixelPosition` as const;

    this[positionProperty] = this._calculatePosition(typeThumb, value);
    this._normalizeMinMaxPositions();

    this[pixelPositionProperty] = ValueConverter.convertUnitsToPixels({
      value: this[positionProperty],
      minValue: this.minValue,
      pixelInOneStep: this.pixelInOneStep,
      stepValue: this.stepValue,
    });

    this.setProgressBarSize();

    this.notify("modelThumbsPositionChanged", {
      type: typeThumb,
      currentValue: this[positionProperty],
      pixelPosition: this[pixelPositionProperty],
      orientation: this.orientation,
    });
  };

  setProgressBarSize = (): void => {
    const halfMinThumb =
      this.orientation === "vertical"
        ? this.minThumbHeight / 2
        : this.minThumbWidth / 2;

    const from =
      this.type === "single" ? 0 : this.minThumbPixelPosition + halfMinThumb;

    let to;

    if (this.type === "single") {
      to = this.minThumbPixelPosition + halfMinThumb;
    } else if (this.type === "double" && this.maxThumbPixelPosition) {
      to = this.maxThumbPixelPosition - this.minThumbPixelPosition;
    }

    this.notify("modelProgressbarUpdated", {
      orientation: this.orientation,
      from,
      to: to as number,
    });
  };

  setMinValue(minValue: number): void {
    minValue = Number.isNaN(minValue) ? 0 : minValue;
    this.minValue =
      minValue >= this.maxValue || Number.isNaN(minValue)
        ? this.maxValue - this.stepValue
        : minValue;

    this.pixelInOneStep = ValueConverter.pixelInOneStep({
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
    this.pixelInOneStep = ValueConverter.pixelInOneStep({
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
    this.stepValue = stepValue;
    this._normalizeStepValue();
    this.pixelInOneStep = ValueConverter.pixelInOneStep({
      sliderLength: this.sliderLength,
      max: this.maxValue,
      min: this.minValue,
      step: this.stepValue,
    });

    this.notify("modelStepValueChanged", { stepValue: this.stepValue });
  }

  updateThumbPosition = (options: TUpdateThumbData) => {
    const value: number = this._getNewThumbCord({
      clientEvent: options.clientEvent,
      clientLineCoordinatesOffset: options.clientLineCoordinatesOffset,
      clientLineCoordinatesSize: options.clientLineCoordinatesSize,
      clientThumbCoordinatesSize: options.clientThumbCoordinatesSize,
      shiftClickThumb: options.shiftClickThumb,
    });

    this.setThumbsPosition(
      options.type,
      ValueConverter.convertPixelToUnits({
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
        ValueConverter.convertPixelToUnits({
          value: stepLeft,
          pixelInOneStep: this.pixelInOneStep,
          stepValue: this.stepValue,
          minValue: this.minValue,
        }),
      );
    }

    if (this.type === "double" && this.maxThumbPixelPosition) {
      const middlePixels =
        this.minThumbPixelPosition +
        (this.maxThumbPixelPosition - this.minThumbPixelPosition) / 2;

      this.setThumbsPosition(
        stepLeft < middlePixels ? "min" : "max",
        ValueConverter.convertPixelToUnits({
          value: stepLeft,
          pixelInOneStep: this.pixelInOneStep,
          stepValue: this.stepValue,
          minValue: this.minValue,
        }),
      );
    }
  }

  private _validateDoublePosition(
    type: "min" | "max",
    value: number | null,
  ): number {
    if (value === null) {
      throw new Error();
    }

    if (this.maxPosition && type === "max" && value <= this.minPosition) {
      return this.minPosition + this.stepValue;
    }

    return value;
  }

  private _getNewThumbCord({
    clientEvent,
    clientLineCoordinatesOffset,
    clientLineCoordinatesSize,
    clientThumbCoordinatesSize,
    shiftClickThumb,
  }: GetNewThumbCordData): number {
    let newLeft = clientEvent - shiftClickThumb - clientLineCoordinatesOffset;

    //подгоним движение под шаг
    newLeft = this._equatePixelValueToStep(newLeft);

    // курсор вышел из слайдера => оставить бегунок в его границах.
    if (newLeft < 0) {
      newLeft = 0;
    }
    const rightEdge = clientLineCoordinatesSize - clientThumbCoordinatesSize;

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

  private _equateValueToStep(value: number | null): number {
    if (value === null) {
      throw new Error();
    }
    return Math.round(value / this.stepValue) * this.stepValue;
  }

  private _calculatePosition(typeThumb: "min" | "max", value: number): number {
    let position = this._equateValueToStep(value);

    if (this.type === "double") {
      position = this._validateDoublePosition(typeThumb, position);
    }
    return position;
  }
}
export default Model;
