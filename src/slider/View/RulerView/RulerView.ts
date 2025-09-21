// @ts-nocheck
import Observer from "../../Observer/Observer";
import getClickOnSliderHandler from "../../utils/getClickOnSliderHandler";

import type { TSubViewEvents } from "../type";
import type { IRulerView } from "./type";

class RulerView extends Observer<TSubViewEvents> implements IRulerView {
  item: JQuery<HTMLElement>;
  orientation: "horizontal" | "vertical";
  divisions: JQuery<HTMLElement>[];
  countDivisions: number = 4;

  constructor() {
    super();
    this.item = $("<div>", { class: "slider__ruler" });
    this.divisions = new Array(this.countDivisions);

    for (let i = 0; i < this.countDivisions; i++) {
      this.divisions[i] = $("<span>", { class: "slider__dividing" });
      this.item.append(this.divisions[i]);
    }

    this.item[0].addEventListener("pointerdown", this.handler);
  }

  update(min: number, max: number): void {
    const stepRuler = (max - min) / (this.divisions.length - 1);

    $.each(this.divisions, function () {
      this.attr("data-dividing", Math.round(min));
      min += stepRuler;
    });
  }

  showRuler(): void {
    this.item.removeClass("slider__ruler_none");
  }

  hideRuler(): void {
    this.item.addClass("slider__ruler_none");
  }

  handler = (event: PointerEvent) => {
    getClickOnSliderHandler.call(
      this,
      event,
      this.item,
      this.orientation,
      this.notify.bind(this),
    );
  };

  setVerticalOrientation() {
    this.orientation = "vertical";
    this.item.addClass("slider__ruler_type_vertical");
    this.divisions.forEach((elem: JQuery<HTMLElement>) => {
      elem.addClass("slider__dividing_type_vertical");
    });
  }

  setHorizontalOrientation() {
    this.orientation = "horizontal";
    this.item.removeClass("slider__ruler_type_vertical");
    this.divisions.forEach((elem: JQuery<HTMLElement>) => {
      elem.removeClass("slider__dividing_type_vertical");
    });
  }
}

export default RulerView;
