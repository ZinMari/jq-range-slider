import Observer from "../../Observer/Observer";
import LineView from "../LineView/LineView";
import MinMaxValueLineView from "../MinMaxValueLineView/MinMaxValueLineView";
import ProgressBar from "../ProgressbarView/ProgressbarView";
import RulerView from "../RulerView/RulerView";
import ThumbView from "../ThumbView/ThumbView";

class View extends Observer<ViewEvents> implements View {
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

  constructor({
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
    super();
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
    this.showMaxValueClass = showMaxValueClass;
    this.lineClass = lineClass;
    this.progressBarClass = progressBarClass;
  }

  setInitialValues() {
    this._createBaseDOM();
    this._initSubViews();
    this._appendToDOM();
    this._createRuler();
    this._createFlags();

    if (this.orientation === "vertical") {
      this._setVerticalOrientation();
    }

    this.addSubscribersToSubViews();
    this._notifyInitialCoords();
  }

  private _createBaseDOM = () => {
    this.slider = $("<div>", { class: "alexandr" });
  };

  private _initSubViews = () => {
    this.line = new LineView(this.lineClass, this.orientation);
    this.progressbar = new ProgressBar(this.progressBarClass, this.orientation);
    this.thumbs = new ThumbView({
      sliderLine: this.line,
      orientation: this.orientation,
      type: this.type,
      thumbMinClass: this.thumbMinClass,
      thumbMaxClass: this.thumbMaxClass,
      thumbClass: this.thumbClass,
    });

    if (this.showMinMaxValue) {
      this.sliderMinMaxValueLine = new MinMaxValueLineView(
        this.showMinValueClass,
        this.showMaxValueClass,
      );
    }
  };

  private _appendToDOM = () => {
    this.container.append(this.slider);
    this.slider.append(this.sliderMinMaxValueLine.item, this.line.item);
    this.line.item.append(
      this.progressbar.item,
      this.thumbs.minThumb,
      this.thumbs?.maxThumb,
    );
  };

  private _notifyInitialCoords = () => {
    this.notify("viewInit", {
      sliderLength:
        this.slider.outerWidth() - this.thumbs.minThumb.outerWidth(),
      minThumbWidth: this.thumbs.minThumb.outerWidth(),
      minThumbHeight: this.thumbs.minThumb.outerHeight(),
      maxThumbWidth: this.thumbs.maxThumb?.outerWidth(),
      maxThumbHeight: this.thumbs.maxThumb?.outerHeight(),
    });
  };

  private _createFlags(): void {
    if (this.showValueFlag) {
      this.thumbs.showFlag();
    } else {
      this.thumbs.hideFlag();
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

  private addSubscribersToSubViews() {
    this.line.addSubscriber("clickOnSlider", this._handlerClickOnSlider);
    this.ruler.addSubscriber("clickOnSlider", this._handlerClickOnSlider);
    this.thumbs.addSubscriber(
      "updateThumbPosition",
      this._handlerUpdateThumbPosition,
    );
  }

  private _handlerUpdateThumbPosition = (options: UpdateThumbData) => {
    this.notify("viewThumbsPositionChanged", options);
  };

  private _handlerClickOnSlider = ({
    pixelClick,
  }: SubViewEvents["clickOnSlider"]) => {
    this.notify("clickOnSlider", {
      pixelClick,
    });
  };

  private _setVerticalOrientation(): void {
    const height = this.slider.outerWidth();
    this.slider.addClass("alexandr_type_vertical");
    this.slider.height(height);
    this.line.setVerticalOrientation(height);
    this.thumbs.setVerticalOrientation();
    this.ruler.setVerticalOrientation();
    this.sliderMinMaxValueLine.setVerticalOrientation(height);
  }

  destroy() {
    this.slider.remove();
  }
}

export default View;
