class RulerView implements RulerView {
  item: JQuery<HTMLElement>;
  dividings: JQuery<HTMLElement>[];
  countDivivdings: number = 4;

  constructor(slider: JQuery<HTMLElement>, veiwHandler: any) {
    this.item = $("<div>", { class: "alexandr__ruler" });
    this.dividings = new Array(this.countDivivdings);

    for (let i = 0; i < this.countDivivdings; i++) {
      this.dividings[i] = $("<a>", { class: "alexandr__dividing", href: "#" });
      this.item.append(this.dividings[i]);
    }

    this.item[0].addEventListener(
      "pointerdown",
      this.handler.bind(this, veiwHandler),
    );

    slider.append(this.item);
  }

  update(min: number, max: number): void {
    const stepRuler = (max - min) / (this.dividings.length - 1);

    $.each(this.dividings, function () {
      this.attr("data-dividing", Math.round(min));
      min += stepRuler;
    });
  }

  showRuler(): void {
    this.item.removeClass("alexandr__ruler_none");
  }

  hideRuler(): void {
    this.item.addClass("alexandr__ruler_none");
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

export default RulerView;
