class ThumbView implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;

  constructor(sliderLine: JQuery<HTMLElement>, handler: any) {
    this.item = $('<span>', { class: 'alexandr__thumb' });

    this.item[0].addEventListener("pointerdown", handler);
    
    sliderLine.append(this.item);
  }
}

export default ThumbView;