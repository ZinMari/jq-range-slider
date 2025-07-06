import Observer from "../../Observer/Observer";
import handlerClickOnSlider from "../../utils/handlerClickOnSlider";

class RulerView extends Observer<SubViewEvents> implements RulerView {
  item: JQuery<HTMLElement>;
  orientation: "horizontal" | "vertical";
  dividings: JQuery<HTMLElement>[];
  countDivivdings: number = 4;

  constructor(
    slider: JQuery<HTMLElement>,
    orientation: "horizontal" | "vertical",
  ) {
    super();
    this.orientation = orientation;
    this.item = $("<div>", { class: "alexandr__ruler" });
    this.dividings = new Array(this.countDivivdings);

    for (let i = 0; i < this.countDivivdings; i++) {
      this.dividings[i] = $("<span>", { class: "alexandr__dividing" });
      this.item.append(this.dividings[i]);
    }

    this.item[0].addEventListener("pointerdown", this.handler);

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

  handler = (event: PointerEvent) => {
    handlerClickOnSlider.call(
      this,
      event,
      this.item,
      this.orientation,
      this.notify.bind(this),
    );
  };

  setVerticalOrientation() {
    this.item.addClass("alexandr__ruler_type_vertical");
    this.dividings.forEach((elem: JQuery<HTMLElement>) => {
      elem.addClass("alexandr__dividing_type_vertical");
    });
  }
}

export default RulerView;
