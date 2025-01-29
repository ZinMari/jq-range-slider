export default class SliderThumbView {
  item: JQuery<HTMLElement>;
  constructor(sliderLine: JQuery<HTMLElement>) {
    this.item = $('<span>', { class: 'alexandr__thumb' });
    sliderLine.append(this.item);
  }
}
