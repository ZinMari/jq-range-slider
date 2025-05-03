class LineView implements BaseSubViewInterface {
  item: JQuery<HTMLElement>;
  constructor(slider: JQuery<HTMLElement>, lineClass: string) {
    this.item = $('<div>', { class: `alexandr__line ${lineClass}` });
    slider.append(this.item);
  }
}

export default LineView;
