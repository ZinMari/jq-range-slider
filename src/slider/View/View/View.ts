// @ts-nocheck
import Observer from "../../Observer/Observer";
import LineView from "../LineView/LineView";
import MinMaxValueLineView from "../MinMaxValueLineView/MinMaxValueLineView";
import ProgressBar from "../ProgressbarView/ProgressbarView";
import RulerView from "../RulerView/RulerView";
import ThumbView from "../ThumbView/ThumbView";

import type { ILineView } from "../LineView/type";
import type { IProgressBarView } from "../ProgressbarView/type";
import type { TModelEvents } from "../../Model/type";
import type { IView, TViewEvents } from "./type";
import type { TSubViewEvents } from "../type";
import type { TUpdateThumbData } from "../ThumbView/type";
import type { TSliderSettings } from "../../type";

class View extends Observer<TViewEvents> implements IView {
  ruler: RulerView;
  sliderMinMaxValueLine: MinMaxValueLineView;
  thumbs: ThumbView;
  progressbar: IProgressBarView;
  private slider: JQuery<HTMLElement>;
  private container: JQuery<HTMLElement>;
  private line: ILineView;
  private thumbMinClass: string;
  private thumbMaxClass: string;
  private showMinValueClass: string;
  private showMaxValueClass: string;
  private lineClass: string;
  private progressBarClass: string;

  constructor({
    container,
    lineClass,
    thumbMinClass,
    thumbMaxClass,
    showMinValueClass,
    showMaxValueClass,
    progressBarClass,
  }: TSliderSettings) {
    super();
    this.container = container;
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
    this._notifyInitialCoordinates();
    this._addSubscribersToSubViews();
  }

  private _createBaseDOM = () => {
    this.slider = $("<div>", { class: "slider" });
  };

  private _initSubViews = () => {
    this.line = new LineView(this.lineClass);
    this.progressbar = new ProgressBar(this.progressBarClass);
    this.thumbs = new ThumbView({
      sliderLine: this.line,
      thumbMinClass: this.thumbMinClass,
      thumbMaxClass: this.thumbMaxClass,
    });
    this.sliderMinMaxValueLine = new MinMaxValueLineView(
      this.showMinValueClass,
      this.showMaxValueClass,
    );
    this.ruler = new RulerView();
  };

  private _appendToDOM = () => {
    this.container.append(this.slider);
    this.slider.append(
      this.sliderMinMaxValueLine.item,
      this.line.item,
      this.ruler.item,
    );
    this.line.item.append(
      this.progressbar.item,
      this.thumbs.minThumb,
      this.thumbs?.maxThumb,
    );
  };

  private _notifyInitialCoordinates = () => {
    this.notify("viewInit", {
      sliderLength:
        this.slider.outerWidth() - this.thumbs.minThumb.outerWidth(),
      minThumbWidth: this.thumbs.minThumb.outerWidth(),
      minThumbHeight: this.thumbs.minThumb.outerHeight(),
      maxThumbWidth: this.thumbs.maxThumb?.outerWidth(),
      maxThumbHeight: this.thumbs.maxThumb?.outerHeight(),
    });
  };

  updateType(dataObject: TModelEvents["modelTypeChanged"]): void {
    this.thumbs.updateType(dataObject);
  }

  updateProgressBar(dataObject: TModelEvents["modelProgressbarUpdated"]): void {
    this.progressbar.update(dataObject);
  }

  updateRuler({ min, max }: TModelEvents["modelMinMaxValuesChanged"]): void {
    this.ruler.update(min, max);
  }

  updateShowRuler({ isSetRuler }: TModelEvents["modelSetRulerChanged"]) {
    isSetRuler ? this.ruler.showRuler() : this.ruler.hideRuler();
  }

  updateShowFlag({ isSetValueFlag }: TModelEvents["modelShowFlagChanged"]) {
    isSetValueFlag ? this.thumbs.showFlag() : this.thumbs.hideFlag();
  }

  updateOrientation({ orientation }: TModelEvents["modelOrientationChanged"]) {
    orientation === "vertical"
      ? this._setVerticalOrientation()
      : this._setHorizontalOrientation();
  }

  updateMinMaxValueLine({
    min,
    max,
  }: TModelEvents["modelMinMaxValuesChanged"]): void {
    this.sliderMinMaxValueLine.update(min, max);
  }

  updateThumbsPosition({
    type,
    pixelPosition,
    moveDirection,
  }: Partial<TModelEvents["modelThumbsPositionChanged"]>): void {
    this.thumbs.updateThumbsPosition(type, pixelPosition, moveDirection);
  }

  updateFlagValues({
    type,
    currentValue,
  }: Partial<TModelEvents["modelThumbsPositionChanged"]>): void {
    this.thumbs.updateFlagValues(type, currentValue);
  }

  private _addSubscribersToSubViews() {
    this.line.addSubscriber("clickOnSlider", this._handlerClickOnSlider);
    this.ruler.addSubscriber("clickOnSlider", this._handlerClickOnSlider);
    this.thumbs.addSubscriber(
      "updateThumbPosition",
      this._handlerUpdateThumbPosition,
    );
  }

  private _handlerUpdateThumbPosition = (options: TUpdateThumbData) => {
    this.notify("viewThumbsPositionChanged", options);
  };

  private _handlerClickOnSlider = ({
    pixelClick,
  }: TSubViewEvents["clickOnSlider"]) => {
    this.notify("clickOnSlider", {
      pixelClick,
    });
  };

  private _setVerticalOrientation(): void {
    this.slider.addClass("slider_type_vertical");
    this.slider.height(this.slider.outerWidth());
    this.line.setVerticalOrientation();
    this.thumbs.setOrientation("vertical");
    this.ruler.setVerticalOrientation();
    this.sliderMinMaxValueLine.setVerticalOrientation();
  }

  private _setHorizontalOrientation(): void {
    this.slider.removeClass("slider_type_vertical");
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
