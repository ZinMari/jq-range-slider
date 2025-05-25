class ThumbView implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;

  constructor(
    sliderLine: JQuery<HTMLElement>,
    viewHandler: any,
    userClass: string,
  ) {
    this.item = $("<span>", { class: `alexandr__thumb ${userClass}` });

    this.item[0].addEventListener(
      "pointerdown",
      this.handler.bind(this, viewHandler),
    );

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

  private handler(viewHandler: any, event: PointerEvent) {
    event.preventDefault();
    const $currenThumb = $(event.target);
    viewHandler(event, $currenThumb);
  }
}

export default ThumbView;
