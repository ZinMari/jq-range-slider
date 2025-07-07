import Observer from "../../Observer/Observer";
import LineView from "../LineView/LineView";
import MinMaxValueLineView from "../MinMaxValueLineView/MinMaxValueLineView";
import ProgressBar from "../ProgressbarView/ProgressbarView";
import RulerView from "../RulerView/RulerView";
import ThumbView from "../ThumbView/ThumbView";

class View extends Observer<ViewEvents> implements View{
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
  }: AlexandrSettings) {
    this.container = container;
    this.type = type;
    this.orientation = orientation;
    this.showMinMaxValue = showMinMaxValue;
    this.showRuler = showRuler;
    this.showValueFlag = showValueFlag;
    this.thumbMinClass = thumbMinClass;
    this.thumbMaxClass = thumbMaxClass;
    this.thumbClass = thumbClass;
    this.showMinValueClass = showMinValueClass;
    this.showMinValueClass = showMaxValueClass;
    this.lineClass = lineClass;
    this.progressBarClass = progressBarClass;
  }

  // создание частей слайдера
  setInitialValues() {
    this.slider = $("<div>", { class: "alexandr" });
    this.line = new LineView(this.slider, this.lineClass, this.orientation);
    this.progressbar = new ProgressBar(
      this.line.item,
      this.progressBarClass,
      this.orientation,
    );

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
  }

  private _createRuler() {
    this.ruler = new RulerView(this.slider, this.orientation);
    this.showRuler ? this.ruler.showRuler() : this.ruler.hideRuler();
  }

  // обновить элементы слайдера
  updateProgressBar(dataObject: { from: number; to: number }): void {
    this.progressbar.update(dataObject);
  }

  updateRuler(min: number, max: number): void {
    this.ruler.update(min, max);
  }

  updateMinMaxValueLine(min: number, max: number): void {
    this.sliderMinMaxValueLine.update(min, max);
  }

  updateThumbsPosition(
    type: "min" | "max",
    pixelPosition: number,
    moveDirection: "top" | "left",
  ): void {
    this.thumbs.updateThumbsPosition(type, pixelPosition, moveDirection);
  }

  updateFlagValues(thumb: "min" | "max", currentValue: number): void {
    this.thumbs.updateFlagValues(thumb, currentValue);
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

  private _handlerUpdateThumbPosition = (options: UpdateThumbData) => {
    this.notify("viewThumbsPositionChanged", options);
  };

  private _handlerClicOnSlider = ({
    pixelClick,
  }: SubViewEvents["clicOnSlider"]) => {
    this.notify("clicOnSlider", {
      pixelClick,
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
