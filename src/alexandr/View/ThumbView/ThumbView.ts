import Observer from "../../Observer/Observer";

class ThumbView extends Observer<ThumbViewEvents> {
  item: JQuery<HTMLElement>;
  line: LineViewInterface;
  orientation: "vertical" | "horizontal";
  type: "single" | "double";
  pixelInOneStep: number;
  minThumb: JQuery<HTMLElement>;
  maxThumb: JQuery<HTMLElement> | undefined;
  moveDirection: "top" | "left";
  private minThumbPixelPosition: number | undefined;
  private maxThumbPixelPosition: number | undefined;

  constructor({sliderLine, orientation, type, pixelInOneStep, thumbMinClass, thumbMaxClass, thumbClass, moveDirection}:
    {
      sliderLine: LineViewInterface,
      orientation: "vertical" | "horizontal",
      type: "single" | "double",
      pixelInOneStep: number,
      thumbMinClass: string, 
      thumbMaxClass: string,
      thumbClass: string,
      moveDirection: "top" | "left";
  }
  ) {
    super();
    this.line = sliderLine;
    this.orientation = orientation;
    this.type = type;
    this.pixelInOneStep = pixelInOneStep;
    this.moveDirection = moveDirection;

    this._createThumbs({thumbMinClass, thumbMaxClass, thumbClass})
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
      this.minThumb = this._createThumb(`alexandr__thumb--min ${thumbMinClass}`);
      this.maxThumb = this._createThumb(`alexandr__thumb--max ${thumbMaxClass}`);

      this.line.item.append(this.minThumb, this.maxThumb);
    } else {
      this.minThumb = this._createThumb(thumbClass);

      this.line.item.append(this.minThumb);
    }
  }

  private _createThumb(userClass: string){
    const thumb = $("<span>", { class: `alexandr__thumb ${userClass}` });
    thumb[0].addEventListener("pointerdown", this.handler);

    return thumb;
  }

  showFlug() {
    this.minThumb.addClass("flag");
    this.maxThumb?.addClass("flag");
  }

  hideFlug() {
    this.minThumb.removeClass("flag");
    this.maxThumb?.removeClass("flag");
  }

  private handler = (event: PointerEvent) => {
    event.preventDefault();
    const $currenThumb = $(event.target);
    const sliderLineCoords = this.line._getCoords();

    const leftCurrentThumbCoords = $currenThumb.offset().left + window.scrollX;
    const topCurrentThumbCoords = $currenThumb.offset().top + +window.scrollY;
    const widthCurrentThumbCoords =
      leftCurrentThumbCoords + this.minThumb.outerWidth() - leftCurrentThumbCoords;
    const heightCurrentThumbCoords =
      topCurrentThumbCoords + this.minThumb.outerHeight() - topCurrentThumbCoords;

    // разница между кликом и началок кнопки
    const shiftClickThumb: number = this._getShiftThumb({
      event: event,
      topCurrentThumbCoords: topCurrentThumbCoords,
      leftCurrentThumbCoords: leftCurrentThumbCoords,
      orientation: this.orientation,
    });

    const onMouseMove = (event: PointerEvent): void => {
      const options = {
        type: $currenThumb.prop("classList").contains("alexandr__thumb--max") ? "max" : "min",
        event: event,
        shiftClickThumb: shiftClickThumb,
        sliderLineCoords: sliderLineCoords,
        leftCurrentThumbCoords: leftCurrentThumbCoords,
        topCurrentThumbCoords: topCurrentThumbCoords,
        widthCurrentThumbCoords: widthCurrentThumbCoords,
        heightCurrentThumbCoords: heightCurrentThumbCoords,
      };

      this.notify("FAKEthumbsPositionChanged", options);
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

  setVerticalOrientation(){
    this.minThumb?.addClass("alexandr__thumb_type_vertical");
    this.maxThumb?.addClass("alexandr__thumb_type_vertical");
  }

  updateFlagValues(thumb: "min" | "max", position: number): void {
    if (thumb === "min") {
      this.minThumb.attr("data-value", position);
      } else if (this.type === "double" && thumb === "max") {
        this.maxThumb.attr("data-value", position);
      }
    
  }

  updateThumbsPosition(thumb: "min" | "max", position: number): void {
    if (thumb === "min") {
      this.minThumbPixelPosition = position;
      this.minThumb.css({ [this.moveDirection]: position });

    } else if (this.type === "double" && thumb === "max") {
      this.maxThumbPixelPosition = position;
      this.maxThumb.css({ [this.moveDirection]: position });
    }
  }
}

export default ThumbView;
