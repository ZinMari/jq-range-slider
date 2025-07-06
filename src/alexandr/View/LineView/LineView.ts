import Observer from "../../Observer/Observer";
import handlerClickOnSlider from "../../utils/handlerClickOnSlider";

class LineView extends Observer<SubViewEvents> implements LineViewInterface {
  item: JQuery<HTMLElement>;
  orientation: "horizontal" | "vertical";

  constructor(
    slider: JQuery<HTMLElement>,
    lineClass: string,
    orientation: "horizontal" | "vertical",
  ) {
    super();
    this.orientation = orientation;
    this.item = $("<div>", { class: `alexandr__line ${lineClass}` });

    this.item[0].addEventListener("pointerdown", this.handler);

    slider.append(this.item);
  }

  handler = (event: PointerEvent) => {
    handlerClickOnSlider.call(
      this,
      event,
      this.item,
      this.orientation,
      this.notify.bind(this),
    );
  };

  setVerticalOrientation(height: number) {
    this.item.addClass("alexandr__line_type_vertical");
    this.item.height(height);
  }
}

export default LineView;
