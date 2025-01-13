export default class SliderThumbView {
  constructor(sliderLine) {
    this.item = $('<span>', { class: 'slider29__thumb' });
    sliderLine.append(this.item);
  }
}
