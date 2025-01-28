export default class SliderMinMaxValueLineView {
  wrap: any;
  min: any;
  max: any;
  constructor(slider: any, showMinValueClass: any, showMaxValueClass: any) {
    this.wrap = $('<div>').attr({ class: 'alexandr__values' });
    this.min = $('<span>').attr({ class: `alexandr__value--min ${showMinValueClass}` });
    this.max = $('<span>').attr({ class: `alexandr__value--max ${showMaxValueClass}` });

    this.wrap.append(this.min);
    this.wrap.append(this.max);
    slider.prepend(this.wrap);
  }
}
