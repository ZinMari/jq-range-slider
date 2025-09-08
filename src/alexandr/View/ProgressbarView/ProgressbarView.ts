import type { ModelEvents } from "../../Model/type";

class ProgressBarView implements ProgressBarView {
  item: JQuery<HTMLElement>;
  orientation: "vertical" | "horizontal";

  constructor(
    progressBarClass: string,
  ) {
    this.item = $("<span>", {
      class: `alexandr__progressbar ${progressBarClass}`,
    });
  }

  update = (dataObject: ModelEvents["modelProgressbarUpdated"]): void => {
    this.item.removeAttr("style");
    if (dataObject.orientation === "vertical") {
      this.item.css({
        top: dataObject.from,
        width: "100%",
        height: dataObject.to,
      });
    }

    if (dataObject.orientation === "horizontal") {
      this.item.css({
        left: dataObject.from,
        height: "100%",
        width: dataObject.to,
      });
    }
  };
}

export default ProgressBarView;
