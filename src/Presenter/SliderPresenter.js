export default class SliderPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  init() {
    this.pixelInOneStep =
      (this.view.sliderLength / (this.model.maxValue - this.model.minValue)) * this.model.stepValue;
    this.moveDirection = this.view.sliderOrientation === 'vertical' ? 'top' : 'left';
    this.minThumbPixelPosition = 0;
    this.maxThumbPixelPosition = this.view.sliderLength;

    this.setInitialValues();
    this.updateShowValues();

    //загрузить значения в линейку мин макс
    if (this.view.sliderMinMaxValueLine) {
      this.setMinMaxValue();
    }

    //установить ввод значений
    if (this.view.elemForInputMin) {
      this.view.elemForInputMin.on('change', () => {
        let val = parseInt(this.view.elemForInputMin.val());
        val = Number.isNaN(val) ? 0 : val;
        this.setValues(this.view.sliderThumbs[0].item, val);
        this.view.elemForInputMin.val(this.convertPixelToUnits(this.minThumbPixelPosition));
        this.setProgressBar();
        this.updateShowValues();
      });
    }

    if (this.view.elemForInputMax && this.view.type === 'double') {
      this.view.elemForInputMax.on('change', () => {
        let val = parseInt(this.view.elemForInputMax.val());
        val = Number.isNaN(val) ? 0 : val;
        this.setValues(this.view.sliderThumbs[1].item, val);
        this.view.elemForInputMax.val(this.convertPixelToUnits(this.maxThumbPixelPosition));
        this.setProgressBar();
        this.updateShowValues();
      });
    }

    this.view.sliderLine.item.on('click', (event) => {
      this.sliderLineClick(event);
    });

    this.setProgressBar();
  }
  updateShowValues() {
    if (this.view.elemForShowValueMax && this.view.type === 'double') {
      this.view.elemForShowValueMax.text(this.convertPixelToUnits(this.maxThumbPixelPosition));
    }
    if (this.view.elemForShowValueMin) {
      this.view.elemForShowValueMin.text(this.convertPixelToUnits(this.minThumbPixelPosition));
    }
    if (this.view.elemForInputMax && this.view.type === 'double') {
      this.view.elemForInputMax.val(this.convertPixelToUnits(this.maxThumbPixelPosition));
    }
    if (this.view.elemForInputMin) {
      this.view.elemForInputMin.val(this.convertPixelToUnits(this.minThumbPixelPosition));
    }
  }

  sliderLineClick(event) {
    let sliderLineCoords = this.getCoords(this.view.sliderLine.item);

    // на скольких пикселях от линии произошел клик
    let pixelClick =
      this.moveDirection === 'left'
        ? event.clientX - sliderLineCoords.left
        : event.clientY - sliderLineCoords.top;

    let stepLeft = this.equateValueToStep(pixelClick, this.pixelInOneStep);

    if (this.view.type === 'single') {
      this.view.sliderThumbs[0].item.css({ [this.moveDirection]: stepLeft });
      this.minThumbPixelPosition = stepLeft;
      this.setProgressBar();
    }
    if (this.view.type === 'double') {
      const middlePixels =
        this.minThumbPixelPosition + (this.maxThumbPixelPosition - this.minThumbPixelPosition) / 2;

      if (stepLeft < middlePixels) {
        this.view.sliderThumbs[0].item.css({ [this.moveDirection]: stepLeft });
        this.minThumbPixelPosition = stepLeft;
      } else {
        this.view.sliderThumbs[1].item.css({ [this.moveDirection]: stepLeft });
        this.maxThumbPixelPosition = stepLeft;
      }
      this.setProgressBar();
    }
  }

  setValues(thumb, value) {
    if (thumb.hasClass('slider29__thumb--max')) {
      let pixel = this.convertUnitsToPixels(value);
      let step = this.equateValueToStep(pixel, this.pixelInOneStep);
      step =
        step <= this.minThumbPixelPosition + this.pixelInOneStep
          ? this.minThumbPixelPosition + this.pixelInOneStep
          : step;
      step = step >= this.view.sliderLength ? this.view.sliderLength : step;

      this.view.sliderThumbs[1].item.css({
        [this.moveDirection]: step,
      });

      this.maxThumbPixelPosition = step;
    } else {
      value = value <= this.model.minValue ? this.model.minValue : value;

      value =
        value >= this.model.maxValue - this.model.stepValue
          ? this.model.maxValue - this.model.stepValue
          : value;

      let pixel = this.convertUnitsToPixels(value);
      pixel =
        pixel >= this.maxThumbPixelPosition - this.pixelInOneStep
          ? this.maxThumbPixelPosition - this.pixelInOneStep
          : pixel;
      let step = this.equateValueToStep(pixel, this.pixelInOneStep);

      this.view.sliderThumbs[0].item.css({ [this.moveDirection]: step });
      this.minThumbPixelPosition = step;
    }
  }

  setInitialValues() {
    if (this.view.sliderInitialValues[0]) {
      this.setValues(this.view.sliderThumbs[0].item, this.view.sliderInitialValues[0]);
    }

    if (this.view.type === 'double') {
      if (this.view.sliderInitialValues[1]) {
        this.setValues(this.view.sliderThumbs[1].item, this.view.sliderInitialValues[1]);
      } else {
        this.setValues(
          this.view.sliderThumbs[1].item,
          this.view.sliderInitialValues[0] + this.model.stepValue,
        );
      }
    }
  }

  onThumbMouseDown = (event) => {
    event.preventDefault();
    // получу координаты элементов
    let sliderLineCoords = this.getCoords(this.view.sliderLine.item);
    let minThumbCoords = this.getCoords(this.view.sliderThumbs[0].item);
    let maxThumbCoords = this.view.sliderThumbs[1]
      ? this.getCoords(this.view.sliderThumbs[1].item)
      : null;
    let currenThumb = $(event.target);
    let currentThumbCoords = this.getCoords(currenThumb);

    // разница между кликом и началок кнопки
    let shiftClickThumb = this.getShiftThumb(
      event,
      currentThumbCoords,
      this.view.sliderOrientation,
    );

    const onMouseMove = (event) => {
      let value = this.getNewThumbCord(
        event,
        shiftClickThumb,
        sliderLineCoords,
        currentThumbCoords,
        this.view.sliderOrientation,
        this.view.type,
      );

      // проверим, чтобы не сталкивались
      if (this.view.type === 'double') {
        value = this.validateDoubleThumbValue(
          currenThumb,
          value,
          this.minThumbPixelPosition,
          this.maxThumbPixelPosition,
          this.pixelInOneStep,
        );
      }

      //сохраним новую позицию ползунка
      this.saveThumbPosition(currenThumb, value);

      // отобзазим новое положение
      currenThumb.css({ [this.moveDirection]: value });

      //
      this.setProgressBar();

      this.updateShowValues();
    };

    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  setMinMaxValue() {
    this.view.sliderMinMaxValueLine.min.text(this.model.minValue);
    this.view.sliderMinMaxValueLine.max.text(this.model.maxValue);
  }

  getCoords(elem) {
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

  getShiftThumb(event, currentThumbCoords, orientation) {
    if (orientation === 'vertical') {
      return event.pageY - currentThumbCoords.top;
    } else {
      return event.pageX - currentThumbCoords.left;
    }
  }

  getNewThumbCord(
    event,
    shiftClickThumb,
    sliderLineCoords,
    currentThumbCoords,
    orientation,
    sliderType,
  ) {
    if (orientation === 'vertical') {
      return this._getNewThumbCord(
        event.clientY,
        shiftClickThumb,
        sliderLineCoords.top,
        sliderLineCoords.height,
        currentThumbCoords.height,
        this.pixelInOneStep,
        sliderType,
      );
    } else {
      return this._getNewThumbCord(
        event.clientX,
        shiftClickThumb,
        sliderLineCoords.left,
        sliderLineCoords.width,
        currentThumbCoords.width,
        this.pixelInOneStep,
        sliderType,
      );
    }
  }

  _getNewThumbCord(
    eventClient,
    shiftThumb,
    sliderStartCoords,
    sliderLength,
    sliderThumbLength,
    pixelInOneStep,
    sliderType,
  ) {
    let newLeft = eventClient - shiftThumb - sliderStartCoords;

    //подгоним движение под шаг
    newLeft = this.equateValueToStep(newLeft, pixelInOneStep);

    // курсор вышел из слайдера => оставить бегунок в его границах.
    if (newLeft < 0) {
      newLeft = 0;
    }
    let rightEdge = sliderLength - sliderThumbLength;

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    return newLeft;
  }

  saveThumbPosition(elem, value) {
    if (elem.hasClass('slider29__thumb--max')) {
      this.maxThumbPixelPosition = +value.toFixed(2);
    } else {
      this.minThumbPixelPosition = +value.toFixed(2);
    }
  }

  validateDoubleThumbValue(
    currenThumb,
    value,
    minThumbPixelPosition,
    maxThumbPixelPosition,
    pixelInOneStep,
  ) {
    if (
      currenThumb.hasClass('slider29__thumb--min') &&
      value >= maxThumbPixelPosition - pixelInOneStep
    ) {
      return maxThumbPixelPosition - pixelInOneStep;
    } else if (
      currenThumb.hasClass('slider29__thumb--max') &&
      value <= minThumbPixelPosition + pixelInOneStep
    ) {
      return this.minThumbPixelPosition + this.pixelInOneStep;
    }

    return value;
  }

  equateValueToStep(value, pixelInOneStep) {
    return Math.round(value / pixelInOneStep) * pixelInOneStep;
  }

  convertUnitsToPixels(value) {
    let withMinvalue = value - this.model.minValue;
    let pixels = withMinvalue * (this.pixelInOneStep / this.model.stepValue);
    return pixels;
  }

  convertPixelToUnits(value) {
    return Math.floor((value / this.pixelInOneStep) * this.model.stepValue);
  }

  setProgressBar() {
    if (this.view.type === 'single') {
      if (this.view.sliderOrientation === 'vertical') {
        let coordsThumbStart =
          this.minThumbPixelPosition + this.view.sliderThumbs[0].item.outerHeight() / 2 + 'px';
        this.view.sliderProgressBar.item.css({
          top: 0,
          width: '100%',
          height: coordsThumbStart,
        });
      }

      if (this.view.sliderOrientation === 'horizontal') {
        let coordsThumbStart =
          this.minThumbPixelPosition + this.view.sliderThumbs[0].item.outerWidth() / 2 + 'px';
        this.view.sliderProgressBar.item.css({
          left: 0,
          height: '100%',
          width: coordsThumbStart,
        });
      }
    }

    if (this.view.type === 'double') {
      if (this.view.sliderOrientation === 'vertical') {
        let coordsThumbMin =
          this.minThumbPixelPosition + this.view.sliderThumbs[0].item.outerHeight() / 2;
        let coordsThumbMax =
          this.maxThumbPixelPosition + this.view.sliderThumbs[1].item.outerHeight() / 2;

        this.view.sliderProgressBar.item.css({
          left: 0,
          height: coordsThumbMax - coordsThumbMin + 'px',
          width: '100%',
          top: coordsThumbMin,
        });
      }

      if (this.view.sliderOrientation === 'horizontal') {
        let coordsThumbMin =
          this.minThumbPixelPosition + this.view.sliderThumbs[0].item.outerWidth() / 2;
        let coordsThumbMax =
          this.maxThumbPixelPosition + this.view.sliderThumbs[1].item.outerWidth() / 2;

        this.view.sliderProgressBar.item.css({
          left: coordsThumbMin + 'px',
          height: '100%',
          width: coordsThumbMax - coordsThumbMin + 'px',
        });
      }
    }
  }
}
