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
      this.viewThumbsControlsChanged
    );

    this.view.addSubscriber(
      "viewSliderValueControlsChanged",
      this.viewSliderValueControlsChanged
    );

    this.view.addSubscriber(
      "viewStepControlsChanged",
      this.viewStepControlsChanged
    );

    this.model.addSubscriber(
      "modelThumbsPositionChanged", 
      this.modelThumbsPositionChanged
    );

    this.model.addSubscriber(
      "modelStepValueChenged",this.modelStepValueChenged
    );

    this.model.addSubscriber(
      "modelMinMaxValuesChanged",
      this.modelMinMaxValuesChanged
    );
  }

  private modelThumbsPositionChanged = (dataOptions: ObserverInfoObject) => {
    this.view.updateThumbsPosition(dataOptions.type, this._convertUnitsToPixels(dataOptions.currentValue));
    this.view.updateProgressBar();
    this.view.updateFlagValues(dataOptions.type, dataOptions.currentValue);
    this.view.updateThumbsControlsValue(dataOptions.type, dataOptions.currentValue);

    this.notify("updateOptions", {
      propName: `${dataOptions.type}Position`,
      propValue: dataOptions.currentValue,
    });
  };

  private modelStepValueChenged = (dataOptions: ObserverInfoObject) => {
    this.view.setPixelInOneStep(dataOptions);
    this.view.updateStepControls(dataOptions.step);

    this.notify("updateOptions", {
      propName: `stepValue`,
      propValue: dataOptions.step,
    });
  };

  private modelMinMaxValuesChanged = (dataOptions: ObserverInfoObject ) => {
    this.view.sliderMinMaxValueLine.update(dataOptions.min, dataOptions.max);
    this.view.ruler.update(dataOptions.min, dataOptions.max);
    this.view.updateSliderControlsValue("min", dataOptions.min);
    this.view.updateSliderControlsValue("max", dataOptions.max);

    this.notify("updateOptions", {
      propName: `minValue`,
      propValue: dataOptions.min,
    });

    this.notify("updateOptions", {
      propName: `maxValue`,
      propValue: dataOptions.max,
    });
  };

  private viewThumbsPositionChanged = (dataOptions: ObserverInfoObject) => {
    if (dataOptions.type === "min") {
      this.model.setMinPosition(this._convertPixelToUnits(dataOptions.currentValue));
    } else if (dataOptions.type === "max") {
      this.model.setMaxPosition(this._convertPixelToUnits(dataOptions.currentValue));
    }
  };

  private viewThumbsControlsChanged = (dataOptions: ObserverInfoObject) => {
    if (dataOptions.type === "min") {
      this.model.setMinPosition(dataOptions.currentValue);
    } else if (dataOptions.type === "max") {
      this.model.setMaxPosition(dataOptions.currentValue);
    }
  };

  private viewSliderValueControlsChanged = (dataOptions: ObserverInfoObject) => {
    if (dataOptions.type === "min") {
      this.model.setMinValue(dataOptions.currentValue);
    } else if (dataOptions.type === "max") {
      this.model.setMaxValue(dataOptions.currentValue);
    }
  };

  private viewStepControlsChanged = (dataOptions: ObserverInfoObject)=> {
    this.model.setStepValue(dataOptions.currentValue);
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
    this.view.updateFlagValues("min", this.model.minPosition);
    this.view.updateFlagValues("max", this.model.maxPosition);
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
