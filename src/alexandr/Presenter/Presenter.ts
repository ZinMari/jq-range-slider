import Observer from "../Observer/Observer"
import type { Model } from "../Model/type";
import type { View } from "../View/View/type";

class Presenter extends Observer<PresenterEvents> {
  constructor(
    private view: View,
    private model: Model,
  ) {
    super();
    this.view = view;
    this.model = model;

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

    this.view.addSubscriber("clickOnSlider", this.clickOnSlider);

    this.model.addSubscriber(
      "modelThumbsPositionChanged",
      this.modelThumbsPositionChanged,
    );

    this.model.addSubscriber(
      "modelMinMaxValuesChanged",
      this.modelMinMaxValuesChanged,
    );

    this.model.addSubscriber(
      "modelProgressbarUpdated",
      this.modelProgressbarUpdated,
    );

    this.model.addSubscriber("modelSetRulerChanged", this.modelSetRulerChanged);

    this.model.addSubscriber("modelShowFlagChanged", this.modelShowFlagChanged);

    this.model.addSubscriber(
      "modelOrientationChanged",
      this.modelOrientationChanged,
    );

    this.model.addSubscriber("modelTypeChanged", this.modelTypeChanged);
  }

  refreshOptions(options: AlexandrSettings): void {
    this.model.refreshOptions(options);
  }

  private modelTypeChanged = (dataObject: ModelEvents["modelTypeChanged"]) => {
    this.view.updateType(dataObject);
  };

  private modelOrientationChanged = (
    dataObject: ModelEvents["modelOrientationChanged"],
  ) => {
    this.view.updateOrientation(dataObject);
  };

  private modelSetRulerChanged = (
    dataObject: ModelEvents["modelSetRulerChanged"],
  ) => {
    this.view.updateShowRuler(dataObject);
  };

  private modelShowFlagChanged = (
    dataObject: ModelEvents["modelShowFlagChanged"],
  ) => {
    this.view.updateShowFlag(dataObject);
  };

  private modelProgressbarUpdated = (
    dataObject: ModelEvents["modelProgressbarUpdated"],
  ) => {
    this.view.updateProgressBar(dataObject);
  };

  private modelThumbsPositionChanged = ({
    type,
    currentValue,
    pixelPosition,
    moveDirection,
  }: ModelEvents["modelThumbsPositionChanged"]) => {
    this.view.updateThumbsPosition({ type, pixelPosition, moveDirection });
    this.view.updateFlagValues({ type, currentValue });

    this.notify("updateOptions", {
      [`${type}Position`]: currentValue,
    });
  };

  private modelMinMaxValuesChanged = ({
    min,
    max,
  }: ModelEvents["modelMinMaxValuesChanged"]) => {
    this.view.updateMinMaxValueLine({ min, max });
    this.view.updateRuler({ min, max });

    this.notify("updateOptions", {
      [`minValue`]: min,
      [`maxValue`]: max,
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

  private clickOnSlider = (options: ViewEvents["clickOnSlider"]) => {
    this.model.clickOnSlider(options);
  };
}

export default Presenter;
