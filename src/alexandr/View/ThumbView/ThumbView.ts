import Observer from "../../Observer/Observer";

class ThumbView
  extends Observer<SubViewEvents>
  implements BaseSubViewInterface
{
  item: JQuery<HTMLElement>;

  constructor(sliderLine: JQuery<HTMLElement>, userClass: string) {
    super();
    this.item = $("<span>", { class: `alexandr__thumb ${userClass}` });

    this.item[0].addEventListener("pointerdown", this.handler);

    sliderLine.append(this.item);
  }

  showFlug() {
    this.item.addClass("flag");
  }

  hideFlug() {
    this.item.removeClass("flag");
  }

  updateFlagValue(position: number): void {
    this.item.attr("data-value", position);
  }

  private handler = (event: PointerEvent) => {
    event.preventDefault();
    const $currenThumb = $(event.target);

    this.notify("updateValues", { $currenThumb: $currenThumb, event: event });
  };
}

export default ThumbView;
