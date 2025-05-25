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

  update(styleobject: { [key: string]: string | number }): void {
    this.item.css(styleobject);
  }
}

export default ProgressBarView;
