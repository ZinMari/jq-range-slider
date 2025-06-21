import Observer from "../Observer/Observer";

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

  init({
    minValue,
    maxValue,
    minPosition,
    maxPosition,
    stepValue,
    type,
    orientation,
  }: AlexandrSettings): void {
    this.type = type;
    this.orientation = orientation;
    this.moveDirection = this.orientation === "vertical" ? "top" : "left";
    this.setMaxValue(Number(maxValue));
    this.setMinValue(Number(minValue));
    this.setStepValue(Number(stepValue));
    this.setMaxValue(Number(maxValue));
    this.setMinPosition(Number(minPosition));
    if (this.type === "double") {
      this.setMaxPosition(Number(maxPosition));
    }
  }

  modelGetCordsView = (dataObject: any) => {
    this.sliderLength = dataObject.sliderLength;
    this.minThumbWidth = dataObject.minThumbWidth;
    this.minThumbHeight = dataObject.minThumbHeight;
    this.maxThumbWidth = dataObject.maxThumbWidth;
    this.maxThumbHeight = dataObject.maxThumbHeight;

    this.setPixelInOneStep();
  };

  setPixelInOneStep = () => {
    this.pixelInOneStep =
      (this.sliderLength / (this.maxValue - this.minValue)) * this.stepValue ||
      1;
  };

  setMinPosition = (minPosition: number): void => {
    const typeValue = "min";

    let newPosition = this._equateValueToStep(minPosition);
    newPosition = this._validatePosition(newPosition);
    if (this.type === "double") {
      newPosition = this._validateDoublePosition(typeValue, newPosition);
    }

    this.minPosition = newPosition;
    this.minThumbPixelPosition = this._convertUnitsToPixels(minPosition);

    this.setProgressBarSize();

    this.notify("modelThumbsPositionChanged", {
      type: "min",
      currentValue: this.minPosition,
      pixelPosition: this.minThumbPixelPosition,
      moveDirection: this.moveDirection,
    });
  };

  setMaxPosition = (maxPosition: number): void => {
    const typeValue = "max";
    let newPosition = this._equateValueToStep(maxPosition);
    newPosition = this._validatePosition(newPosition);

    if (this.type === "double") {
      newPosition = this._validateDoublePosition(typeValue, newPosition);
    }

    this.maxPosition = newPosition;
    this.maxThumbPixelPosition = this._convertUnitsToPixels(maxPosition);

    this.setProgressBarSize();

    this.notify("modelThumbsPositionChanged", {
      type: "max",
      currentValue: this.maxPosition,
      pixelPosition: this.maxThumbPixelPosition,
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

  FAKEThumbsPositionChanged = (options: any) => {
    const sliderLineCoords = this._getCoords(options.sliderLine);
    const thumbCoords = this._getCoords(options.thumb);

    // разница между кликом и началок кнопки
    const shiftClickThumb: number = this._getShiftThumb({
      clickPageX: options.clickPageX,
      clickPageY: options.clickPageY,
      topClickThumbCoords: options.topClickThumbCoords,
      leftClickThumbCoords: options.leftClickThumbCoords,
      orientation: this.orientation,
    });

    let value: number = this._getNewThumbCord({
      movePageX: options.movePageX,
      movePageY: options.movePageY,
      shiftClickThumb: shiftClickThumb,
      sliderLineCoords,
      thumbCoords,
    });

    if (options.type === "min") {
      this.setMinPosition(this._convertPixelToUnits(value));
    } else if (options.type === "max") {
      this.setMaxPosition(this._convertPixelToUnits(value));
    }
  };

  modelClicOnSlider(data: any) {
    const sliderLineCoords = this._getCoords(data.item);

    // на скольких пикселях от линии произошел клик
    const pixelClick =
      this.moveDirection === "left"
        ? data.pageX - sliderLineCoords.left
        : data.pageY - sliderLineCoords.top;

    const stepLeft = this._equatePixelValueToStep(pixelClick);

    if (this.type === "single") {
      this.setMinPosition(this._convertPixelToUnits(stepLeft));
    }

    if (this.type === "double") {
      const middlePixels =
        this.minThumbPixelPosition +
        (this.maxThumbPixelPosition - this.minThumbPixelPosition) / 2;

      if (stepLeft < middlePixels) {
        this.setMinPosition(this._convertPixelToUnits(stepLeft));
      } else {
        this.setMaxPosition(this._convertPixelToUnits(stepLeft));
      }
    }
  }

  setMinValue(minValue: number): void {
    this.minValue =
      minValue >= this.maxValue || Number.isNaN(minValue)
        ? this.maxValue - this.stepValue
        : minValue;

    this.notify("modelMinMaxValuesChanged", {
      min: this.minValue,
      max: this.maxValue,
    });
    this.notify("modelStepValueChenged", {
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
    this.notify("modelMinMaxValuesChanged", {
      min: this.minValue,
      max: this.maxValue,
    });
    this.notify("modelStepValueChenged", {
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

    this.notify("modelStepValueChenged", {
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

  private _getNewThumbCord({
    movePageX,
    movePageY,
    shiftClickThumb,
    sliderLineCoords,
    thumbCoords,
  }: {
    movePageX: number;
    movePageY: number;
    shiftClickThumb: number;
    sliderLineCoords: ElementsCoords;
    thumbCoords: ElementsCoords;
  }): number {
    let clientEvent;
    let clientLineCoordsOffset;
    let clientLineCoordsSize;
    let clientThumbCoordsSize;
    if (this.orientation === "vertical") {
      clientEvent = movePageY;

      clientLineCoordsOffset = sliderLineCoords.top;
      clientLineCoordsSize = sliderLineCoords.height;
      clientThumbCoordsSize = thumbCoords.height;
    } else {
      clientEvent = movePageX;
      clientLineCoordsOffset = sliderLineCoords.left;
      clientLineCoordsSize = sliderLineCoords.width;
      clientThumbCoordsSize = thumbCoords.width;
    }

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

  private _getShiftThumb({
    clickPageX,
    clickPageY,
    topClickThumbCoords,
    leftClickThumbCoords,
    orientation,
  }: {
    clickPageX: number;
    clickPageY: number;
    topClickThumbCoords: number;
    leftClickThumbCoords: number;
    orientation: string;
  }): number {
    if (orientation === "vertical") {
      return clickPageY - topClickThumbCoords;
    } else {
      return clickPageX - leftClickThumbCoords;
    }
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

  private _convertPixelToUnits(value: number): number {
    return Math.round(
      (value / this.pixelInOneStep) * this.stepValue + this.minValue,
    );
  }

  private _convertUnitsToPixels(value: number): number {
    const withMinvalue = value - this.minValue;
    const pixels = withMinvalue * (this.pixelInOneStep / this.stepValue);
    return pixels;
  }
}
export default Model;
