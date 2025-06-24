class ProgressBarView {
  item: JQuery<HTMLElement>;
  constructor(sliderLine: JQuery<HTMLElement>, progressBarClass: string) {
    this.item = $("<span>", {
      class: `alexandr__progressbar ${progressBarClass}`,
    });
    sliderLine.append(this.item);
  }

  update = (styleobject: ProgressBarData): void => {
    this.item.css(styleobject);
  };
}

export default ProgressBarView;
