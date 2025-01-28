export default class SliderThumbView {
    item: any;
  constructor(sliderLine: any) {
    this.item = $('<span>', { class: 'alexandr__thumb' });
    sliderLine.append(this.item);
  }
}
