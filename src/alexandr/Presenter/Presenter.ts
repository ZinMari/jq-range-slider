import Observer from "../Observer/Observer";

import type { IModel, TModelEvents } from "../Model/type";
import type { IView, TViewEvents } from "../View/View/type";
import type { TPresenterEvents } from "./type";
import type { AlexandrSettings } from "../type";

class Presenter extends Observer<TPresenterEvents> {
  constructor(
    private view: IView,
    private model: IModel,
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

  private modelTypeChanged = (dataObject: TModelEvents["modelTypeChanged"]) => {
    this.view.updateType(dataObject);
  };

  private modelOrientationChanged = (
    dataObject: TModelEvents["modelOrientationChanged"],
  ) => {
    this.view.updateOrientation(dataObject);
  };

  private modelSetRulerChanged = (
    dataObject: TModelEvents["modelSetRulerChanged"],
  ) => {
    this.view.updateShowRuler(dataObject);
  };

  private modelShowFlagChanged = (
    dataObject: TModelEvents["modelShowFlagChanged"],
  ) => {
    this.view.updateShowFlag(dataObject);
  };

  private modelProgressbarUpdated = (
    dataObject: TModelEvents["modelProgressbarUpdated"],
  ) => {
    this.view.updateProgressBar(dataObject);
  };

  private modelThumbsPositionChanged = ({
    type,
    currentValue,
    pixelPosition,
    moveDirection,
  }: TModelEvents["modelThumbsPositionChanged"]) => {
    this.view.updateThumbsPosition({ type, pixelPosition, moveDirection });
    this.view.updateFlagValues({ type, currentValue });

    this.notify("updateOptions", {
      [`${type}Position`]: currentValue,
    });
  };

  private modelMinMaxValuesChanged = ({
    min,
    max,
  }: TModelEvents["modelMinMaxValuesChanged"]) => {
    this.view.updateMinMaxValueLine({ min, max });
    this.view.updateRuler({ min, max });

    this.notify("updateOptions", {
      [`minValue`]: min,
      [`maxValue`]: max,
    });
  };

  private viewInit = (viewCoords: TViewEvents["viewInit"]) => {
    this.model.modelGetCordsView(viewCoords);
  };

  private viewThumbsPositionChanged = (
    options: TViewEvents["viewThumbsPositionChanged"],
  ) => {
    this.model.updateThumbPosition(options);
  };

  private clickOnSlider = (options: TViewEvents["clickOnSlider"]) => {
    this.model.clickOnSlider(options);
  };
}

export default Presenter;
