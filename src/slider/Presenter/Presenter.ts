import Observer from "../Observer/Observer";

import type { IModel, TModelEvents } from "../Model/type";
import type { IView, TViewEvents } from "../View/View/type";
import type { TPresenterEvents } from "./type";
import { TUserSliderSettings } from "../Slider/type";
import { TViewData, TViewEntity } from "../utils/updateFunc";

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
    const viewEvents: (keyof TViewEvents)[] = [
      "viewInit",
      "viewThumbsPositionChanged",
      "clickOnSlider",
    ];

    const modelEvents: (keyof TModelEvents)[] = [
      "modelThumbsPositionChanged",
      "modelMinMaxValuesChanged",
      "modelProgressbarUpdated",
      "modelSetRulerChanged",
      "modelShowFlagChanged",
      "modelOrientationChanged",
      "modelTypeChanged",
    ];

    viewEvents.forEach(event =>
      this.view.addSubscriber(event, this.handleViewEvent),
    );

    modelEvents.forEach(event =>
      this.model.addSubscriber(event, this.handleModelEvent),
    );
  }

  refreshOptions(options: TUserSliderSettings): void {
    this.model.refreshOptions(options);
  }

  private updateModelFunctions = (): {
    [K in keyof TViewEvents]: (data: TViewEvents[K]) => void;
  } => {
    return {
      viewInit: (data: TViewEvents["viewInit"]) => {
        this.model.modelGetCordsView(data);
      },
      viewThumbsPositionChanged: (
        data: TViewEvents["viewThumbsPositionChanged"],
      ) => {
        this.model.updateThumbPosition(data);
      },
      clickOnSlider: (data: TViewEvents["clickOnSlider"]) => {
        this.model.updateThumbPositionFromPixels(data);
      },
    };
  };

  private updateViewFunctions = (): {
    [K in keyof TModelEvents]: (data: TModelEvents[K]) => void;
  } => {
    return {
      modelThumbsPositionChanged: ({
        type,
        pixelPosition,
        orientation,
        currentValue,
      }: TModelEvents["modelThumbsPositionChanged"]) => {
        this.view.updateThumbsPosition({ type, pixelPosition, orientation });
        this.view.updateFlagValues({ type, currentValue });

        this.notify("updateOptions", {
          [`${type}Position`]: currentValue,
        });
      },
      modelMinMaxValuesChanged: ({
        min,
        max,
      }: TModelEvents["modelMinMaxValuesChanged"]) => {
        this.view.updateMinMaxValueLine({ min, max });
        this.view.updateRuler({ min, max });

        this.notify("updateOptions", {
          [`minValue`]: min,
          [`maxValue`]: max,
        });
      },
      modelProgressbarUpdated: (
        data: TModelEvents["modelProgressbarUpdated"],
      ) => {
        this.view.updateProgressBar(data);
      },
      modelSetRulerChanged: (data: TModelEvents["modelSetRulerChanged"]) => {
        this.view.updateShowRuler(data);
      },
      modelShowFlagChanged: (data: TModelEvents["modelShowFlagChanged"]) => {
        this.view.updateShowFlag(data);
      },
      modelOrientationChanged: (
        data: TModelEvents["modelOrientationChanged"],
      ) => {
        this.view.updateOrientation(data);
      },
      modelTypeChanged: (data: TModelEvents["modelTypeChanged"]) => {
        this.view.updateType(data);
      },
      modelStepValueChanged: (
        data: TModelEvents["modelStepValueChanged"],
      ) => {},
    };
  };

  private handleModelEvent = <K extends keyof TModelEvents>(
    typeEvent: K,
    data: TModelEvents[K],
  ) => {
    const handler = this.updateViewFunctions()[typeEvent];
    handler(data);
  };

  private handleViewEvent = <K extends keyof TViewEvents>(
    typeEvent: K,
    data: TViewEvents[K],
  ) => {
    const handler = this.updateModelFunctions()[typeEvent];
    handler(data);
  };
}

export default Presenter;
