export default class SliderProgressBar {
  constructor(sliderLine) {
    this.item = $('<span>');
    this.item.addClass('slider29__progressbar');
    sliderLine.append(this.item);
  }
}
