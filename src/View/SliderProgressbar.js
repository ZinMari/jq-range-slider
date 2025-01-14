export default class SliderProgressBar {
  constructor(sliderLine, progressBarClass) {
    this.item = $('<span>', { class: `slider29__progressbar ${progressBarClass}`});
    sliderLine.append(this.item);
  }
}
