export default class SliderMinMaxValueLineView {
  constructor(slider) {
    this.wrap = $('<div>').attr({ class: 'slider29__values' });
    this.min = $('<span>').attr({ class: 'slider29__value--min' });
    this.max = $('<span>').attr({ class: 'slider29__value--max' });

    this.wrap.append(this.min);
    this.wrap.append(this.max);
    slider.prepend(this.wrap);
  }
}
