import Observer from "../../Observer/Observer";
import handlerClickOnSlider from "../../utils/handlerClickOnSlider";

import type { SubViewEvents } from "../type";
import type { LineViewInterface } from "./type";

class LineView extends Observer<SubViewEvents> implements LineViewInterface {
  item: JQuery<HTMLElement>;
  orientation: "horizontal" | "vertical";

  constructor(lineClass: string) {
    super();
    this.item = $("<div>", { class: `alexandr__line ${lineClass}` });

    this.item[0].addEventListener("pointerdown", this.handler);
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

  setVerticalOrientation() {
    this.orientation = "vertical";
    this.item.addClass("alexandr__line_type_vertical");
    this.item.height(this.item.parent().outerWidth());
  }

  setHorizontalOrientation() {
    this.orientation = "horizontal";
    this.item.removeAttr("style");
    this.item.removeClass("alexandr__line_type_vertical");
  }

  destroy(typeEvent: keyof SubViewEvents) {
    this.removeAllSubscribers(typeEvent);
  }
}

export default LineView;
