import Observer from "../../Observer/Observer";
import getCoords from "../../utils/getCoords";

class ThumbView extends Observer<ThumbViewEvents> implements ThumbView {
  item: JQuery<HTMLElement>;
  line: LineViewInterface;
  orientation: "vertical" | "horizontal";
  type: "single" | "double";
  minThumb: JQuery<HTMLElement>;
  maxThumb: JQuery<HTMLElement> | undefined;

  constructor({
    sliderLine,
    orientation,
    type,
    thumbMinClass,
    thumbMaxClass,
    thumbClass,
  }: {
    sliderLine: LineViewInterface;
    orientation: "vertical" | "horizontal";
    type: "single" | "double";
    thumbMinClass: string;
    thumbMaxClass: string;
    thumbClass: string;
  }) {
    super();
    this.line = sliderLine;
    this.orientation = orientation;
    this.type = type;

    this._createThumbs({ thumbMinClass, thumbMaxClass, thumbClass });
  }

  private _createThumbs({
    thumbMinClass,
    thumbMaxClass,
    thumbClass,
  }: {
    thumbMinClass: string;
    thumbMaxClass: string;
    thumbClass: string;
  }): void {
    //создам кнопки
    if (this.type === "double") {
      this.minThumb = this._createThumb(
        `alexandr__thumb--min ${thumbMinClass}`,
      );
      this.maxThumb = this._createThumb(
        `alexandr__thumb--max ${thumbMaxClass}`,
      );
    } else {
      this.minThumb = this._createThumb(thumbClass);
    }
  }

  private _createThumb(userClass: string) {
    const thumb = $("<span>", { class: `alexandr__thumb ${userClass}` });
    thumb[0].addEventListener("pointerdown", this.handler);

    return thumb;
  }

  showFlag() {
    this.minThumb.addClass("flag");
    this.maxThumb?.addClass("flag");
  }

  hideFlag() {
    this.minThumb.removeClass("flag");
    this.maxThumb?.removeClass("flag");
  }

  private handler = (event: PointerEvent) => {
    event.preventDefault();
    const $currentThumb = $(event.target);

    const clickPageX = event.pageX;
    const clickPageY = event.pageY;

    const thumbCoords = getCoords($currentThumb);
    const lineCoords = getCoords(this.line.item);

    // разница между кликом и началок кнопки
    const shiftClickThumb: number = this._getShiftThumb({
      clickPageX,
      clickPageY,
      topClickThumbCoords: thumbCoords.top,
      leftClickThumbCoords: thumbCoords.left,
      orientation: this.orientation,
    });

    const onMouseMove = (event: PointerEvent): void => {
      let clientEvent;
      let clientLineCoordsOffset;
      let clientLineCoordsSize;
      let clientThumbCoordsSize;

      if (this.orientation === "vertical") {
        clientEvent = event.pageY;
        clientLineCoordsOffset = lineCoords.top;
        clientLineCoordsSize = lineCoords.height;
        clientThumbCoordsSize = thumbCoords.height;
      } else {
        clientEvent = event.pageX;
        clientLineCoordsOffset = lineCoords.left;
        clientLineCoordsSize = lineCoords.width;
        clientThumbCoordsSize = thumbCoords.width;
      }

      const options: UpdateThumbData = {
        type: $currentThumb.prop("classList").contains("alexandr__thumb--max")
          ? "max"
          : "min",
        thumbCoords,
        lineCoords,
        shiftClickThumb: shiftClickThumb,
        clientEvent,
        clientLineCoordsOffset,
        clientLineCoordsSize,
        clientThumbCoordsSize,
      };

      this.notify("updateThumbPosition", options);
    };

    function onMouseUp() {
      document.removeEventListener("pointerup", onMouseUp);
      document.removeEventListener("pointermove", onMouseMove);
    }

    document.addEventListener("pointermove", onMouseMove);
    document.addEventListener("pointerup", onMouseUp);
  };

  setVerticalOrientation() {
    this.minThumb?.addClass("alexandr__thumb_type_vertical");
    this.maxThumb?.addClass("alexandr__thumb_type_vertical");
  }

  updateFlagValues(thumb: "min" | "max", currentValue: number): void {
    if (thumb === "min") {
      this.minThumb.attr("data-value", currentValue);
    } else if (this.type === "double" && thumb === "max") {
      this.maxThumb.attr("data-value", currentValue);
    }
  }

  updateThumbsPosition(
    thumb: "min" | "max",
    position: number,
    moveDirection: "top" | "left",
  ): void {
    if (thumb === "min") {
      this.minThumb.css({ [moveDirection]: position });
    } else if (this.type === "double" && thumb === "max") {
      this.maxThumb.css({ [moveDirection]: position });
    }
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
}

export default ThumbView;
