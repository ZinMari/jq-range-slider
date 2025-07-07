import Observer from "../Observer/Observer";

class Presenter extends Observer<PresenterEvents> implements Presenter{
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
      "viewThumbsPositionChanged",
      this.viewThumbsPositionChanged,
    );

    this.view.addSubscriber("clicOnSlider", this.clicOnSlider);

    this.model.addSubscriber(
      "modelThumbsPositionChanged",
      this.modelThumbsPositionChanged,
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
    this.view.updateProgressBar(dataObject);
  };

  private modelThumbsPositionChanged = ({
    type,
    currentValue,
    pixelPosition,
    moveDirection,
  }: ModelEvents["modelThumbsPositionChanged"]) => {
    this.view.updateThumbsPosition(type, pixelPosition, moveDirection);
    this.view.updateFlagValues(type, currentValue);

    this.notify("updateOptions", {
      propName: `${type}Position`,
      propValue: currentValue,
    });
  };
  
  private modelMinMaxValuesChanged = ({
    min,
    max,
  }: ModelEvents["modelMinMaxValuesChanged"]) => {
    this.view.updateMinMaxValueLine(min, max);
    this.view.updateRuler(min, max);

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
}

export default Presenter;
