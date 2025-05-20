import Observer from "../Observer/Observer";

class Presenter extends Observer {
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
      (dataOptions: ObserverInfoObject) => {
        this.viewThumbsPositionChanged(
          dataOptions.type,
          dataOptions.currentValue,
        );
      },
    );

    this.view.addSubscriber(
      "viewThumbsControlsChanged",
      (dataOptions: ObserverInfoObject) => {
        this.viewThumbsControlsChanged(
          dataOptions.type,
          dataOptions.currentValue,
        );
      },
    );

    this.view.addSubscriber(
      "viewSliderValueControlsChanged",
      (dataOptions: ObserverInfoObject) => {
        this.viewSliderValueControlsChanged(
          dataOptions.type,
          dataOptions.currentValue,
        );
      },
    );

    this.view.addSubscriber(
      "viewStepControlsChanged",
      (dataOptions: ObserverInfoObject) => {
        this.viewStepControlsChanged(dataOptions.currentValue);
      },
    );

    this.model.addSubscriber(
      "modelThumbsPositionChanged",
      (dataOptions: ObserverInfoObject) => {
        this.modelThumbsPositionChanged(
          dataOptions.type,
          dataOptions.currentValue,
        );
      },
    );

    this.model.addSubscriber(
      "modelStepValueChenged",
      (dataOptions: ObserverInfoObject) => {
        this.modelStepValueChenged(
          dataOptions.min,
          dataOptions.max,
          dataOptions.step,
        );
      },
    );

    this.model.addSubscriber(
      "modelMinMaxValuesChanged",
      (dataOptions: ObserverInfoObject) => {
        this.modelMinMaxValuesChanged(dataOptions.min, dataOptions.max);
      },
    );
  }

  private modelThumbsPositionChanged = (
    thumb: "min" | "max",
    position: number,
  ) => {
    this.view.updateThumbsPosition(thumb, this._convertUnitsToPixels(position));
    this.view.updateProgressBar();
    this.view.updateFlagValues(thumb, position);
    this.view.updateThumbsControlsValue(thumb, position);

    this.notify("updateOptions", {
      propName: `${thumb}Position`,
      propValue: position,
    });
  };

  private modelStepValueChenged = (min: number, max: number, step: number) => {
    this.view.setPixelInOneStep({ min, max, step });
    this.view.updateStepControls(step);

    this.notify("updateOptions", {
      propName: `stepValue`,
      propValue: step,
    });
  };

  private modelMinMaxValuesChanged = (min: number, max: number) => {
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

  private viewThumbsPositionChanged = (
    thumb: "min" | "max",
    position: number,
  ) => {
    if (thumb === "min") {
      this.model.setMinPosition(this._convertPixelToUnits(position));
    } else if (thumb === "max") {
      this.model.setMaxPosition(this._convertPixelToUnits(position));
    }
  };

  private viewThumbsControlsChanged = (input: "min" | "max", value: number) => {
    if (input === "min") {
      this.model.setMinPosition(value);
    } else if (input === "max") {
      this.model.setMaxPosition(value);
    }
  };

  private viewSliderValueControlsChanged = (
    input: "min" | "max",
    value: number,
  ) => {
    if (input === "min") {
      this.model.setMinValue(value);
    } else if (input === "max") {
      this.model.setMaxValue(value);
    }
  };

  private viewStepControlsChanged = (value: number) => {
    this.model.setStepValue(value);
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
