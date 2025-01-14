export default class SliderLineView {
  constructor(slider, lineClass) {
    this.item = $('<div>', { class: `slider29__line ${lineClass}`});
    slider.append(this.item);
  }
}
