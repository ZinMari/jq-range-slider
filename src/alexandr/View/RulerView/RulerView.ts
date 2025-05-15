class RulerView implements RulerView {
  item: JQuery<HTMLElement>;
  dividings: JQuery<HTMLElement>[];
  countDivivdings: number = 4;

  constructor(slider: JQuery<HTMLElement>, handler: any) {
    this.item = $('<div>', { class: 'alexandr__ruler' });
    this.dividings = new Array(this.countDivivdings);

    for (let i = 0; i < this.countDivivdings; i++) {
      this.dividings[i] = $('<a>', { class: 'alexandr__dividing', href: '#' });
      this.item.append(this.dividings[i]);
    }

    this.item[0].addEventListener("click", handler);

    slider.append(this.item);
  }
}

export default RulerView;
