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
  private type: "single" | "double";
  private showMinMaxValue: boolean;
  private thumbMinClass: string;
  private thumbMaxClass: string;
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
    showMinMaxValue,
    showMinValueClass,
    showMaxValueClass,
    progressBarClass,
  }: AlexandrSettings) {
    super();
    this.container = container;
    this.type = type;
    this.showMinMaxValue = showMinMaxValue;
    this.thumbMinClass = thumbMinClass;
    this.thumbMaxClass = thumbMaxClass;
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
    this.addSubscribersToSubViews();
    this._notifyInitialCoords();
  }

  private _createBaseDOM = () => {
    this.slider = $("<div>", { class: "alexandr" });
  };

  private _initSubViews = () => {
    this.line = new LineView(this.lineClass);
    this.progressbar = new ProgressBar(this.progressBarClass);
    this.thumbs = new ThumbView({
      sliderLine: this.line,
      type: this.type,
      thumbMinClass: this.thumbMinClass,
      thumbMaxClass: this.thumbMaxClass,
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

  private _createRuler() {
    this.ruler = new RulerView(this.slider);
  }

  updateType(dataObject: ModelEvents["modelTypeChanged"]): void {
    this.type = dataObject.type;
    this.thumbs.updateType(dataObject);
  }

  updateProgressBar(dataObject: ModelEvents["modelProgressbarUpdated"]): void {
    this.progressbar.update(dataObject);
  }

  updateRuler(min: number, max: number): void {
    this.ruler.update(min, max);
  }

  updateShowRuler({ isSetRuler }: ModelEvents["modelSetRulerChanged"]) {
    isSetRuler ? this.ruler.showRuler() : this.ruler.hideRuler();
  }

  updateValueFlag({ isSetValueFlag }: ModelEvents["modelSetValueFlagChanged"]) {
    isSetValueFlag ? this.thumbs.showFlag() : this.thumbs.hideFlag();
  }

  updateOrientation({ orientation }: ModelEvents["modelOrientationChanged"]) {
    orientation === "vertical"
      ? this._setVerticalOrientation()
      : this._setHorizontalOrientation();
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
    this.slider.addClass("alexandr_type_vertical");
    this.slider.height(this.slider.outerWidth());
    this.line.setVerticalOrientation();
    this.thumbs.setOrientation("vertical");
    this.ruler.setVerticalOrientation();
    this.sliderMinMaxValueLine.setVerticalOrientation();
  }

  private _setHorizontalOrientation(): void {
    this.slider.removeClass("alexandr_type_vertical");
    this.slider.width("100%");
    this.line.setHorizontalOrientation();
    this.thumbs.setOrientation("horizontal");
    this.ruler.setHorizontalOrientation();
    this.sliderMinMaxValueLine.setHorizontalOrientation();
  }

  destroy() {
    this.slider.remove();
    this._destroySubscribers();
  }

  private _destroySubscribers() {
    this.line.removeAllSubscribers("clickOnSlider");
    this.ruler.removeAllSubscribers("clickOnSlider");
    this.thumbs.removeAllSubscribers("updateThumbPosition");
  }
}
export default View;
