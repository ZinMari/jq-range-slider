export default class SliderLineView {
  constructor(slider, lineClass) {
    this.item = $('<div>', { class: `alexandr__line ${lineClass}` });
    slider.append(this.item);
  }
}
