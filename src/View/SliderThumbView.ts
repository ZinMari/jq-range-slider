export default class SliderThumbView {
  constructor(sliderLine) {
    this.item = $('<span>', { class: 'alexandr__thumb' });
    sliderLine.append(this.item);
  }
}
