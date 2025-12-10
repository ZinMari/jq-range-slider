import type { TModelEvents } from "../../Model/type";
import type { IProgressBarView } from "./type";

class ProgressBarView implements IProgressBarView {
  item: JQuery<HTMLElement>;

  constructor(progressBarClass: string) {
    this.item = $("<span>", {
      class: `slider__progressbar ${progressBarClass}`,
    });
  }

  update = (dataObject: TModelEvents["modelProgressbarUpdated"]): void => {
    this.item.removeAttr("style");

    if (dataObject.orientation === "vertical") {
      this.item.addClass("slider__progressbar_type_vertical");

      this.item.css({
        transform: `translateY(${dataObject.from}px)`,
        height: dataObject.to,
      });
    }

    if (dataObject.orientation === "horizontal") {
      this.item.removeClass("slider__progressbar_type_vertical");

      this.item.css({
        transform: `translateX(${dataObject.from}px)`,
        width: dataObject.to,
      });
    }
  };
}

export default ProgressBarView;
