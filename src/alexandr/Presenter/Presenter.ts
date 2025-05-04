class Presenter {
  view: View;
  model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
  }

  init(config: AlexandrSettings): {
    minValue: number;
    maxValue: number;
    minPosition: number;
    maxPosition: number;
    stepValue: number;
  } {
    this.view.init({ ...config });
    const upgradeModelOptions = this.model.init({ ...config });

    this.view.addSubscriber(this);
    this.model.addSubscriber(this);

    this._setViewInitialValues();

    return upgradeModelOptions;
  }

  update({ event, type, currentValue, min, max, step }: ObserverInfoObject) {
    switch (event) {
      case "viewThumbsPositionChanged": {
        this.handleThumbsPositionChanged(type, currentValue);
        break;
      }
      case "viewInputsValueChanged": {
        this.handleInputsChange(type, currentValue);
        break;
      }
      case "modelThumbsPositionChanged": {
        this.onThumbsPositionChanged(type, currentValue);
        break;
      }
      case "modelStepValueChenged": {
        this.onStepValueChenged(min, max, step);
        break;
      }
      case "modelMinMaxValuesChanged": {
        this.onMinMaxValuesChanged(min, max);
        break;
      }
    }
  }

  onThumbsPositionChanged = (thumb: "min" | "max", position: number) => {
    this.view.updateThumbsPosition(thumb, this._convertUnitsToPixels(position));
    this.view.updateFlagValues(thumb, position);
    this.view.updateInputsValue(thumb, position);
  };

  onStepValueChenged = (min: number, max: number, step: number) => {
    this.view.setPixelInOneStep({ min, max, step });
    this.view.updateStepInputs(step);
  };

  onMinMaxValuesChanged = (min: number, max: number) => {
    this.view.updateMinMaxValueLine(min, max);
    this.view.updateRulerValue(min, max);
  };

  handleThumbsPositionChanged = (thumb: "min" | "max", position: number) => {
    if (thumb === "min") {
      this.model.setMinPosition(this._convertPixelToUnits(position));
    } else if (thumb === "max") {
      this.model.setMaxPosition(this._convertPixelToUnits(position));
    }
  };

  handleInputsChange = (input: "min" | "max", value: number) => {
    if (input === "min") {
      this.model.setMinPosition(value);
    } else if (input === "max") {
      this.model.setMaxPosition(value);
    }
  };

  _convertUnitsToPixels(value: number): number {
    const withMinvalue = value - this.model.minValue;
    const pixels =
      withMinvalue * (this.view.pixelInOneStep / this.model.stepValue);
    return pixels;
  }

  _convertPixelToUnits(value: number): number {
    return Math.round(
      (value / this.view.pixelInOneStep) * this.model.stepValue +
        this.model.minValue,
    );
  }

  _setViewInitialValues() {
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
    this.view.updateInputsValue("max", this.model.maxPosition);
    this.view.updateInputsValue("min", this.model.minPosition);
    this.view.updateMinMaxValueLine(this.model.minValue, this.model.maxValue);
    this.view.updateRulerValue(this.model.minValue, this.model.maxValue);
    this.view.updateStepInputs(this.model.stepValue);
  }
}

export default Presenter;
