export default class SliderProgressBar {
  constructor(sliderLine, progressBarClass) {
    this.item = $('<span>', { class: `alexandr__progressbar ${progressBarClass}` });
    sliderLine.append(this.item);
  }
}
