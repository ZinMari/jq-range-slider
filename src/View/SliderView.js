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
    showInput,
    showValueFlag,
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
    this.showInput = showInput;
    this.showValueFlag = showValueFlag;
    this.inputs = [];
    this.thumbClass = thumbClass;
    this.thumbMinClass = thumbMinClass;
    this.thumbMaxClass = thumbMaxClass;
    // создать мин макс
    if (showMinMaxValue) {
      this.sliderMinMaxValueLine = new SliderMinMaxValueLineView(
        slider,
        showMinValueClass,
        showMaxValueClass,
      );
    }
  }

  init(presenter) {
    this.presenter = presenter;
    //создать кнопки
    if (this.type === 'double') {
      let min = new SliderThumbView(this.sliderLine.item);
      min.item.addClass(`slider29__thumb--min ${this.thumbMinClass}`);
      let max = new SliderThumbView(this.sliderLine.item);
      max.item.addClass(`slider29__thumb--max ${this.thumbMaxClass}`);

      this.sliderThumbs.push(min, max);
    } else {
      let thumb = new SliderThumbView(this.sliderLine.item);
      thumb.item.addClass(this.thumbClass);
      this.sliderThumbs.push(thumb);
    }

    //показать флажки
    if (this.showValueFlag) {
      $.each(this.sliderThumbs, function () {
        this.item.addClass('flag');
      });
    }

    //создать инпуты для ввода
    if (this.showInput) {
      const inputsWrap = $('<div>', { class: 'alexandr__inputs' });
      const minElement = $('<label>', { text: 'MIN' }).append(
        $('<input>', { class: 'inputs__item alexandr__input-min' }),
      );
      inputsWrap.append(minElement);
      this.inputs.push(minElement);
      if (this.type === 'double') {
        const maxElement = $('<label>', { text: 'MAX' }).append(
          $('<input>', { class: 'inputs__item alexandr__input-max' }),
        );
        inputsWrap.append(maxElement);
        this.inputs.push(maxElement);
      }
      $('.wrapp').prepend(inputsWrap);
    }

    //загрузить значения в линейку мин макс
    if (this.sliderMinMaxValueLine) {
      this.presenter.setMinMaxValue();
    }

    // установить ориентацию
    if (this.sliderOrientation === 'vertical') {
      this.setVerticalOrientation();
    }

    //повесить события на инпуты
    if (this.inputs.length) {
      this.inputs.forEach((input) => {
        input.on('change', this.presenter.onChangeInput);
      });
    }

    //повесить на кнопки события
    this.sliderThumbs.forEach((elem) => {
      elem.item.on('mousedown', this.presenter.onThumbMouseDown);
    });

    //повесить событие на линию
    this.sliderLine.item.on('click', (event) => {
      this.presenter.onSliderLineClick(event);
    });

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
