export default class SliderRulerView {
  constructor(slider) {
    this.item = $('<div>', { class: 'alexandr__ruler' });
    this.dividings = new Array(4);

    for (let i = 0; i < this.dividings.length; i++) {
      this.dividings[i] = $('<a>', { class: 'alexandr__dividing', href: '#' });
      this.item.append(this.dividings[i]);
    }

    slider.append(this.item);
  }
}
