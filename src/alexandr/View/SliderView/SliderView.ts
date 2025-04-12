import SliderLineView from "../SliderLineView/SliderLineView";
import SliderMinMaxValueLineView from "../SliderMinMaxValueLineView/SliderMinMaxValueLineView";
import SliderProgressBar from "../SliderProgressbar/SliderProgressbar";
import SliderRulerView from "../SliderRulerView/SliderRulerView";
import SliderThumbView from "../SliderThumbView/SliderThumbView";

class SliderView {
  slider: JQuery<HTMLElement>;
  thumbs: Array<BaseSubViewInterface>;
  container: JQuery<HTMLElement>;
  line: BaseSubViewInterface;
  moveDirection: "top" | "left";
  orientation: "horizontal" | "vertical";
  type: "single" | "double";
  pixelInOneStep: number;
  sliderLength: number;
  minThumbPixelPosition: number | undefined;
  maxThumbPixelPosition: number | undefined;
  showMinMaxValue: boolean;
  sliderMinMaxValueLine: SliderMinMaxValueLineView;
  showMinValueClass: string;
  showMaxValueClass: string;
  showRuler: boolean;
  ruler: SliderRulerView;
  showValueFlag: boolean;
  progressbar: BaseSubViewInterface;
  controlsMinThumb: Array<JQuery<HTMLElement>>;
  controlsMaxThumb: Array<JQuery<HTMLElement>>;
  controlsStepValues: Array<JQuery<HTMLElement>>;

  constructor() {
    this.slider = $("<div>", { class: "alexandr" });
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
    controlsStepValues,
  }: AlexandrSettings) {
    if (
      container[0].nodeName !== "DIV" &&
      container[0].nodeName !== "ARTICLE"
    ) {
      throw new Error(
        "В качестве контенера может быть передан только div или article",
      );
    }
    this.container = container;
    this.type = type;
    this.line = new SliderLineView(this.slider, lineClass);
    this.orientation = orientation;
    this.moveDirection = this.orientation === "vertical" ? "top" : "left";
    this.showMinMaxValue = showMinMaxValue;
    this.showRuler = showRuler;
    this.showValueFlag = showValueFlag;
    this.progressbar = new SliderProgressBar(this.line.item, progressBarClass);
    this.controlsMinThumb = controlsMinThumb;
    this.controlsMaxThumb = controlsMaxThumb;
    this.controlsStepValues = controlsStepValues;

    //создам кнопки
    if (this.type === "double") {
      const min = new SliderThumbView(this.line.item);
      min.item.addClass(`alexandr__thumb--min ${thumbMinClass}`);
      const max = new SliderThumbView(this.line.item);
      max.item.addClass(`alexandr__thumb--max ${thumbMaxClass}`);

      this.thumbs.push(min, max);
    } else {
      const thumb = new SliderThumbView(this.line.item);
      thumb.item.addClass(thumbClass);
      this.thumbs.push(thumb);
    }

    //добавлю слайдер на страницу
    this.container.append(this.slider);

    //получу размер слайдера
    this.sliderLength =
      this.slider.outerWidth() - this.thumbs[0].item.outerWidth();

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
        this.item.addClass("flag");
      });
    }

    // установить ориентацию
    if (this.orientation === "vertical") {
      this._setVerticalOrientation();
    }
  }

  bindThumbsMove(handler: (type: "min" | "max", value: number) => void) {
    //повесить на кнопки события
    this.thumbs.forEach((elem: BaseSubViewInterface) => {
      elem.item[0].addEventListener("pointerdown", event =>
        this._handlerThumbsMove(event, handler),
      );
    });
  }

  bindInputsChange(handler: (type: "min" | "max", value: number) => void) {
    //повесить события на инпуты
    if (this.controlsMinThumb.length) {
      $.each(this.controlsMinThumb, (index, element) => {
        $.each(element, (index, element) => {
          element.addEventListener("change", event =>
            this._handlerInputsChange(event, handler, "min"),
          );
        });
      });
    }
    if (this.controlsMaxThumb.length) {
      $.each(this.controlsMaxThumb, (index, element) => {
        $.each(element, (index, element) => {
          element.addEventListener("change", event =>
            this._handlerInputsChange(event, handler, "max"),
          );
        });
      });
    }
  }

  bindLineClick(handler: (type: "min" | "max", value: number) => void) {
    //повесить событие на линию
    this.line.item[0].addEventListener("click", (event: MouseEvent) => {
      this._handleSliderClick(event, handler);
    });
  }

  bindRulerClick(handler: (type: "min" | "max", value: number) => void) {
    if (this.showRuler) {
      this.ruler.item[0].addEventListener("click", (event: MouseEvent) => {
        this._handleSliderClick(event, handler);
      });
    }
  }

  updateThumbsPosition(thumb: "min" | "max", position: number): void {
    if (thumb === "min") {
      this.minThumbPixelPosition = position;
      this.thumbs[0].item.css({ [this.moveDirection]: position });
    } else if (this.type === "double" && thumb === "max") {
      this.maxThumbPixelPosition = position;
      this.thumbs[1].item.css({ [this.moveDirection]: position });
    }

    this._setProgressBar();
  }

  updateMinMaxValueLine(min: number, max: number): void {
    if (this.sliderMinMaxValueLine) {
      this.sliderMinMaxValueLine.min.text(min);
      this.sliderMinMaxValueLine.max.text(max);
    }
  }

  updateRulerValue(min: number, max: number): void {
    if (this.showRuler) {
      const stepRuler = (max - min) / (this.ruler.dividings.length - 1);

      $.each(this.ruler.dividings, function () {
        this.attr("data-dividing", Math.round(min));
        min += stepRuler;
      });
    }
  }

  updateFlagValues(thumb: "min" | "max", position: number): void {
    //загрузить значения в окошки
    if (this.showValueFlag) {
      if (thumb === "min") {
        this.thumbs[0].item.attr("data-value", position);
      } else if (this.type === "double" && thumb === "max") {
        this.thumbs[1].item.attr("data-value", position);
      }
    }
  }

  updateInputsValue(type: "min" | "max", value: number): void {
    if (type === "min" && this.controlsMinThumb.length) {
      $.each(this.controlsMinThumb, function () {
        $.each(this, function () {
          $(this).val(value);
        });
      });
    }

    if (type === "max" && this.controlsMaxThumb.length) {
      $.each(this.controlsMaxThumb, function () {
        $.each(this, function () {
          $(this).val(value);
        });
      });
    }
  }

  updateStepInputs(value: number): void {
    if (this.controlsStepValues.length) {
      $.each(this.controlsStepValues, function () {
        $.each(this, function () {
          $(this).val(value);
        });
      });
    }
  }

  setPixelInOneStep({
    min,
    max,
    step,
  }: {
    min: number;
    max: number;
    step: number;
  }): void {
    this.pixelInOneStep = (this.sliderLength / (max - min)) * step || 1;
  }

  _handlerThumbsMove(
    event: PointerEvent,
    handler: (type: "min" | "max", value: number) => void,
  ) {
    event.preventDefault();
    // получу координаты элементов
    const sliderLineCoords = this._getCoords(this.line.item);
    const $currenThumb = $(event.target);
    const currentThumbCoords = this._getCoords($currenThumb);

    // разница между кликом и началок кнопки
    const shiftClickThumb: number = this._getShiftThumb({
      event: event,
      currentThumbCoords: currentThumbCoords,
      orientation: this.orientation,
    });

    const onMouseMove = (event: PointerEvent): void => {
      const options = {
        event: event,
        shiftClickThumb: shiftClickThumb,
        sliderLineCoords: sliderLineCoords,
        currentThumbCoords: currentThumbCoords,
      }
      let value: number = this._getNewThumbCord(options);

      // проверим, чтобы не сталкивались
      if (this.type === "double") {
        value = this._validateDoubleThumbValue({
          currenThumb: $currenThumb,
          value: value,
          minThumbPixelPosition: this.minThumbPixelPosition,
          maxThumbPixelPosition: this.maxThumbPixelPosition,
          pixelInOneStep: this.pixelInOneStep,
        });
      }

      if ($currenThumb.prop("classList").contains("alexandr__thumb--max")) {
        handler("max", value);
      } else {
        handler("min", value);
      }
    };

    function onMouseUp() {
      document.removeEventListener("pointerup", onMouseUp);
      document.removeEventListener("pointermove", onMouseMove);
    }

    document.addEventListener("pointermove", onMouseMove);
    document.addEventListener("pointerup", onMouseUp);
  }

  _handleSliderClick(
    event: MouseEvent,
    handler: (type: "min" | "max", value: number) => void,
  ) {
    const { target } = event;
    if (target instanceof HTMLElement) {
      if (target.classList.contains("alexandr__thumb")) {
        return;
      }
    }
    const sliderLineCoords = this._getCoords(this.line.item);

    // на скольких пикселях от линии произошел клик
    const pixelClick =
      this.moveDirection === "left"
        ? event.pageX - sliderLineCoords.left
        : event.pageY - sliderLineCoords.top;

    const stepLeft = this._equateValueToStep(pixelClick);

    if (this.type === "single") {
      handler("min", stepLeft);
    }

    if (this.type === "double") {
      const middlePixels =
        this.minThumbPixelPosition +
        (this.maxThumbPixelPosition - this.minThumbPixelPosition) / 2;

      if (stepLeft < middlePixels) {
        handler("min", stepLeft);
      } else {
        handler("max", stepLeft);
      }
    }
  }

  _handlerInputsChange(
    event: Event,
    handler: (thumb: "min" | "max", position: number) => void,
    type: "min" | "max",
  ) {
    const $currentInput = $(event.target);
    let currentValue = parseInt($currentInput.val().toString());
    currentValue = Number.isNaN(currentValue) ? 0 : currentValue;
    handler(type, currentValue);
  }

  _getCoords(elem: JQuery<EventTarget>): ElementsCoords {
    const boxLeft = elem.offset().left;
    const boxRight = boxLeft + elem.outerWidth();
    const boxTop = elem.offset().top;
    const boxBottom = boxTop + elem.outerHeight();

    return {
      left: boxLeft + window.scrollX,
      width: boxRight - boxLeft,
      top: boxTop + window.scrollY,
      height: boxBottom - boxTop,
    };
  }

  _getShiftThumb({
    event,
    currentThumbCoords,
    orientation,
  }: {
    event: PointerEvent;
    currentThumbCoords: ElementsCoords;
    orientation: string;
  }): number {
    if (orientation === "vertical") {
      return event.pageY - currentThumbCoords.top;
    } else {
      return event.pageX - currentThumbCoords.left;
    }
  }

  _getNewThumbCord({
    event,
    shiftClickThumb,
    sliderLineCoords,
    currentThumbCoords
  } : {
    event: MouseEvent,
    shiftClickThumb: number,
    sliderLineCoords: ElementsCoords,
    currentThumbCoords: ElementsCoords
  }
  ): number {
    let clientEvent;
    let clientLineCoordsOffset;
    let clientLineCoordsSize;
    let clientThumbCoordsSize;
    if (this.orientation === "vertical") {
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
    newLeft = this._equateValueToStep(newLeft);

    // курсор вышел из слайдера => оставить бегунок в его границах.
    if (newLeft < 0) {
      newLeft = 0;
    }
    const rightEdge = clientLineCoordsSize - clientThumbCoordsSize;

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    return newLeft;
  }

  _equateValueToStep(value: number): number {
    if (isNaN(value)) {
      throw new Error("Получено NaN");
    }

    return Math.round(value / this.pixelInOneStep) * this.pixelInOneStep;
  }

  _validateDoubleThumbValue({
    currenThumb,
    value,
    minThumbPixelPosition,
    maxThumbPixelPosition,
    pixelInOneStep,
  }: {
    currenThumb: JQuery<EventTarget>;
    value: number;
    minThumbPixelPosition: number;
    maxThumbPixelPosition: number;
    pixelInOneStep: number;
  }): number {
    if (
      currenThumb.hasClass("alexandr__thumb--min") &&
      value >= maxThumbPixelPosition - pixelInOneStep
    ) {
      return maxThumbPixelPosition - pixelInOneStep;
    } else if (
      currenThumb.hasClass("alexandr__thumb--max") &&
      value <= minThumbPixelPosition + pixelInOneStep
    ) {
      return this.minThumbPixelPosition + this.pixelInOneStep;
    }
    return value;
  }

  _setProgressBar(): void {
    if (this.type === "single") {
      if (this.orientation === "vertical") {
        const coordsThumbStart =
          this.minThumbPixelPosition +
          this.thumbs[0].item.outerHeight() / 2 +
          "px";

        this.progressbar.item.css({
          top: 0,
          width: "100%",
          height: coordsThumbStart,
        });
      }

      if (this.orientation === "horizontal") {
        const coordsThumbStart =
          this.minThumbPixelPosition +
          this.thumbs[0].item.outerWidth() / 2 +
          "px";
        this.progressbar.item.css({
          left: 0,
          height: "100%",
          width: coordsThumbStart,
        });
      }
    }

    if (this.type === "double") {
      if (this.orientation === "vertical") {
        const coordsThumbMin =
          this.minThumbPixelPosition + this.thumbs[0].item.outerHeight() / 2;
        const coordsThumbMax =
          this.maxThumbPixelPosition + this.thumbs[1].item.outerHeight() / 2;

        this.progressbar.item.css({
          left: 0,
          height: coordsThumbMax - coordsThumbMin + "px",
          width: "100%",
          top: coordsThumbMin,
        });
      }

      if (this.orientation === "horizontal") {
        const coordsThumbMin =
          this.minThumbPixelPosition + this.thumbs[0].item.outerWidth() / 2;
        const coordsThumbMax =
          this.maxThumbPixelPosition + this.thumbs[1].item.outerWidth() / 2;

        this.progressbar.item.css({
          left: coordsThumbMin + "px",
          height: "100%",
          width: coordsThumbMax - coordsThumbMin + "px",
        });
      }
    }
  }

  _setVerticalOrientation(): void {
    const height = this.slider.outerWidth();

    //повернем весь слайдер
    this.slider.addClass("alexandr_type_vertical");
    this.slider.height(height);

    //повернем линию
    this.line.item.addClass("alexandr__line_type_vertical");
    this.line.item.height(height);

    //повернем линию со значениями
    if (this.sliderMinMaxValueLine) {
      this.sliderMinMaxValueLine.wrap.addClass("alexandr__values_type_vertical");
      this.sliderMinMaxValueLine.wrap.height(height);
    }

    // //повернем кнопки
    this.thumbs.forEach((thumb: BaseSubViewInterface) => {
      thumb.item.addClass("alexandr__thumb_type_vertical");
    });

    //повернуть линейку
    if (this.ruler) {
      this.ruler.item.addClass("alexandr__ruler_type_vertical");
      this.ruler.dividings.forEach((elem: JQuery<HTMLElement>) => {
        elem.addClass("alexandr__dividing_type_vertical");
      });
    }
  }
}

export default SliderView;
