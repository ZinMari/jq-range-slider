class MinMaxValueLineView implements MinMaxValueLineView {
  wrap: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;
  constructor(slider: JQuery<HTMLElement>, showMinValueClass: string, showMaxValueClass: string) {
    this.wrap = $('<div>').attr({ class: 'alexandr__values' });
    this.min = $('<span>').attr({ class: `alexandr__value--min ${showMinValueClass}` });
    this.max = $('<span>').attr({ class: `alexandr__value--max ${showMaxValueClass}` });

    this.wrap.append(this.min, this.max);
    slider.prepend(this.wrap);
  }
}

export default MinMaxValueLineView;