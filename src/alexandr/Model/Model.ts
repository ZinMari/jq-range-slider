import Observer from "../Observer/Observer";
import ValueConverter from "../utils/ValueConverter";

class Model extends Observer<ModelEvents> {
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
  valueConverter: any;

  init({
    minValue,
    maxValue,
    minPosition,
    maxPosition,
    stepValue,
    type,
    orientation,
  }: AlexandrSettings): void {
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
  }

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
  }

  setThumbsPosition = (typeThumb: "min" | "max", value: number): void => {
    let newPosition = this._equateValueToStep(value);

    newPosition = this._validatePosition(newPosition);

    if (this.type === "double") {
      newPosition = this._validateDoublePosition(typeThumb, newPosition);
    }

    this[`${typeThumb}Position`] = newPosition;
    this[`${typeThumb}ThumbPixelPosition`] =
      this.valueConverter.convertUnitsToPixels({
        units: this[`${typeThumb}Position`],
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
    if (this.type === "single") {
      if (this.orientation === "vertical") {
        const coordsThumbStart =
          this.minThumbPixelPosition + this.minThumbHeight / 2 + "px";

        this.notify("modelProressbarUpdated", {
          top: 0,
          width: "100%",
          height: coordsThumbStart,
        });
      }
      if (this.orientation === "horizontal") {
        const coordsThumbStart =
          this.minThumbPixelPosition + this.minThumbWidth / 2 + "px";

        this.notify("modelProressbarUpdated", {
          left: 0,
          width: coordsThumbStart,
          height: "100%",
        });
      }
    }
    if (this.type === "double") {
      if (this.orientation === "vertical") {
        const coordsThumbMin =
          this.minThumbPixelPosition + this.minThumbHeight / 2;
        const coordsThumbMax =
          this.maxThumbPixelPosition + this.maxThumbHeight / 2;

        this.notify("modelProressbarUpdated", {
          left: 0,
          height: coordsThumbMax - coordsThumbMin + "px",
          width: "100%",
          top: coordsThumbMin,
        });
      }
      if (this.orientation === "horizontal") {
        const coordsThumbMin =
          this.minThumbPixelPosition + this.minThumbWidth / 2;
        const coordsThumbMax =
          this.maxThumbPixelPosition + this.maxThumbWidth / 2;

        this.notify("modelProressbarUpdated", {
          left: coordsThumbMin + "px",
          height: "100%",
          width: coordsThumbMax - coordsThumbMin + "px",
        });
      }
    }
  };

  setMinValue(minValue: number): void {
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

    this.notify("modelStepValueChenged", { stepValue: this.stepValue });
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
        pixel: value,
        pixelInOneStep: this.pixelInOneStep,
        stepValue: this.stepValue,
        minValue: this.minValue,
      }),
    );
  };

  modelClicOnSlider(options: ClicOnSliderData) {
    const sliderLineCoords = this._getCoords(options.item);

    // на скольких пикселях от линии произошел клик
    const pixelClick =
      this.moveDirection === "left"
        ? options.pageX - sliderLineCoords.left
        : options.pageY - sliderLineCoords.top;

    const stepLeft = this._equatePixelValueToStep(pixelClick);

    if (this.type === "single") {
      this.setThumbsPosition(
        "min",
        this.valueConverter.convertPixelToUnits({
          pixel: stepLeft,
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
            pixel: stepLeft,
            pixelInOneStep: this.pixelInOneStep,
            stepValue: this.stepValue,
            minValue: this.minValue,
          }),
        );
      } else {
        this.setThumbsPosition(
          "max",
          this.valueConverter.convertPixelToUnits({
            pixel: stepLeft,
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
  }: any): number {
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

  private _getCoords(elem: JQuery<EventTarget>): ElementsCoords {
    const boxLeft = elem.offset().left;
    const boxRight = boxLeft + elem.outerWidth();
    const boxTop = elem.offset().top;
    const boxBottom = boxTop + elem.outerHeight();

    return {
      left: boxLeft + window.scrollX,
      width: boxRight - boxLeft,
      top: boxTop + window.scrollY,
      height: boxBottom - boxTop,
    };
  }

  private _equatePixelValueToStep(value: number): number {
    if (isNaN(value)) {
      throw new Error("Получено NaN");
    }
    return Math.round(value / this.pixelInOneStep) * this.pixelInOneStep;
  }

  private _equateValueToStep(value: number): number {
    return Math.round(value / this.stepValue) * this.stepValue || this.minValue;
  }
}
export default Model;
