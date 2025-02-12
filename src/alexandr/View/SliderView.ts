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
  presenter: Presenter;
  sliderRuler: SliderRulerView;
  sliderLength: number;
  sliderMinPosition: number;
  sliderMaxPosition: number;
  pixelInOneStep: number;
  moveDirection: 'top' | 'left';

  init({
    container,
    showMinMaxValue,
    orientation,
    type,
    showInput,
    showValueFlag,
    showRuler,
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
    this.container.append(this.slider);
    this.moveDirection = this.sliderOrientation === 'vertical' ? 'top' : 'left';
    // создать мин макс
    if (showMinMaxValue) {
      this.sliderMinMaxValueLine = new SliderMinMaxValueLineView(
        this.slider,
        showMinValueClass,
        showMaxValueClass,
      );
    }

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

    this.sliderLength =
      this.sliderOrientation === 'vertical'
        ? this.slider.outerHeight() - this.sliderThumbs[0].item.outerHeight()
        : this.slider.outerWidth() - this.sliderThumbs[0].item.outerWidth();
  }

  bindThumbsMove(handler: any) {
    //повесить на кнопки события
    this.sliderThumbs.forEach((elem) => {
      elem.item.on('mousedown', (event) => {
        event.preventDefault();
        // получу координаты элементов
        let sliderLineCoords = this._getCoords(this.sliderLine.item);
        let currenThumb = $(event.target);
        let currentThumbCoords = this._getCoords(currenThumb);

        console.log(currenThumb);

        // разница между кликом и началок кнопки
        let shiftClickThumb: number = this._getShiftThumb(
          event,
          currentThumbCoords,
          this.sliderOrientation,
        );

        const onMouseMove = (event: MouseEvent): void => {
          let value: number = this._getNewThumbCord(
            event,
            shiftClickThumb,
            sliderLineCoords,
            currentThumbCoords,
          );

          if (currenThumb.prop('classList').contains('alexandr__thumb--max')) {
            handler('max', value);
          } else {
            handler('min', value);
          }
        };

        function onMouseUp() {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });
  }

  updateThumbsPosition(type: 'min' | 'max', newPosition: any) {
    if (type === 'min') {
      this.sliderThumbs[0].item.css({ [this.moveDirection]: newPosition });
    } else if (type === 'max') {
      this.sliderThumbs[1].item.css({ [this.moveDirection]: newPosition });
    }
  }

  _getCoords(elem: JQuery<EventTarget>): ElementsCoords {
    let boxLeft = elem.offset().left;
    let boxRight = boxLeft + elem.outerWidth();
    let boxTop = elem.offset().top;
    let boxBottom = boxTop + elem.outerHeight();

    return {
      left: boxLeft + window.scrollX,
      width: boxRight - boxLeft,
      top: boxTop + window.scrollY,
      height: boxBottom - boxTop,
    };
  }

  _getShiftThumb(event: any, currentThumbCoords: ElementsCoords, orientation: string): number {
    if (orientation === 'vertical') {
      return event.pageY - currentThumbCoords.top;
    } else {
      return event.pageX - currentThumbCoords.left;
    }
  }

  getPixelInOneStep(stepValue: number, maxValue: number, minValue: number) {
    this.pixelInOneStep = (this.sliderLength / (maxValue - minValue)) * stepValue;
  }

  _equateValueToStep(value: number, pixelInOneStep: number): number {
    return Math.round(value / pixelInOneStep) * pixelInOneStep;
  }

  _getNewThumbCord(
    event: any,
    shiftClickThumb: number,
    sliderLineCoords: ElementsCoords,
    currentThumbCoords: ElementsCoords,
  ): number {
    let clientEvent;
    let clientLineCoordsOffset;
    let clientLineCoordsSize;
    let clientThumbCoordsSize;
    if (this.sliderOrientation === 'vertical') {
      clientEvent = event.clientY;
      clientLineCoordsOffset = sliderLineCoords.top;
      clientLineCoordsSize = sliderLineCoords.height;
      clientThumbCoordsSize = currentThumbCoords.height;
    } else {
      clientEvent = event.clientX;
      clientLineCoordsOffset = sliderLineCoords.left;
      clientLineCoordsSize = sliderLineCoords.width;
      clientThumbCoordsSize = currentThumbCoords.width;
    }

    let newLeft = clientEvent - shiftClickThumb - clientLineCoordsOffset;

    //подгоним движение под шаг
    newLeft = this._equateValueToStep(newLeft, this.pixelInOneStep);

    // курсор вышел из слайдера => оставить бегунок в его границах.
    if (newLeft < 0) {
      newLeft = 0;
    }
    let rightEdge = clientLineCoordsSize - clientThumbCoordsSize;

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    return newLeft;
  }
}
