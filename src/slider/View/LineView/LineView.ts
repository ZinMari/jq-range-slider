import Observer from "../../Observer/Observer";
import getClickOnSliderHandler from "../../utils/getClickOnSliderHandler";

import type { TSubViewEvents } from "../type";
import type { ILineView } from "./type";

class LineView extends Observer<TSubViewEvents> implements ILineView {
  item: JQuery<HTMLElement>;
  orientation: "horizontal" | "vertical";

  constructor(lineClass: string) {
    super();
    this.item = $("<div>", { class: `slider__line ${lineClass}` });

    this.item[0].addEventListener("pointerdown", this.handler);
  }

  handler = (event: PointerEvent) => {
    getClickOnSliderHandler.call(
      this,
      event,
      this.item,
      this.orientation,
      this.notify.bind(this),
    );
  };

  setVerticalOrientation() {
    this.orientation = "vertical";
    this.item.addClass("slider__line_type_vertical");
    this.item.height(this.item.parent().outerWidth());
  }

  setHorizontalOrientation() {
    this.orientation = "horizontal";
    this.item.removeAttr("style");
    this.item.removeClass("slider__line_type_vertical");
  }

  destroy(typeEvent: keyof TSubViewEvents) {
    this.removeAllSubscribers(typeEvent);
  }
}

export default LineView;
