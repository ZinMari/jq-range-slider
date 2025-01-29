export default class SliderProgressBar implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;
  constructor(sliderLine: JQuery<HTMLElement>, progressBarClass: string) {
    this.item = $('<span>', { class: `alexandr__progressbar ${progressBarClass}` });
    sliderLine.append(this.item);
  }
}
