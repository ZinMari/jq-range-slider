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
  inputs: any;
  showValueFlag: any;
  progressbar: any;
  controlsMinThumb: any;
  controlsMaxThumb: any;

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
    showValueFlag,
    progressBarClass,
    controlsMinThumb,
    controlsMaxThumb,
  }: any) {
    this.container = container;
    this.type = type;
    this.line = new SliderLineView(this.slider, lineClass);
    this.orientation = orientation;
    this.moveDirection = this.orientation === 'vertical' ? 'top' : 'left';
    this.showMinMaxValue = showMinMaxValue;
    this.showRuler = showRuler;
    this.showValueFlag = showValueFlag;
    this.progressbar = new SliderProgressBar(this.line.item, progressBarClass);
    this.controlsMinThumb = controlsMinThumb;
    this.controlsMaxThumb = controlsMaxThumb;

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
    this.sliderLength = this.slider.outerWidth() - this.thumbs[0].item.outerWidth();

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

    //показать флажки
    if (this.showValueFlag) {
      $.each(this.thumbs, function () {
        this.item.addClass('flag');
      });
    }

    // установить ориентацию
    if (this.orientation === 'vertical') {
      this.setVerticalOrientation();
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

  bindInputsChange(handler: any) {
    //повесить события на инпуты
    if(this.controlsMinThumb.length){
      $.each(this.controlsMinThumb, function(){
        $.each(this, function(){
          $(this).on('change', (event: any) => {
            const currentInput = $(event.target);
            let currentValue = parseInt(currentInput.val().toString());
            currentValue = Number.isNaN(currentValue) ? 0 : currentValue;   
            handler('min', currentValue);
          });
        })
      })
    }

    if(this.controlsMaxThumb.length){
      $.each(this.controlsMaxThumb, function(){
        $.each(this, function(){
          $(this).on('change', (event: any) => {
            const currentInput = $(event.target);
            let currentValue = parseInt(currentInput.val().toString());
            currentValue = Number.isNaN(currentValue) ? 0 : currentValue;   
            handler('max', currentValue);
          });
        })
      })
    }
  }

  bindLineClick(handler: any) {
    //повесить событие на линию
    this.line.item.on('click', (event: any) => {
      this._handleSliderClick(event, handler);
    });
  }

  bindRulerClick(handler: any) {
    if (this.showRuler) {
      this.ruler.item.on('click', (event: any) => {
        this._handleSliderClick(event, handler);
      });
    }
  }

  updateThumbsPosition(thumb: 'min' | 'max', position: number) {
    if (thumb === 'min') {
      this.minThumbPixelPosition = position;
      this.thumbs[0].item.css({ [this.moveDirection]: position });
    } else if (this.type === 'double' && thumb === 'max') {
      this.maxThumbPixelPosition = position;
      this.thumbs[1].item.css({ [this.moveDirection]: position });
    }

    this._setProgressBar();
  }

  updateMinMaxValueLine(min: number, max: number) {
    if (this.sliderMinMaxValueLine) {
      this.sliderMinMaxValueLine.min.text(min);
      this.sliderMinMaxValueLine.max.text(max);
    }
  }

  updateRulerValue(min: number, max: number) {
    if(this.showRuler){
      const stepRuler = (max - min) / (this.ruler.dividings.length - 1);

      $.each(this.ruler.dividings, function () {
        this.attr('data-dividing', Math.round(min));
        min += stepRuler;
      });}
    
  }

  updateFlagValues(thumb: 'min' | 'max', position: number) {
    //загрузить значения в окошки
    if (this.showValueFlag) {
      if (thumb === 'min') {
        this.thumbs[0].item.attr('data-value', position);
      } else if (this.type === 'double' && thumb === 'max') {
        this.thumbs[1].item.attr('data-value', position);
      }
    }
  }

  updateInputsValue(type: 'min' | 'max', value: number) {
    if(type ==='min' && this.controlsMinThumb.length){
      $.each(this.controlsMinThumb, function(){
        $.each(this, function(){
          $(this).val(value);
        })
      })
    }

    if(type ==='max' && this.controlsMaxThumb.length){
      $.each(this.controlsMaxThumb, function(){
        $.each(this, function(){
          $(this).val(value);
        })
      })
    }
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
      clientEvent = event.pageY;

      clientLineCoordsOffset = sliderLineCoords.top;
      clientLineCoordsSize = sliderLineCoords.height;
      clientThumbCoordsSize = currentThumbCoords.height;
    } else {
      clientEvent = event.pageX;
      clientLineCoordsOffset = sliderLineCoords.left;
      clientLineCoordsSize = sliderLineCoords.width;
      clientThumbCoordsSize = currentThumbCoords.width;
    }

    let newLeft = clientEvent - shiftClickThumb - clientLineCoordsOffset;

    //подгоним движение под шаг
    newLeft = this.equateValueToStep(newLeft);

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

  equateValueToStep(value: number): number {
    return Math.round(value / this.pixelInOneStep) * this.pixelInOneStep;
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

  _handleSliderClick(event: any, handler: any) {
    let sliderLineCoords = this._getCoords(this.line.item);

    // на скольких пикселях от линии произошел клик
    let pixelClick =
      this.moveDirection === 'left'
        ? event.pageX - sliderLineCoords.left
        : event.pageY - sliderLineCoords.top;

    let stepLeft = this.equateValueToStep(pixelClick);

    if (this.type === 'single') {
      handler('min', stepLeft);
    }

    if (this.type === 'double') {
      const middlePixels =
        this.minThumbPixelPosition + (this.maxThumbPixelPosition - this.minThumbPixelPosition) / 2;

      if (stepLeft < middlePixels) {
        handler('min', stepLeft);
      } else {
        handler('max', stepLeft);
      }
    }
  }

  _setProgressBar(): void {
    if (this.type === 'single') {
      if (this.orientation === 'vertical') {
        let coordsThumbStart =
          this.minThumbPixelPosition + this.thumbs[0].item.outerHeight() / 2 + 'px';

        this.progressbar.item.css({
          top: 0,
          width: '100%',
          height: coordsThumbStart,
        });
      }

      if (this.orientation === 'horizontal') {
        let coordsThumbStart =
          this.minThumbPixelPosition + this.thumbs[0].item.outerWidth() / 2 + 'px';
        this.progressbar.item.css({
          left: 0,
          height: '100%',
          width: coordsThumbStart,
        });
      }
    }

    if (this.type === 'double') {
      if (this.orientation === 'vertical') {
        let coordsThumbMin = this.minThumbPixelPosition + this.thumbs[0].item.outerHeight() / 2;
        let coordsThumbMax = this.maxThumbPixelPosition + this.thumbs[1].item.outerHeight() / 2;

        this.progressbar.item.css({
          left: 0,
          height: coordsThumbMax - coordsThumbMin + 'px',
          width: '100%',
          top: coordsThumbMin,
        });
      }

      if (this.orientation === 'horizontal') {
        let coordsThumbMin = this.minThumbPixelPosition + this.thumbs[0].item.outerWidth() / 2;
        let coordsThumbMax = this.maxThumbPixelPosition + this.thumbs[1].item.outerWidth() / 2;

        this.progressbar.item.css({
          left: coordsThumbMin + 'px',
          height: '100%',
          width: coordsThumbMax - coordsThumbMin + 'px',
        });
      }
    }
  }

  setVerticalOrientation() {
    const height = this.slider.outerWidth();

    //повернем весь слайдер
    this.slider.addClass('alexandr--vertical');
    this.slider.height(height);

    //повернем линию
    this.line.item.addClass('alexandr__line--vertical');
    this.line.item.height(height);

    //повернем линию со значениями
    if (this.sliderMinMaxValueLine) {
      this.sliderMinMaxValueLine.wrap.addClass('alexandr__values--vertical');
      this.sliderMinMaxValueLine.wrap.height(height);
    }

    // //повернем кнопки
    this.thumbs.forEach((thumb: BaseSubViewInterface) => {
      thumb.item.addClass('alexandr__thumb--vertical');
    });

    //повернуть линейку
    if (this.ruler) {
      this.ruler.item.addClass('alexandr__ruler--vertical');
      this.ruler.dividings.forEach((elem: any) => {
        elem.addClass('alexandr__dividing--vertical');
      });
    }
  }
}
