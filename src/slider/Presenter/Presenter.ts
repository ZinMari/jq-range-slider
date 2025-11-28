import Observer from "../Observer/Observer";

import type { IModel, TModelEvents } from "../Model/type";
import type { IView, TViewEvents } from "../View/View/type";
import type { TData, TEntity, TPresenterEvents } from "./type";
import { TUserSliderSettings } from "../Slider/type";
import { MODEL_EVENTS, VIEW_EVENTS } from "./constants";

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
    VIEW_EVENTS.forEach(event =>
      this.view.addSubscriber(event, this.updateFunction),
    );

    MODEL_EVENTS.forEach(event =>
      this.model.addSubscriber(event, this.updateFunction),
    );
  }

  refreshOptions(options: TUserSliderSettings): void {
    this.model.refreshOptions(options);
  }

  updateFunction = (entity: TEntity, data: TData): void => {
    switch (entity) {
      case "viewInit":
        this.model.modelGetCordsView(data as TViewEvents["viewInit"]);
        break;
      case "viewThumbsPositionChanged":
        this.model.updateThumbPosition(
          data as TViewEvents["viewThumbsPositionChanged"],
        );
        break;
      case "clickOnSlider":
        this.model.updateThumbPositionFromPixels(
          data as TViewEvents["clickOnSlider"],
        );
        break;
      case "modelThumbsPositionChanged": {
        const { type, pixelPosition, orientation, currentValue } =
          data as TModelEvents["modelThumbsPositionChanged"];

        this.view.updateThumbsPosition({ type, pixelPosition, orientation });
        this.view.updateFlagValues({ type, currentValue });

        this.notify("updateOptions", {
          [`${type}Position`]: currentValue,
        });
        break;
      }
      case "modelMinMaxValuesChanged": {
        const { min, max } = data as TModelEvents["modelMinMaxValuesChanged"];
        this.view.updateMinMaxValueLine({ min, max });
        this.view.updateRuler({ min, max });

        this.notify("updateOptions", {
          [`minValue`]: min,
          [`maxValue`]: max,
        });
        break;
      }
      case "modelProgressbarUpdated": {
        this.view.updateProgressBar(
          data as TModelEvents["modelProgressbarUpdated"],
        );
        break;
      }
      case "modelSetRulerChanged": {
        this.view.updateShowRuler(data as TModelEvents["modelSetRulerChanged"]);
        break;
      }
      case "modelShowFlagChanged": {
        this.view.updateShowFlag(data as TModelEvents["modelShowFlagChanged"]);
        break;
      }
      case "modelOrientationChanged": {
        this.view.updateOrientation(
          data as TModelEvents["modelOrientationChanged"],
        );
        break;
      }
      case "modelTypeChanged": {
        this.view.updateType(data as TModelEvents["modelTypeChanged"]);
        break;
      }
    }
  };
}

export default Presenter;
