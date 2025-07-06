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

    this.view.addSubscriber("clicOnSlider", this.clicOnSlider);

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

  private modelProressbarUpdated = (
    dataObject: ModelEvents["modelProressbarUpdated"],
  ) => {
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
    stepValue,
  }: ModelEvents["modelStepValueChenged"]) => {
    this.view.updateStepControls(stepValue);

    this.notify("updateOptions", {
      propName: `stepValue`,
      propValue: stepValue,
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

  private viewInit = (viewCoords: ViewEvents["viewInit"]) => {
    this.model.modelGetCordsView(viewCoords);
  };

  private viewThumbsPositionChanged = (
    options: ViewEvents["viewThumbsPositionChanged"],
  ) => {
    this.model.updateThumbPosition(options);
  };

  private clicOnSlider = (options: ViewEvents["clicOnSlider"]) => {
    this.model.clicOnSlider(options);
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
    stepValue,
  }: ViewEvents["viewStepControlsChanged"]) => {
    this.model.setStepValue(stepValue);
  };
}

export default Presenter;
