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
    this.setProgressBar();
    this.updateFlagValues();
  }

  onChangeInput = (event) => {
    const currentInput = $(event.target);
    let currentValue = parseInt(currentInput.val());
    currentValue = Number.isNaN(currentValue) ? 0 : currentValue;

    if (currentInput.hasClass('alexandr__input-min')) {
      this.setValues(this.view.sliderThumbs[0].item, currentValue);
      currentInput.val(this.convertPixelToUnits(this.minThumbPixelPosition));
    }

    if (currentInput.hasClass('alexandr__input-max') && this.view.type === 'double') {
      this.setValues(this.view.sliderThumbs[1].item, currentValue);
      currentInput.val(this.convertPixelToUnits(this.maxThumbPixelPosition));
    }

    this.setProgressBar();
    this.updateShowValues();
  };

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

      this.setProgressBar();
      this.updateShowValues();
      this.updateFlagValues();
    };

    function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  onSliderLineClick(event) {
    let sliderLineCoords = this.getCoords(this.view.sliderLine.item);

    // на скольких пикселях от линии произошел клик
    let pixelClick =
      this.moveDirection === 'left'
        ? event.clientX - sliderLineCoords.left
        : event.clientY - sliderLineCoords.top;

    this.moveThumbs(pixelClick);
  }

  moveThumbs(value) {
    let stepLeft = this.equateValueToStep(value, this.pixelInOneStep);

    if (this.view.type === 'single') {
      this.view.sliderThumbs[0].item.css({ [this.moveDirection]: stepLeft });
      this.minThumbPixelPosition = stepLeft;
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
      this.updateShowValues();
      this.updateFlagValues();
    }
  }

  onRulerClick = (event) => {
    const target = $(event.target);
    if (target.attr('data-dividing')) {
      this.moveThumbs(this.convertUnitsToPixels(target.attr('data-dividing')));
    }
  };

  updateShowValues() {
    if (this.view.elemForShowValueMax && this.view.type === 'double') {
      this.view.elemForShowValueMax.text(this.convertPixelToUnits(this.maxThumbPixelPosition));
    }
    if (this.view.elemForShowValueMin) {
      this.view.elemForShowValueMin.text(this.convertPixelToUnits(this.minThumbPixelPosition));
    }

    if (this.view.inputs[1] && this.view.type === 'double') {
      this.view.inputs[1]
        .children(':last')
        .val(this.convertPixelToUnits(this.maxThumbPixelPosition));
    }
    if (this.view.inputs[0]) {
      this.view.inputs[0]
        .children(':last')
        .val(this.convertPixelToUnits(this.minThumbPixelPosition));
    }
  }

  updateFlagValues() {
    //загрузить значения в окошки
    if (this.view.showValueFlag) {
      this.view.sliderThumbs[0].item.attr(
        'data-value',
        this.convertPixelToUnits(this.minThumbPixelPosition),
      );
      if (this.view.type === 'double') {
        this.view.sliderThumbs[1].item.attr(
          'data-value',
          this.convertPixelToUnits(this.maxThumbPixelPosition),
        );
      }
    }
  }

  setValuesToRuler() {
    const stepRuler =
      (this.model.maxValue - this.model.minValue) / (this.view.sliderRuler.dividings.length - 1);

    let currentValue = this.model.minValue;

    $.each(this.view.sliderRuler.dividings, function () {
      this.attr('data-dividing', Math.round(currentValue));
      currentValue += stepRuler;
    });
  }

  setValues(thumb, value) {
    if (thumb.hasClass('alexandr__thumb--max')) {
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

  getNewThumbCord(event, shiftClickThumb, sliderLineCoords, currentThumbCoords) {
    let clientEvent;
    let clientLineCoordsOffset;
    let clientLineCoordsSize;
    let clientThumbCoordsSize;
    if (this.view.sliderOrientation === 'vertical') {
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

  saveThumbPosition(elem, value) {
    if (elem.hasClass('alexandr__thumb--max')) {
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
