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
    this.view.addSubscriber(
      "viewThumbsPositionChanged",
      this.viewThumbsPositionChanged,
    );

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
  }

  private modelThumbsPositionChanged = ({
    type,
    currentValue,
  }: ModelEvents["modelThumbsPositionChanged"]) => {
    this.view.updateThumbsPosition(
      type,
      this._convertUnitsToPixels(currentValue),
    );
    this.view.updateProgressBar();
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
    this.view.setPixelInOneStep({ min, max, step });
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

  private viewThumbsPositionChanged = ({
    type,
    currentValue,
  }: ViewEvents["viewThumbsPositionChanged"]) => {
    if (type === "min") {
      this.model.setMinPosition(this._convertPixelToUnits(currentValue));
    } else if (type === "max") {
      this.model.setMaxPosition(this._convertPixelToUnits(currentValue));
    }
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
      withMinvalue * (this.view.pixelInOneStep / this.model.stepValue);
    return pixels;
  }

  private _convertPixelToUnits(value: number): number {
    return Math.round(
      (value / this.view.pixelInOneStep) * this.model.stepValue +
        this.model.minValue,
    );
  }

  private _setViewInitialValues() {
    this.view.setPixelInOneStep({
      min: this.model.minValue,
      max: this.model.maxValue,
      step: this.model.stepValue,
    });

    this.view.updateThumbsPosition(
      "min",
      this._convertUnitsToPixels(this.model.minPosition),
    );
    this.view.updateThumbsPosition(
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
    this.view.updateProgressBar();
    this.view.sliderMinMaxValueLine.update(
      this.model.minValue,
      this.model.maxValue,
    );
    this.view.ruler.update(this.model.minValue, this.model.maxValue);
  }
}

export default Presenter;
