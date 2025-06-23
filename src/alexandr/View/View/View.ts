import Observer from "../../Observer/Observer";
import LineView from "../LineView/LineView";
import MinMaxValueLineView from "../MinMaxValueLineView/MinMaxValueLineView";
import ProgressBar from "../ProgressbarView/ProgressbarView";
import RulerView from "../RulerView/RulerView";
import ThumbView from "../ThumbView/ThumbView";

class View extends Observer<ViewEvents> {
  ruler: RulerView;
  sliderMinMaxValueLine: MinMaxValueLineView;
  thumbs: ThumbView;
  progressbar: ProgressBarView;
  private slider: JQuery<HTMLElement>;
  private container: JQuery<HTMLElement>;
  private line: LineViewInterface;
  private orientation: "horizontal" | "vertical";
  private type: "single" | "double";
  private showMinMaxValue: boolean;
  private showRuler: boolean;
  private showValueFlag: boolean;
  private controlsMinThumb: Array<JQuery<HTMLElement>>;
  private controlsMaxThumb: Array<JQuery<HTMLElement>>;
  private controlsMinValue: Array<JQuery<HTMLElement>>;
  private controlsMaxValue: Array<JQuery<HTMLElement>>;
  private controlsStepValues: Array<JQuery<HTMLElement>>;
  private controlsFlag: Array<JQuery<HTMLElement>>;
  private controlsRuler: Array<JQuery<HTMLElement>>;
  private thumbMinClass: string;
  private thumbMaxClass: string;
  private thumbClass: string;
  private showMinValueClass: string;
  private showMaxValueClass: string;
  private lineClass: string;
  private progressBarClass: string;

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
    this.container = container;
    this.type = type;
    this.orientation = orientation;
    this.showMinMaxValue = showMinMaxValue;
    this.showRuler = showRuler;
    this.showValueFlag = showValueFlag;
    this.controlsMinThumb = controlsMinThumb;
    this.controlsMaxThumb = controlsMaxThumb;
    this.controlsMinValue = controlsMinValue;
    this.controlsMaxValue = controlsMaxValue;
    this.controlsStepValues = controlsStepValues;
    this.controlsFlag = controlsFlag;
    this.controlsRuler = controlsRuler;
    this.thumbMinClass = thumbMinClass;
    this.thumbMaxClass = thumbMaxClass;
    this.thumbClass = thumbClass;
    this.showMinValueClass = showMinValueClass;
    this.showMinValueClass = showMaxValueClass;
    this.lineClass = lineClass;
    this.progressBarClass = progressBarClass;

    this._bindEventsSliderControls();
  }

  // создание частей слайдера
  setInitialValues() {
    this.slider = $("<div>", { class: "alexandr" });
    this.line = new LineView(this.slider, this.lineClass);
    this.progressbar = new ProgressBar(this.line.item, this.progressBarClass);

    this.thumbs = new ThumbView({
      sliderLine: this.line,
      orientation: this.orientation,
      type: this.type,
      thumbMinClass: this.thumbMinClass,
      thumbMaxClass: this.thumbMaxClass,
      thumbClass: this.thumbClass,
    });

    //добавлю слайдер на страницу
    this.container.append(this.slider);

    // создать мин макс
    if (this.showMinMaxValue) {
      this.sliderMinMaxValueLine = new MinMaxValueLineView(
        this.slider,
        this.showMinValueClass,
        this.showMaxValueClass,
      );
    }

    this._createRuler();
    this._createFlugs();

    // установить ориентацию
    if (this.orientation === "vertical") {
      this._setVerticalOrientation();
    }

    this.addSubscribersToSubViews();

    this.notify("viewInit", {
      sliderLength:
        this.slider.outerWidth() - this.thumbs.minThumb.outerWidth(),
      minThumbWidth: this.thumbs.minThumb.outerWidth(),
      minThumbHeight: this.thumbs.minThumb.outerHeight(),
      maxThumbWidth: this.thumbs.maxThumb?.outerWidth(),
      maxThumbHeight: this.thumbs.maxThumb?.outerHeight(),
    });
  }

  private _createFlugs(): void {
    if (this.showValueFlag) {
      this.thumbs.showFlug();
    } else {
      this.thumbs.hideFlug();
    }

    this.updateControlsFlag();
  }

  private _createRuler() {
    this.ruler = new RulerView(this.slider);
    this.showRuler ? this.ruler.showRuler() : this.ruler.hideRuler();
    this.updateControlsShowRuler();
  }

  // навешивание слушателей на контролы
  private _bindEventsSliderControls() {
    this._bindEventsFlugsControls();
    this._bindEventsRulerControls();
    this._bindEventsThumbControls();
    this._bindEventsMinMaxValuesControls();
    this._bindEventsStepControls();
  }

  private _bindEventsFlugsControls() {
    if (this.controlsFlag.length) {
      $.each(this.controlsFlag, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener("change", this._handlerFlagControls);
        });
      });
    }
  }

  private _bindEventsRulerControls() {
    if (this.controlsRuler.length) {
      $.each(this.controlsRuler, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener("change", this._handlerRulerControls);
        });
      });
    }
  }

  private _bindEventsThumbControls() {
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
  }

  private _bindEventsStepControls() {
    if (this.controlsStepValues.length) {
      $.each(this.controlsStepValues, (_, element) => {
        $.each(element, (_, element) => {
          element.addEventListener("change", this._handlerStepControls);
        });
      });
    }
  }

  private _bindEventsMinMaxValuesControls() {
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
  }

  // слушатели контролов
  private _handlerThumbsControls = (type: "min" | "max", event: Event) => {
    const $currentInput = $(event.target);
    let currentValue = parseInt($currentInput.val().toString());
    currentValue = Number.isNaN(currentValue) ? 0 : currentValue;

    this.notify("viewThumbsControlsChanged", {
      type: type,
      currentValue: currentValue,
    });
  };

  private _handlerSliderValueControls = (type: "min" | "max", event: Event) => {
    const $currentInput = $(event.target);
    let currentValue = parseInt($currentInput.val().toString());
    currentValue = Number.isNaN(currentValue) ? 0 : currentValue;

    this.notify("viewSliderValueControlsChanged", {
      type: type,
      currentValue: currentValue,
    });
  };

  private _handlerStepControls = (event: Event) => {
    const $currentInput = $(event.target);
    let currentValue = parseInt($currentInput.val().toString());
    currentValue = Number.isNaN(currentValue) ? 0 : currentValue;

    this.notify("viewStepControlsChanged", {
      currentValue: currentValue,
    });
  };

  private _handlerFlagControls = (event: Event) => {
    const $currentInput = $(event.target);
    this.showValueFlag = $currentInput.is(":checked");
    this._createFlugs();
  };

  private _handlerRulerControls = (event: Event) => {
    const $currentInput = $(event.target);
    this.showRuler = $currentInput.is(":checked");
    this.showRuler ? this.ruler.showRuler() : this.ruler.hideRuler();
  };

  // обновить значения в контролах
  updateControlsShowRuler(): void {
    if (this.showRuler) {
      $.each(this.controlsRuler, (_, element) => {
        $.each(element, (_, element) => {
          $(element).prop("checked", true);
        });
      });
    } else {
      $.each(this.controlsRuler, (_, element) => {
        $.each(element, (_, element) => {
          $(element).prop("checked", false);
        });
      });
    }
  }

  updateControlsFlag(): void {
    //показать флажки
    if (this.showValueFlag) {
      $.each(this.controlsFlag, (_, element) => {
        $.each(element, (_, element) => {
          $(element).prop("checked", true);
        });
      });
    } else {
      $.each(this.controlsFlag, (_, element) => {
        $.each(element, (_, element) => {
          $(element).prop("checked", false);
        });
      });
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

  // работа с пописками
  private addSubscribersToSubViews() {
    this.line.addSubscriber("clicOnSlider", this._handlerClicOnSlider);
    this.ruler.addSubscriber("clicOnSlider", this._handlerClicOnSlider);
    this.thumbs.addSubscriber(
      "updateThumbPosition",
      this._handlerUpdateThumbPosition,
    );
  }

  private _handlerUpdateThumbPosition = (dataObject: any) => {
    this.notify("viewThumbsPositionChanged", dataObject);
  };

  private _handlerClicOnSlider = ({
    pageX,
    pageY,
    item,
  }: SubViewEvents["clicOnSlider"]) => {
    this.notify("viewClicOnSlider", {
      pageX,
      pageY,
      item,
    });
  };

  // установка вертикальной ориентации
  private _setVerticalOrientation(): void {
    const height = this.slider.outerWidth();

    //повернем весь слайдер
    this.slider.addClass("alexandr_type_vertical");
    this.slider.height(height);

    //повернем линию
    this.line.setVerticalOrientation(height);

    //повернем кнопки
    this.thumbs.setVerticalOrientation();

    //повернуть линейку
    this.ruler.setVerticalOrientation();

    //повернем линию со значениями
    this.sliderMinMaxValueLine.setVerticalOrientation(height);
  }

  // удалить слайдер
  destroy() {
    this.slider.remove();
  }
}

export default View;
