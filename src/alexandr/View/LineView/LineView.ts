import Observer from "../../Observer/Observer";

class LineView extends Observer<SubViewEvents> implements LineViewInterface {
  item: JQuery<HTMLElement>;
  constructor(slider: JQuery<HTMLElement>, lineClass: string) {
    super();
    this.item = $("<div>", { class: `alexandr__line ${lineClass}` });

    this.item[0].addEventListener("pointerdown", this.handler);

    slider.append(this.item);
  }

  handler = (event: PointerEvent) => {
    event.preventDefault();
    const target = event.currentTarget;

    if (target instanceof HTMLElement) {
      if (target.classList.contains("alexandr__thumb")) {
        return;
      }
    }

    this.notify("clicOnSlider", {
      pageX: event.pageX,
      pageY: event.pageY,
      item: this.item,
    });
  };

  _getCoords(): ElementsCoords {
    const boxLeft = this.item.offset().left;
    const boxRight = boxLeft + this.item.outerWidth();
    const boxTop = this.item.offset().top;
    const boxBottom = boxTop + this.item.outerHeight();

    return {
      left: boxLeft + window.scrollX,
      width: boxRight - boxLeft,
      top: boxTop + window.scrollY,
      height: boxBottom - boxTop,
    };
  }

  setVerticalOrientation(height: number) {
    this.item.addClass("alexandr__line_type_vertical");
    this.item.height(height);
  }
}

export default LineView;
