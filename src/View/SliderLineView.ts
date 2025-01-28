export default class SliderLineView {
  item: any;
  constructor(slider: any, lineClass: any) {
    this.item = $('<div>', { class: `alexandr__line ${lineClass}` });
    slider.append(this.item);
  }
}
