export default class SliderLineView {
  item: JQuery<HTMLElement>;
  constructor(slider: JQuery<HTMLElement>, lineClass: string) {
    this.item = $('<div>', { class: `alexandr__line ${lineClass}` });
    slider.append(this.item);
  }
}
