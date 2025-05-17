class ProgressBarView implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;
  constructor(sliderLine: JQuery<HTMLElement>, progressBarClass: string) {
    this.item = $('<span>', { class: `alexandr__progressbar ${progressBarClass}` });
    sliderLine.append(this.item);
  }

  update(styleobject: { [key: string]: string | number }): void{
   this.item.css(styleobject);
  }
}

export default ProgressBarView;