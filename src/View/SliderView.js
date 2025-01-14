import SliderLineView from './SliderLineView';
import SliderMinMaxValueLineView from './sliderMinMaxValueLineView';
import SliderProgressBar from './SliderProgressbar';
import SliderThumbView from './SliderThumbView';

export default class SliderView {
  constructor({
    slider,
    showMinMaxValue,
    orientation,
    type,
    initialValues,
    elemForShowValueMin,
    elemForShowValueMax,
    elemForInputMin,
    elemForInputMax,
    lineClass,
    progressBarClass,
    thumbClass,
    thumbMinClass,
    thumbMaxClass,
    showMinValueClass,
    showMaxValueClass,
  }) {
    this.slider = slider;
    this.sliderLine = new SliderLineView(slider, lineClass);
    this.sliderProgressBar = new SliderProgressBar(this.sliderLine.item, progressBarClass);
    this.sliderThumbs = [];
    this.sliderOrientation = orientation;
    this.sliderInitialValues = initialValues;
    this.elemForShowValueMin = elemForShowValueMin;
    this.elemForShowValueMax = elemForShowValueMax;
    this.elemForInputMin = elemForInputMin;
    this.elemForInputMax = elemForInputMax;
    this.type = type;

    // создать мин макс
    if (showMinMaxValue) {
      this.sliderMinMaxValueLine = new SliderMinMaxValueLineView(slider, showMinValueClass, showMaxValueClass);
    }

    //создать кнопки
    if (this.type === 'double') {
      let min = new SliderThumbView(this.sliderLine.item);
      min.item.addClass(`slider29__thumb--min ${thumbMinClass}`);
      let max = new SliderThumbView(this.sliderLine.item);
      max.item.addClass(`slider29__thumb--max ${thumbMaxClass}`);

      this.sliderThumbs.push(min, max);
    } else {
      let thumb = new SliderThumbView(this.sliderLine.item)
      thumb.item.addClass(thumbClass);
      this.sliderThumbs.push(thumb);
    }

    // установить ориентацию
    if (this.sliderOrientation === 'vertical') {
      this.setVerticalOrientation();
    }

    this.sliderLength =
      this.sliderOrientation === 'vertical'
        ? this.slider.outerHeight() - this.sliderThumbs[0].item.outerHeight()
        : this.slider.outerWidth() - this.sliderThumbs[0].item.outerWidth();
  }

  setVerticalOrientation() {
    //повернем весь слайдер
    this.slider.addClass('slider29--vertical');

    //повернем линию
    this.sliderLine.item.addClass('slider29__line--vertical');

    //повернем линию со значениями
    if (this.sliderMinMaxValueLine) {
      this.sliderMinMaxValueLine.wrap.addClass('slider29__values--vertical');
    }

    // //повернем кнопки
    this.sliderThumbs.forEach((thumb) => {
      thumb.item.addClass('slider29__thumb--vertical');
    });
  }
}
