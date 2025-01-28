export default class SliderProgressBar {
  item: any;
  constructor(sliderLine: any, progressBarClass: any) {
    this.item = $('<span>', { class: `alexandr__progressbar ${progressBarClass}` });
    sliderLine.append(this.item);
  }
}
