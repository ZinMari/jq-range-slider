export default class SliderMinMaxValueLineView {
  constructor(slider, showMinValueClass, showMaxValueClass) {
    this.wrap = $('<div>').attr({ class: 'slider29__values' });
    this.min = $('<span>').attr({ class: `slider29__value--min ${showMinValueClass}` });
    this.max = $('<span>').attr({ class: `slider29__value--max ${showMaxValueClass}` });

    this.wrap.append(this.min);
    this.wrap.append(this.max);
    slider.prepend(this.wrap);
  }
}
