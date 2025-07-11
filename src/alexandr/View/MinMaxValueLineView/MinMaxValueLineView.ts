class MinMaxValueLineView implements MinMaxValueLineView {
  item: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;

  constructor(showMinValueClass: string, showMaxValueClass: string) {
    this.item = $("<div>").attr({ class: "alexandr__values" });
    this.min = $("<span>").attr({
      class: `alexandr__value--min ${showMinValueClass}`,
    });
    this.max = $("<span>").attr({
      class: `alexandr__value--max ${showMaxValueClass}`,
    });

    this.item.append(this.min, this.max);
  }

  update(min: number, max: number): void {
    this.min.text(min);
    this.max.text(max);
  }

  setVerticalOrientation(height: number) {
    this.item.addClass("alexandr__values_type_vertical");
    this.item.height(height);
  }
}

export default MinMaxValueLineView;
