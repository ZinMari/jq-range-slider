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

    this.view.setInitialValues();
    this.model.setInitialValues();
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
      "viewThumbsPositionChanged",
      this.viewThumbsPositionChanged,
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
    moveDirection,
  }: ModelEvents["modelThumbsPositionChanged"]) => {
    this.view.thumbs.updateThumbsPosition(type, pixelPosition, moveDirection);

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

  private viewThumbsPositionChanged = (dataObject: any) => {
    this.model.updateThumbPosition(dataObject);
  };

  private viewClicOnSlider = (dataObject: any) => {
    this.model.modelClicOnSlider(dataObject);
  };

  private viewThumbsControlsChanged = ({
    type,
    currentValue,
  }: ViewEvents["viewThumbsControlsChanged"]) => {
    this.model.setThumbsPosition(type, currentValue);
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
}

export default Presenter;
