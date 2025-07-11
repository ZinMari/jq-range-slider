class ProgressBarView implements ProgressBarView {
  item: JQuery<HTMLElement>;
  orientation: "vertical" | "horizontal";

  constructor(
    progressBarClass: string,
    orientation: "vertical" | "horizontal",
  ) {
    this.orientation = orientation;
    this.item = $("<span>", {
      class: `alexandr__progressbar ${progressBarClass}`,
    });
  }

  update = (dataObject: { from: number; to: number }): void => {
    if (this.orientation === "vertical") {
      this.item.css({
        top: dataObject.from,
        width: "100%",
        height: dataObject.to,
      });
    }

    if (this.orientation === "horizontal") {
      this.item.css({
        left: dataObject.from,
        height: "100%",
        width: dataObject.to,
      });
    }
  };
}

export default ProgressBarView;
