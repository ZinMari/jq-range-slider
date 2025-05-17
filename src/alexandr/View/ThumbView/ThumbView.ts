class ThumbView implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;

  constructor(sliderLine: JQuery<HTMLElement>, handler: any, userClass: string) {
    this.item = $('<span>', { class: `alexandr__thumb ${userClass}` });

    this.item[0].addEventListener("pointerdown", handler);
    
    sliderLine.append(this.item);
  }

  showFlug(){
    this.item.addClass("flag");
  }

  hideFlug(){
    this.item.removeClass("flag");
  }

  updateFlagValue(position: number): void {
    this.item.attr("data-value", position);
  }
  
}

export default ThumbView;