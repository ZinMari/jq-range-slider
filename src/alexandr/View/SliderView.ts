import SliderLineView from './SliderLineView';
import SliderMinMaxValueLineView from './sliderMinMaxValueLineView';
import SliderProgressBar from './SliderProgressbar';
import SliderRulerView from './SliderRulerView';
import SliderThumbView from './SliderThumbView';

export default class SliderView {
  slider: any;
  thumbs: any;
  container: any;
  line: any;
  moveDirection: any;
  orientation: any;
  type: any;
  pixelInOneStep: any;
  sliderLength: number;
  minThumbPixelPosition: any;
  maxThumbPixelPosition: any;
  showMinMaxValue: any;
  sliderMinMaxValueLine: any;
  showMinValueClass: any;
  showMaxValueClass: any;
  showRuler: any;
  ruler: any;

  constructor() {
    this.slider = $('<div>', { class: 'alexandr' });
    this.thumbs = [];
  }

  init({
    type,
    container,
    lineClass,
    thumbMinClass,
    thumbMaxClass,
    thumbClass,
    orientation,
    showMinMaxValue,
    showMinValueClass,
    showMaxValueClass,
    showRuler,
  }: any) {
    this.container = container;
    this.type = type;
    this.line = new SliderLineView(this.slider, lineClass);
    this.orientation = orientation;
    this.moveDirection = this.orientation === 'vertical' ? 'top' : 'left';
    this.showMinMaxValue = showMinMaxValue;
    this.showRuler = showRuler;

    //создам кнопки
    if (this.type === 'double') {
      let min = new SliderThumbView(this.line.item);
      min.item.addClass(`alexandr__thumb--min ${thumbMinClass}`);
      let max = new SliderThumbView(this.line.item);
      max.item.addClass(`alexandr__thumb--max ${thumbMaxClass}`);

      this.thumbs.push(min, max);
    } else {
      let thumb = new SliderThumbView(this.line.item);
      thumb.item.addClass(thumbClass);
      this.thumbs.push(thumb);
    }

    //добавлю слайдер на страницу
    this.container.append(this.slider);

    //получу размер слайдера
    this.sliderLength =
      this.orientation === 'vertical'
        ? this.slider.outerHeight() - this.thumbs[0].item.outerHeight()
        : this.slider.outerWidth() - this.thumbs[0].item.outerWidth();

    // создать мин макс
    if (this.showMinMaxValue) {
      this.sliderMinMaxValueLine = new SliderMinMaxValueLineView(
        this.slider,
        showMinValueClass,
        showMaxValueClass,
      );
    }

    // создать линейку
    if (this.showRuler) {
      this.ruler = new SliderRulerView(this.slider);
    }
  }

  bindThumbsMove(handler: any) {
    //повесить на кнопки события
    this.thumbs.forEach((elem: any) => {
      elem.item.on('mousedown', (event: any) => {
        event.preventDefault();
        // получу координаты элементов
        let sliderLineCoords = this._getCoords(this.line.item);
        let currenThumb = $(event.target);
        let currentThumbCoords = this._getCoords(currenThumb);

        // разница между кликом и началок кнопки
        let shiftClickThumb: number = this._getShiftThumb(
          event,
          currentThumbCoords,
          this.orientation,
        );

        const onMouseMove = (event: MouseEvent): void => {
          let value: number = this._getNewThumbCord(
            event,
            shiftClickThumb,
            sliderLineCoords,
            currentThumbCoords,
          );

          // проверим, чтобы не сталкивались
          if (this.type === 'double') {
            value = this.validateDoubleThumbValue(
              currenThumb,
              value,
              this.minThumbPixelPosition,
              this.maxThumbPixelPosition,
              this.pixelInOneStep,
            );
          }

          if (currenThumb.prop('classList').contains('alexandr__thumb--max')) {
            handler('max', value);
          } else if (currenThumb.prop('classList').contains('alexandr__thumb--min')) {
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

  updateThumbsPosition(thumb: 'min' | 'max', position: number) {
    if (thumb === 'min') {
      this.minThumbPixelPosition = position;
      this.thumbs[0].item.css({ [this.moveDirection]: position });
    } else if (thumb === 'max') {
      this.maxThumbPixelPosition = position;
      this.thumbs[1].item.css({ [this.moveDirection]: position });
    }
  }

  updateMinMaxValueLine(min: number, max: number) {
    if (this.sliderMinMaxValueLine) {
      this.sliderMinMaxValueLine.min.text(min);
      this.sliderMinMaxValueLine.max.text(max);
    }
  }

  updateRulerValue(min: number, max: number) {
    const stepRuler = (max - min) / (this.ruler.dividings.length - 1);

    $.each(this.ruler.dividings, function () {
      this.attr('data-dividing', Math.round(min));
      min += stepRuler;
    });
  }

  _getCoords(elem: any) {
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

  _getShiftThumb(event: any, currentThumbCoords: any, orientation: string): number {
    if (orientation === 'vertical') {
      return event.pageY - currentThumbCoords.top;
    } else {
      return event.pageX - currentThumbCoords.left;
    }
  }

  setPixelInOneStep(min: number, max: number, step: number) {
    this.pixelInOneStep = (this.sliderLength / (max - min)) * step;
    console.log(this.pixelInOneStep);
  }

  _getNewThumbCord(
    event: any,
    shiftClickThumb: number,
    sliderLineCoords: any,
    currentThumbCoords: any,
  ): number {
    let clientEvent;
    let clientLineCoordsOffset;
    let clientLineCoordsSize;
    let clientThumbCoordsSize;
    if (this.orientation === 'vertical') {
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
    newLeft = this.equateValueToStep(newLeft, this.pixelInOneStep);

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

  equateValueToStep(value: number, pixelInOneStep: number): number {
    return Math.round(value / pixelInOneStep) * pixelInOneStep;
  }

  validateDoubleThumbValue(
    currenThumb: JQuery<EventTarget>,
    value: number,
    minThumbPixelPosition: number,
    maxThumbPixelPosition: number,
    pixelInOneStep: number,
  ): number {
    if (
      currenThumb.hasClass('alexandr__thumb--min') &&
      value >= maxThumbPixelPosition - pixelInOneStep
    ) {
      return maxThumbPixelPosition - pixelInOneStep;
    } else if (
      currenThumb.hasClass('alexandr__thumb--max') &&
      value <= minThumbPixelPosition + pixelInOneStep
    ) {
      return this.minThumbPixelPosition + this.pixelInOneStep;
    }

    return value;
  }
}
