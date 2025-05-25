class LineView implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;
  constructor(
    slider: JQuery<HTMLElement>,
    lineClass: string,
    veiwHandler: any,
  ) {
    this.item = $("<div>", { class: `alexandr__line ${lineClass}` });

    this.item[0].addEventListener(
      "pointerdown",
      this.handler.bind(this, veiwHandler),
    );

    slider.append(this.item);
  }

  handler(veiwHandler: any, event: PointerEvent) {
    event.preventDefault();
    const target = event.currentTarget;

    if (target instanceof HTMLElement) {
      if (target.classList.contains("alexandr__thumb")) {
        return;
      }
    }

    veiwHandler(event.pageX, event.pageY);
  }
}

export default LineView;
