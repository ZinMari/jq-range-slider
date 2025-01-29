import SliderLineView from './SliderLineView';
import SliderMinMaxValueLineView from './sliderMinMaxValueLineView';
import SliderProgressBar from './SliderProgressbar';
import SliderRulerView from './SliderRulerView';
import SliderThumbView from './SliderThumbView';

export default class SliderView {
  container: JQuery<HTMLElement>;
  slider: JQuery<HTMLElement>;
  sliderLine: BaseSubViewInterface;
  sliderProgressBar: BaseSubViewInterface;
  sliderThumbs: BaseSubViewInterface[];
  sliderOrientation: 'vertical' | 'horizontal';
  sliderInitialValues: [number, number?];
  elemForShowValueMin: JQuery<HTMLElement>;
  elemForShowValueMax: JQuery<HTMLElement>;
  elemForInputMin: JQuery<HTMLElement>;
  elemForInputMax: JQuery<HTMLElement>;
  type: 'single' | 'double';
  showInput: boolean;
  showValueFlag: boolean;
  showRuler: boolean;
  inputs: JQuery<HTMLElement>[];
  thumbClass: string;
  thumbMinClass: string;
  thumbMaxClass: string;
  sliderMinMaxValueLine: SliderMinMaxValueLineView;
  presenter: any;
  sliderRuler: SliderRulerView;
  sliderLength: number;

  constructor({
    container,
    showMinMaxValue,
    orientation,
    type,
    showInput,
    showValueFlag,
    showRuler,
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
  }: AlexandrSettings) {
    this.container = container;
    this.slider = $('<div>', { class: 'alexandr' });
    this.sliderLine = new SliderLineView(this.slider, lineClass);
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
    this.showRuler = showRuler;
    this.inputs = [];
    this.thumbClass = thumbClass;
    this.thumbMinClass = thumbMinClass;
    this.thumbMaxClass = thumbMaxClass;
    // создать мин макс
    if (showMinMaxValue) {
      this.sliderMinMaxValueLine = new SliderMinMaxValueLineView(
        this.slider,
        showMinValueClass,
        showMaxValueClass,
      );
    }
  }

  init(presenter: any) {
    this.presenter = presenter;
    this.container.append(this.slider);

    //создать кнопки
    if (this.type === 'double') {
      let min = new SliderThumbView(this.sliderLine.item);
      min.item.addClass(`alexandr__thumb--min ${this.thumbMinClass}`);
      let max = new SliderThumbView(this.sliderLine.item);
      max.item.addClass(`alexandr__thumb--max ${this.thumbMaxClass}`);

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

    // создать линейку
    if (this.showRuler) {
      this.sliderRuler = new SliderRulerView(this.slider);
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
      this.slider.prepend(inputsWrap);
    }

    //загрузить значения в полосу мин макс
    if (this.sliderMinMaxValueLine) {
      this.presenter.setMinMaxValue();
    }

    // загрузить значения в линейку
    if (this.sliderRuler) {
      this.presenter.setValuesToRuler();
    }

    // установить ориентацию
    if (this.sliderOrientation === 'vertical') {
      this.setVerticalOrientation();
    }

    //повесить события на инпуты
    if (this.inputs.length) {
      this.inputs.forEach((input: any) => {
        input.on('change', this.presenter.onChangeInput);
      });
    }

    //повесить на кнопки события
    this.sliderThumbs.forEach((elem: any) => {
      elem.item.on('mousedown', this.presenter.onThumbMouseDown);
    });

    //повесить событие на линию
    this.sliderLine.item.on('click', (event: any) => {
      this.presenter.onSliderLineClick(event);
    });

    //повесить событие на линейку
    if (this.sliderRuler) {
      this.sliderRuler.item.on('click', this.presenter.onRulerClick);
    }

    this.sliderLength =
      this.sliderOrientation === 'vertical'
        ? this.slider.outerHeight() - this.sliderThumbs[0].item.outerHeight()
        : this.slider.outerWidth() - this.sliderThumbs[0].item.outerWidth();
  }

  setVerticalOrientation() {
    //повернем весь слайдер
    this.slider.addClass('alexandr--vertical');

    //повернем линию
    this.sliderLine.item.addClass('alexandr__line--vertical');

    //повернем линию со значениями
    if (this.sliderMinMaxValueLine) {
      this.sliderMinMaxValueLine.wrap.addClass('alexandr__values--vertical');
    }

    // //повернем кнопки
    this.sliderThumbs.forEach((thumb: any) => {
      thumb.item.addClass('alexandr__thumb--vertical');
    });

    //повернуть линейку
    if (this.sliderRuler) {
      this.sliderRuler.item.addClass('alexandr__ruler--vertical');
      this.sliderRuler.dividings.forEach((elem: any) => {
        elem.addClass('alexandr__dividing--vertical');
      });
    }
  }
}
