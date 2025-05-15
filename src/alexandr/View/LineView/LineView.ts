class LineView implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;
  constructor(slider: JQuery<HTMLElement>, lineClass: string, handler: any) {
    this.item = $('<div>', { class: `alexandr__line ${lineClass}` });

    this.item[0].addEventListener("click", handler);

    slider.append(this.item);
  }
}

export default LineView;
