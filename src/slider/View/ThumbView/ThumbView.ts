import Observer from "../../Observer/Observer";
import getCoords from "../../utils/getCoords";

import type { ILineView } from "../LineView/type";
import type { TModelEvents } from "../../Model/type";
import type { IThumbView, TThumbViewEvents, TUpdateThumbData } from "./type";

class ThumbView extends Observer<TThumbViewEvents> implements IThumbView {
  item: JQuery<HTMLElement>;
  line: ILineView;
  orientation: "vertical" | "horizontal";
  type: "single" | "double";
  minThumb: JQuery<HTMLElement>;
  maxThumb: JQuery<HTMLElement> | undefined;

  constructor({
    sliderLine,
    thumbMinClass,
    thumbMaxClass,
  }: {
    sliderLine: ILineView;
    thumbMinClass: string;
    thumbMaxClass: string;
  }) {
    super();
    this.line = sliderLine;

    this._createThumbs({ thumbMinClass, thumbMaxClass });
  }

  private _createThumbs({
    thumbMinClass,
    thumbMaxClass,
  }: {
    thumbMinClass: string;
    thumbMaxClass: string;
  }): void {
    this.minThumb = this._createThumb(`slider__thumb--min ${thumbMinClass}`);
    this.maxThumb = this._createThumb(`slider__thumb--max ${thumbMaxClass}`);

    if (this.type === "single") {
      this.maxThumb.addClass("slider__thumb_hidden");
    }
  }

  private _createThumb(userClass: string) {
    const thumb = $("<span>", { class: `slider__thumb ${userClass}` });
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

      const options: TUpdateThumbData = {
        type: $currentThumb.prop("classList").contains("slider__thumb--max")
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

  setOrientation(orientation: "vertical" | "horizontal") {
    this.orientation = orientation;
    if (orientation === "vertical") {
      this.minThumb?.addClass("slider__thumb_type_vertical");
      this.maxThumb?.addClass("slider__thumb_type_vertical");
    } else {
      this.minThumb?.removeClass("slider__thumb_type_vertical");
      this.maxThumb?.removeClass("slider__thumb_type_vertical");
    }
    this.minThumb?.removeAttr("style");
    this.maxThumb?.removeAttr("style");
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

  updateType({ type }: TModelEvents["modelTypeChanged"]) {
    this.type = type;

    if (this.type === "single") {
      this.maxThumb.addClass("slider__thumb_hidden");
    } else {
      this.maxThumb.removeClass("slider__thumb_hidden");
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
