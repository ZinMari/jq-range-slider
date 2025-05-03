class ThumbView implements BaseSubViewInterface{
  item: JQuery<HTMLElement>;
  constructor(sliderLine: JQuery<HTMLElement>) {
    this.item = $('<span>', { class: 'alexandr__thumb' });
    sliderLine.append(this.item);
  }
}

export default ThumbView;