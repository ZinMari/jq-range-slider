export default class SliderMinMaxValueLineView {
  constructor(slider, showMinValueClass, showMaxValueClass) {
    this.wrap = $('<div>').attr({ class: 'alexandr__values' });
    this.min = $('<span>').attr({ class: `alexandr__value--min ${showMinValueClass}` });
    this.max = $('<span>').attr({ class: `alexandr__value--max ${showMaxValueClass}` });

    this.wrap.append(this.min);
    this.wrap.append(this.max);
    slider.prepend(this.wrap);
  }
}
