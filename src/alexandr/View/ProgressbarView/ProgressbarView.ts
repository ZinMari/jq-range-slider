import Observer from "../../Observer/Observer";

class ProgressBarView
  extends Observer<SubViewEvents>
  implements BaseSubViewInterface
{
  item: JQuery<HTMLElement>;
  constructor(sliderLine: JQuery<HTMLElement>, progressBarClass: string) {
    super();
    this.item = $("<span>", {
      class: `alexandr__progressbar ${progressBarClass}`,
    });
    sliderLine.append(this.item);
  }

  update(styleobject: ProgressBarData): void {
    this.item.css(styleobject as { [key: string]: string | number });
  }
}

export default ProgressBarView;
