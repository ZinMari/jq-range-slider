import type { TModelEvents } from "../../Model/type";
import type { IProgressBarView } from "./type";

class ProgressBarView implements IProgressBarView {
  item: JQuery<HTMLElement>;
  orientation!: "vertical" | "horizontal";

  constructor(progressBarClass: string) {
    this.item = $("<span>", {
      class: `slider__progressbar ${progressBarClass}`,
    });
  }

  update = (dataObject: TModelEvents["modelProgressbarUpdated"]): void => {
    this.item.removeAttr("style");
    if (dataObject.orientation === "vertical") {
      this.item.css({
        transform: `translateY(${dataObject.from}px)`,
        width: "100%",
        height: dataObject.to,
      });
    }

    if (dataObject.orientation === "horizontal") {
      this.item.css({
        transform: `translateX(${dataObject.from}px)`,
        height: "100%",
        width: dataObject.to,
      });
    }
  };
}

export default ProgressBarView;
