import type { IMinMaxValueLine } from "./type";

class MinMaxValueLineView implements IMinMaxValueLine {
  item: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;

  constructor(showMinValueClass: string, showMaxValueClass: string) {
    this.item = $("<div>").attr({ class: "slider__values" });
    this.min = $("<span>").attr({
      class: `slider__value--min ${showMinValueClass}`,
    });
    this.max = $("<span>").attr({
      class: `slider__value--max ${showMaxValueClass}`,
    });

    this.item.append(this.min, this.max);
  }

  update(min: number, max: number): void {
    this.min.text(min);
    this.max.text(max);
  }

  setVerticalOrientation() {
    this.item.addClass("slider__values_type_vertical");
    const width = this.item.parent().outerWidth();
    if (!width) {
      return;
    }
    this.item.height(width);
  }
  setHorizontalOrientation() {
    this.item.removeClass("slider__values_type_vertical");
    this.item.removeAttr("style");
  }
}

export default MinMaxValueLineView;
