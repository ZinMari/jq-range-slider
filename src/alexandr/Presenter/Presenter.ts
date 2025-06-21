import Observer from "../Observer/Observer";

class Presenter extends Observer<PresenterEvents> {
  constructor(
    private view: View,
    private model: Model,
  ) {
    super();
    this.view = view;
    this.model = model;
  }

  init(config: AlexandrSettings): void {
    this.view.init({ ...config });
    this.model.init({ ...config });

    this.bindSubscribers();

    this._setViewInitialValues();
  }

  destroy() {
    this.view.destroy();
  }

  bindSubscribers() {
    this.view.addSubscriber("viewInit", this.viewInit);

    this.view.addSubscriber(
      "viewThumbsControlsChanged",
      this.viewThumbsControlsChanged,
    );

    this.view.addSubscriber(
      "viewSliderValueControlsChanged",
      this.viewSliderValueControlsChanged,
    );

    this.view.addSubscriber(
      "viewStepControlsChanged",
      this.viewStepControlsChanged,
    );

    this.view.addSubscriber(
      "viewFAKEThumbsPositionChanged",
      this.viewFAKEThumbsPositionChanged,
    );

    this.view.addSubscriber("viewClicOnSlider", this.viewClicOnSlider);

    this.model.addSubscriber(
      "modelThumbsPositionChanged",
      this.modelThumbsPositionChanged,
    );

    this.model.addSubscriber(
      "modelStepValueChenged",
      this.modelStepValueChenged,
    );

    this.model.addSubscriber(
      "modelMinMaxValuesChanged",
      this.modelMinMaxValuesChanged,
    );

    this.model.addSubscriber(
      "modelProressbarUpdated",
      this.modelProressbarUpdated,
    );
  }

  private modelProressbarUpdated = (dataObject: any) => {
    this.view.progressbar.update(dataObject);
  };

  private modelThumbsPositionChanged = ({
    type,
    currentValue,
    pixelPosition,
  }: ModelEvents["modelThumbsPositionChanged"]) => {
    this.view.thumbs.updateThumbsPosition(type, pixelPosition);

    // this.view.updateProgressBar();
    this.view.thumbs.updateFlagValues(type, currentValue);
    this.view.updateThumbsControlsValue(type, currentValue);

    this.notify("updateOptions", {
      propName: `${type}Position`,
      propValue: currentValue,
    });
  };

  private modelStepValueChenged = ({
    min,
    max,
    step,
  }: ModelEvents["modelStepValueChenged"]) => {
    this.model.setPixelInOneStep({ min, max, step });
    this.view.updateStepControls(step);

    this.notify("updateOptions", {
      propName: `stepValue`,
      propValue: step,
    });
  };

  private modelMinMaxValuesChanged = ({
    min,
    max,
  }: ModelEvents["modelMinMaxValuesChanged"]) => {
    this.view.sliderMinMaxValueLine.update(min, max);
    this.view.ruler.update(min, max);
    this.view.updateSliderControlsValue("min", min);
    this.view.updateSliderControlsValue("max", max);

    this.notify("updateOptions", {
      propName: `minValue`,
      propValue: min,
    });

    this.notify("updateOptions", {
      propName: `maxValue`,
      propValue: max,
    });
  };

  private viewInit = (dataObject: any) => {
    this.model.modelGetCordsView(dataObject);
  };

  private viewFAKEThumbsPositionChanged = (dataObject: any) => {
    this.model.FAKEThumbsPositionChanged(dataObject);
  };

  private viewClicOnSlider = (dataObject: any) => {
    this.model.modelClicOnSlider(dataObject);
  };

  private viewThumbsControlsChanged = ({
    type,
    currentValue,
  }: ViewEvents["viewThumbsControlsChanged"]) => {
    if (type === "min") {
      this.model.setMinPosition(currentValue);
    } else if (type === "max") {
      this.model.setMaxPosition(currentValue);
    }
  };

  private viewSliderValueControlsChanged = ({
    type,
    currentValue,
  }: ViewEvents["viewSliderValueControlsChanged"]) => {
    if (type === "min") {
      this.model.setMinValue(currentValue);
    } else if (type === "max") {
      this.model.setMaxValue(currentValue);
    }
  };

  private viewStepControlsChanged = ({
    currentValue,
  }: ViewEvents["viewStepControlsChanged"]) => {
    this.model.setStepValue(currentValue);
  };

  private _convertUnitsToPixels(value: number): number {
    const withMinvalue = value - this.model.minValue;
    const pixels =
      withMinvalue * (this.model.pixelInOneStep / this.model.stepValue);
    return pixels;
  }

  private _setViewInitialValues() {
    this.view.initSliderStructure();

    this.view.thumbs.updateThumbsPosition(
      "min",
      this._convertUnitsToPixels(this.model.minPosition),
    );
    this.view.thumbs.updateThumbsPosition(
      "max",
      this._convertUnitsToPixels(this.model.maxPosition),
    );
    this.view.thumbs.updateFlagValues("min", this.model.minPosition);
    this.view.thumbs.updateFlagValues("max", this.model.maxPosition);
    this.view.updateThumbsControlsValue("max", this.model.maxPosition);
    this.view.updateThumbsControlsValue("min", this.model.minPosition);
    this.view.updateSliderControlsValue("max", this.model.maxValue);
    this.view.updateSliderControlsValue("min", this.model.minValue);
    this.view.updateStepControls(this.model.stepValue);
    this.view.sliderMinMaxValueLine.update(
      this.model.minValue,
      this.model.maxValue,
    );
    this.view.ruler.update(this.model.minValue, this.model.maxValue);
  }
}

export default Presenter;
