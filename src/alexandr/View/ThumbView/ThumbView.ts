import Observer from "../../Observer/Observer";

class ThumbView extends Observer<ThumbViewEvents> {
  item: JQuery<HTMLElement>;
  line: LineViewInterface;
  orientation: "vertical" | "horizontal";
  type: "single" | "double";
  minThumb: JQuery<HTMLElement>;
  maxThumb: JQuery<HTMLElement> | undefined;
  moveDirection: "top" | "left";

  constructor({
    sliderLine,
    orientation,
    type,
    thumbMinClass,
    thumbMaxClass,
    thumbClass,
    moveDirection,
  }: {
    sliderLine: LineViewInterface;
    orientation: "vertical" | "horizontal";
    type: "single" | "double";
    thumbMinClass: string;
    thumbMaxClass: string;
    thumbClass: string;
    moveDirection: "top" | "left";
  }) {
    super();
    this.line = sliderLine;
    this.orientation = orientation;
    this.type = type;
    this.moveDirection = moveDirection;

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

      this.line.item.append(this.minThumb, this.maxThumb);
    } else {
      this.minThumb = this._createThumb(thumbClass);

      this.line.item.append(this.minThumb);
    }
  }

  private _createThumb(userClass: string) {
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

    const clickPageX = event.pageX;
    const clickPageY = event.pageY;

    const leftClickThumbCoords = $currenThumb.offset().left + window.scrollX;
    const topClickThumbCoords = $currenThumb.offset().top + window.scrollY;

    const onMouseMove = (event: PointerEvent): void => {
      const options = {
        clickPageX,
        clickPageY,
        movePageX: event.pageX,
        movePageY: event.pageY,
        type: $currenThumb.prop("classList").contains("alexandr__thumb--max")
          ? "max"
          : "min",
        sliderLine: this.line.item,
        leftClickThumbCoords: leftClickThumbCoords,
        topClickThumbCoords: topClickThumbCoords,
        thumb: $currenThumb,
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

  setVerticalOrientation() {
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
      this.minThumb.css({ [this.moveDirection]: position });
    } else if (this.type === "double" && thumb === "max") {
      this.maxThumb.css({ [this.moveDirection]: position });
    }
  }
}

export default ThumbView;
