import Observer from "../../Observer/Observer";

class ThumbView extends Observer<ThumbViewEvents> {
  item: JQuery<HTMLElement>;
  line: LineViewInterface;
  orientation: "vertical" | "horizontal";
  type: "single" | "double";
  pixelInOneStep: number;
  private minThumbPixelPosition: number | undefined;
  private maxThumbPixelPosition: number | undefined;

  constructor(
    sliderLine: LineViewInterface,
    orientation: "vertical" | "horizontal",
    type: "single" | "double",
    pixelInOneStep: number,
    userClass: string,
  ) {
    super();
    this.line = sliderLine;
    this.orientation = orientation;
    this.type = type;
    this.pixelInOneStep = pixelInOneStep;
    this.item = $("<span>", { class: `alexandr__thumb ${userClass}` });

    this.item[0].addEventListener("pointerdown", this.handler);
    this.line.item.append(this.item);
  }

  showFlug() {
    this.item.addClass("flag");
  }

  hideFlug() {
    this.item.removeClass("flag");
  }

  updateFlagValue(position: number): void {
    this.item.attr("data-value", position);
  }

  private handler = (event: PointerEvent) => {
    event.preventDefault();
    const $currenThumb = $(event.target);
    const sliderLineCoords = this.line._getCoords();

    const leftCurrentThumbCoords = $currenThumb.offset().left + window.scrollX;
    const topCurrentThumbCoords = $currenThumb.offset().top + +window.scrollY;
    const widthCurrentThumbCoords =
      leftCurrentThumbCoords + this.item.outerWidth() - leftCurrentThumbCoords;
    const heightCurrentThumbCoords =
      topCurrentThumbCoords + this.item.outerHeight() - topCurrentThumbCoords;

    // разница между кликом и началок кнопки
    const shiftClickThumb: number = this._getShiftThumb({
      event: event,
      topCurrentThumbCoords: topCurrentThumbCoords,
      leftCurrentThumbCoords: leftCurrentThumbCoords,
      orientation: this.orientation,
    });

    const onMouseMove = (event: PointerEvent): void => {
      const options = {
        event: event,
        shiftClickThumb: shiftClickThumb,
        sliderLineCoords: sliderLineCoords,
        leftCurrentThumbCoords: leftCurrentThumbCoords,
        topCurrentThumbCoords: topCurrentThumbCoords,
        widthCurrentThumbCoords: widthCurrentThumbCoords,
        heightCurrentThumbCoords: heightCurrentThumbCoords,
      };

      let value: number = this._getNewThumbCord(options);

      // проверим, чтобы не сталкивались
      if (this.type === "double") {
        value = this._validateDoubleThumbValue({
          currenThumb: $currenThumb,
          value: value,
          minThumbPixelPosition: this.minThumbPixelPosition,
          maxThumbPixelPosition: this.maxThumbPixelPosition,
          pixelInOneStep: this.pixelInOneStep,
        });
      }

      if ($currenThumb.prop("classList").contains("alexandr__thumb--max")) {
        this.notify("thumbsPositionChanged", {
          type: "max",
          currentValue: value,
        });
      } else {
        this.notify("thumbsPositionChanged", {
          type: "min",
          currentValue: value,
        });
      }
    };

    function onMouseUp() {
      document.removeEventListener("pointerup", onMouseUp);
      document.removeEventListener("pointermove", onMouseMove);
    }

    document.addEventListener("pointermove", onMouseMove);
    document.addEventListener("pointerup", onMouseUp);
  };

  private _getShiftThumb({
    event,
    topCurrentThumbCoords,
    leftCurrentThumbCoords,
    orientation,
  }: {
    event: PointerEvent;
    topCurrentThumbCoords: number;
    leftCurrentThumbCoords: number;
    orientation: string;
  }): number {
    if (orientation === "vertical") {
      return event.pageY - topCurrentThumbCoords;
    } else {
      return event.pageX - leftCurrentThumbCoords;
    }
  }

  private _getNewThumbCord({
    event,
    shiftClickThumb,
    sliderLineCoords,
    leftCurrentThumbCoords,
    topCurrentThumbCoords,
    widthCurrentThumbCoords,
    heightCurrentThumbCoords,
  }: {
    event: MouseEvent;
    shiftClickThumb: number;
    sliderLineCoords: ElementsCoords;
    leftCurrentThumbCoords: number;
    topCurrentThumbCoords: number;
    widthCurrentThumbCoords: number;
    heightCurrentThumbCoords: number;
  }): number {
    let clientEvent;
    let clientLineCoordsOffset;
    let clientLineCoordsSize;
    let clientThumbCoordsSize;
    if (this.orientation === "vertical") {
      clientEvent = event.pageY;

      clientLineCoordsOffset = sliderLineCoords.top;
      clientLineCoordsSize = sliderLineCoords.height;
      clientThumbCoordsSize = heightCurrentThumbCoords;
    } else {
      clientEvent = event.pageX;
      clientLineCoordsOffset = sliderLineCoords.left;
      clientLineCoordsSize = sliderLineCoords.width;
      clientThumbCoordsSize = widthCurrentThumbCoords;
    }

    let newLeft = clientEvent - shiftClickThumb - clientLineCoordsOffset;

    //подгоним движение под шаг
    newLeft = this._equateValueToStep(newLeft);

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

  private _equateValueToStep(value: number): number {
    if (isNaN(value)) {
      throw new Error("Получено NaN");
    }

    return Math.round(value / this.pixelInOneStep) * this.pixelInOneStep;
  }

  private _validateDoubleThumbValue({
    currenThumb,
    value,
    minThumbPixelPosition,
    maxThumbPixelPosition,
    pixelInOneStep,
  }: {
    currenThumb: JQuery<EventTarget>;
    value: number;
    minThumbPixelPosition: number;
    maxThumbPixelPosition: number;
    pixelInOneStep: number;
  }): number {
    if (
      currenThumb.hasClass("alexandr__thumb--min") &&
      value >= maxThumbPixelPosition - pixelInOneStep
    ) {
      return maxThumbPixelPosition - pixelInOneStep;
    } else if (
      currenThumb.hasClass("alexandr__thumb--max") &&
      value <= minThumbPixelPosition + pixelInOneStep
    ) {
      return this.minThumbPixelPosition + this.pixelInOneStep;
    }
    return value;
  }
}

export default ThumbView;
