import Observer from "../../Observer/Observer";
import LineView from "../LineView/LineView";
import MinMaxValueLineView from "../MinMaxValueLineView/MinMaxValueLineView";
import ProgressBar from "../ProgressbarView/ProgressbarView";
import RulerView from "../RulerView/RulerView";
import ThumbView from "../ThumbView/ThumbView";

class View extends Observer {
  pixelInOneStep: number;
  ruler: RulerView;
  sliderMinMaxValueLine: MinMaxValueLineView;
  private slider: JQuery<HTMLElement>;
  private thumbs: Array<BaseSubViewInterface>;
  private container: JQuery<HTMLElement>;
  private line: BaseSubViewInterface;
  private moveDirection: "top" | "left";
  private orientation: "horizontal" | "vertical";
  private type: "single" | "double";
  private sliderLength: number;
  private minThumbPixelPosition: number | undefined;
  private maxThumbPixelPosition: number | undefined;
  private showMinMaxValue: boolean;
  private showMinValueClass: string;
  private showMaxValueClass: string;
  private showRuler: boolean;
  private showValueFlag: boolean;
  private progressbar: ProgressBarView;
  private controlsMinThumb: Array<JQuery<HTMLElement>>;
  private controlsMaxThumb: Array<JQuery<HTMLElement>>;
  private controlsMinValue: Array<JQuery<HTMLElement>>;
  private controlsMaxValue: Array<JQuery<HTMLElement>>;
  private controlsStepValues: Array<JQuery<HTMLElement>>;
  private controlsFlag: Array<JQuery<HTMLElement>>;
  private controlsRuler: Array<JQuery<HTMLElement>>;

  constructor() {
    super();
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
    controlsMinValue,
    controlsMaxValue,
    controlsFlag,
    controlsRuler,
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
    this.line = new LineView(this.slider, lineClass, this._handleSliderClick);
    this.orientation = orientation;
    this.moveDirection = this.orientation === "vertical" ? "top" : "left";
    this.showMinMaxValue = showMinMaxValue;
    this.showRuler = showRuler;
    this.showValueFlag = showValueFlag;
    this.progressbar = new ProgressBar(this.line.item, progressBarClass);
    this.controlsMinThumb = controlsMinThumb;
    this.controlsMaxThumb = controlsMaxThumb;
    this.controlsMinValue = controlsMinValue;
    this.controlsMaxValue = controlsMaxValue;
    this.controlsStepValues = controlsStepValues;
    this.controlsFlag = controlsFlag;
    this.controlsRuler = controlsRuler;

    //создам кнопки
    if (this.type === "double") {
      const min = new ThumbView(this.line.item, this._handlerThumbsMove);
      min.item.addClass(`alexandr__thumb--min ${thumbMinClass}`);
      const max = new ThumbView(this.line.item, this._handlerThumbsMove);
      max.item.addClass(`alexandr__thumb--max ${thumbMaxClass}`);

      this.thumbs.push(min, max);
    } else {
      const thumb = new ThumbView(this.line.item, this._handlerThumbsMove);
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
      this.sliderMinMaxValueLine = new MinMaxValueLineView(
        this.slider,
        showMinValueClass,
        showMaxValueClass,
      );
    }

    // создать линейку
    this.ruler = new RulerView(this.slider, this._handleSliderClick);

    this.updateShowFlag();
    this.updateShowRuler();

    // установить ориентацию
    if (this.orientation === "vertical") {
      this._setVerticalOrientation();
    }

    //повесить события на контролы флажков
    if (this.controlsFlag.length) {
      $.each(this.controlsFlag, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener("change", this._handlerFlagControls);
        });
      });
    }

    //повесить события на контролы линейки
    if (this.controlsRuler.length) {
      $.each(this.controlsRuler, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener("change", this._handlerRulerControls);
        });
      });
    }

    //повесить события на контролы Thumbs
    if (this.controlsMinThumb.length) {
      $.each(this.controlsMinThumb, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener(
            "change",
            this._handlerThumbsControls.bind(this, "min"),
          );
        });
      });
    }
    if (this.controlsMaxThumb.length) {
      $.each(this.controlsMaxThumb, (index, element) => {
        $.each(element, (index, element) => {
          element.addEventListener(
            "change",
            this._handlerThumbsControls.bind(this, "max"),
          );
        });
      });
    }

    //повесить события на контролы minMaxValues
    if (this.controlsMinValue.length) {
      $.each(this.controlsMinValue, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener(
            "change",
            this._handlerSliderValueControls.bind(this, "min"),
          );
        });
      });
    }
    if (this.controlsMaxValue.length) {
      $.each(this.controlsMaxValue, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener(
            "change",
            this._handlerSliderValueControls.bind(this, "max"),
          );
        });
      });
    }

    //повесить события на контролы step
    if (this.controlsStepValues.length) {
      $.each(this.controlsStepValues, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener("change", this._handlerStepControls);
        });
      });
    }
  }

  destroy() {
    this.slider.remove();
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

  updateShowRuler(): void {
    if (this.showRuler) {
      this.ruler.item.removeClass("alexandr__ruler_none");
      $.each(this.controlsRuler, (_, element) => {
        $.each(element, (_, element) => {
          $(element).prop("checked", true);
        });
      });
    } else {
      this.ruler.item.addClass("alexandr__ruler_none");
      $.each(this.controlsRuler, (_, element) => {
        $.each(element, (_, element) => {
          $(element).prop("checked", false);
        });
      });
    }
  }

  updateShowFlag(): void {
    //показать флажки
    if (this.showValueFlag) {
      $.each(this.thumbs, function () {
        this.item.addClass("flag");
      });
      $.each(this.controlsFlag, (_, element) => {
        $.each(element, (_, element) => {
          $(element).prop("checked", true);
        });
      });
    } else {
      $.each(this.thumbs, function () {
        this.item.removeClass("flag");
      });
      $.each(this.controlsFlag, (_, element) => {
        $.each(element, (_, element) => {
          $(element).prop("checked", false);
        });
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

  updateThumbsControlsValue(type: "min" | "max", value: number): void {
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

  updateSliderControlsValue(type: "min" | "max", value: number): void {
    if (type === "min" && this.controlsMinValue.length) {
      $.each(this.controlsMinValue, function () {
        $.each(this, function () {
          $(this).val(value);
        });
      });
    }

    if (type === "max" && this.controlsMaxValue.length) {
      $.each(this.controlsMaxValue, function () {
        $.each(this, function () {
          $(this).val(value);
        });
      });
    }
  }

  updateStepControls(value: number): void {
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

  private _handlerThumbsMove = (event: PointerEvent) => {
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
      };
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
        this.notify({
          event: "viewThumbsPositionChanged",
          type: "max",
          currentValue: value,
        });
      } else {
        this.notify({
          event: "viewThumbsPositionChanged",
          type: "min",
          currentValue: value,
        });
      }
    };

    function onMouseUp() {
      document.removeEventListener("pointerup", onMouseUp);
      document.removeEventListener("pointermove", onMouseMove);
    }

    document.addEventListener("pointermove", onMouseMove);
    document.addEventListener("pointerup", onMouseUp);
  };

  private _handleSliderClick = (event: MouseEvent) => {
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
      this.notify({
        event: "viewThumbsPositionChanged",
        type: "min",
        currentValue: stepLeft,
      });
    }

    if (this.type === "double") {
      const middlePixels =
        this.minThumbPixelPosition +
        (this.maxThumbPixelPosition - this.minThumbPixelPosition) / 2;

      if (stepLeft < middlePixels) {
        this.notify({
          event: "viewThumbsPositionChanged",
          type: "min",
          currentValue: stepLeft,
        });
      } else {
        this.notify({
          event: "viewThumbsPositionChanged",
          type: "max",
          currentValue: stepLeft,
        });
      }
    }
  };

  private _handlerThumbsControls = (type: "min" | "max", event: Event) => {
    const $currentInput = $(event.target);
    let currentValue = parseInt($currentInput.val().toString());
    currentValue = Number.isNaN(currentValue) ? 0 : currentValue;

    this.notify({
      event: "viewThumbsControlsChanged",
      type: type,
      currentValue: currentValue,
    });
  };

  private _handlerSliderValueControls = (type: "min" | "max", event: Event) => {
    const $currentInput = $(event.target);
    let currentValue = parseInt($currentInput.val().toString());
    currentValue = Number.isNaN(currentValue) ? 0 : currentValue;

    this.notify({
      event: "viewSliderValueControlsChanged",
      type: type,
      currentValue: currentValue,
    });
  };

  private _handlerStepControls = (event: Event) => {
    const $currentInput = $(event.target);
    let currentValue = parseInt($currentInput.val().toString());
    currentValue = Number.isNaN(currentValue) ? 0 : currentValue;

    this.notify({
      event: "viewStepControlsChanged",
      currentValue: currentValue,
    });
  };

  private _handlerFlagControls = (event: Event) => {
    const $currentInput = $(event.target);
    this.showValueFlag = $currentInput.is(":checked");
    this.updateShowFlag();
  };

  private _handlerRulerControls = (event: Event) => {
    const $currentInput = $(event.target);
    this.showRuler = $currentInput.is(":checked");
    this.updateShowRuler();
  };

  private _getCoords(elem: JQuery<EventTarget>): ElementsCoords {
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

  private _getShiftThumb({
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

  private _getNewThumbCord({
    event,
    shiftClickThumb,
    sliderLineCoords,
    currentThumbCoords,
  }: {
    event: MouseEvent;
    shiftClickThumb: number;
    sliderLineCoords: ElementsCoords;
    currentThumbCoords: ElementsCoords;
  }): number {
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

  private _equateValueToStep(value: number): number {
    if (isNaN(value)) {
      throw new Error("Получено NaN");
    }

    return Math.round(value / this.pixelInOneStep) * this.pixelInOneStep;
  }

  private _validateDoubleThumbValue({
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

  private _setProgressBar(): void {
    if (this.type === "single") {
      if (this.orientation === "vertical") {
        const coordsThumbStart =
          this.minThumbPixelPosition +
          this.thumbs[0].item.outerHeight() / 2 +
          "px";

        this.progressbar.update({
          top: 0,
          width: "100%",
          height: coordsThumbStart,
        })
      }

      if (this.orientation === "horizontal") {
        const coordsThumbStart =
          this.minThumbPixelPosition +
          this.thumbs[0].item.outerWidth() / 2 +
          "px";

        this.progressbar.update({
          left: 0,
          width: coordsThumbStart,
          height: "100%",
        })
      }
    }

    if (this.type === "double") {
      if (this.orientation === "vertical") {
        const coordsThumbMin =
          this.minThumbPixelPosition + this.thumbs[0].item.outerHeight() / 2;
        const coordsThumbMax =
          this.maxThumbPixelPosition + this.thumbs[1].item.outerHeight() / 2;

        this.progressbar.update({
          left: 0,
          height: coordsThumbMax - coordsThumbMin + "px",
          width: "100%",
          top: coordsThumbMin,
        })
      }

      if (this.orientation === "horizontal") {
        const coordsThumbMin =
          this.minThumbPixelPosition + this.thumbs[0].item.outerWidth() / 2;
        const coordsThumbMax =
          this.maxThumbPixelPosition + this.thumbs[1].item.outerWidth() / 2;

        this.progressbar.update({
          left: coordsThumbMin + "px",
          height: "100%",
          width: coordsThumbMax - coordsThumbMin + "px",
        })
      }
    }
  }

  private _setVerticalOrientation(): void {
    const height = this.slider.outerWidth();

    //повернем весь слайдер
    this.slider.addClass("alexandr_type_vertical");
    this.slider.height(height);

    //повернем линию
    this.line.item.addClass("alexandr__line_type_vertical");
    this.line.item.height(height);

    //повернем линию со значениями
    if (this.sliderMinMaxValueLine) {
      this.sliderMinMaxValueLine.wrap.addClass(
        "alexandr__values_type_vertical",
      );
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

export default View;
