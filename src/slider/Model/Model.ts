import Observer from "../Observer/Observer";
import ValueConverter from "../utils/ValueConverter/ValueConverter";

import type { TUpdateThumbData } from "../View/ThumbView/type";
import type { TViewCoordinates } from "../View/View/type";
import type { GetNewThumbCordData, IModel, TModelEvents } from "./type";
import type { TSliderSettings } from "../type";

class Model extends Observer<TModelEvents> implements IModel {
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
    this.valueConverter = new ValueConverter();

    this.type = type;
    this.orientation = orientation;
    this.moveDirection = this.orientation === "vertical" ? "top" : "left";

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
    if (this.type === "double") {
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

    if (this.type === "double") {
      //проверю на пограничные максимальное
      this.maxPosition =
        this.maxPosition > this.maxValue ? this.maxValue : this.maxPosition;

      this.maxPosition =
        this.maxPosition < this.minValue ? this.minValue : this.maxPosition;
    }
  }

  refreshOptions = (options: TSliderSettings): void => {
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
    if ("showValueFlag" in options) {
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
    this.setThumbsPosition("max", this.maxPosition);
  };

  setOrientation = (orientation: "vertical" | "horizontal") => {
    this.orientation = orientation;
    this.moveDirection = this.orientation === "vertical" ? "top" : "left";

    this.notify("modelOrientationChanged", {
      orientation,
    });
    this.setThumbsPosition("min", this.minPosition);
    if (this.type === "double") {
      this.setThumbsPosition("max", this.maxPosition);
    }
  };

  setThumbsPosition = (typeThumb: "min" | "max", value: number): void => {
    if (value === null) {
      return;
    } else {
      this[`${typeThumb}Position`] = value;

      this[`${typeThumb}Position`] = this._equateValueToStep(
        this[`${typeThumb}Position`],
      );

      if (this.type === "double") {
        this[`${typeThumb}Position`] = this._validateDoublePosition(
          typeThumb,
          this[`${typeThumb}Position`],
        );
      }

      this._normalizeMinMaxPositions();

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
    }
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
      orientation: this.orientation,
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
    this.stepValue = stepValue;
    this._normalizeStepValue();
    this.pixelInOneStep = this.valueConverter.pixelInOneStep({
      sliderLength: this.sliderLength,
      max: this.maxValue,
      min: this.minValue,
      step: this.stepValue,
    });

    this.notify("modelStepValueChanged", { stepValue: this.stepValue });
  }

  updateThumbPosition = (options: TUpdateThumbData) => {
    let value: number = this._getNewThumbCord({
      clientEvent: options.clientEvent,
      clientLineCoordinatesOffset: options.clientLineCoordinatesOffset,
      clientLineCoordinatesSize: options.clientLineCoordinatesSize,
      clientThumbCoordinatesSize: options.clientThumbCoordinatesSize,
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

  private _equateValueToStep(value: number): number {
    return Math.round(value / this.stepValue) * this.stepValue;
  }
}
export default Model;
