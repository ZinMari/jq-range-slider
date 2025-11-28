import { IModel, TModelEvents } from "../Model/type";
import { IView, TViewEvents } from "../View/View/type";
import { TEntity, TData } from "./type";

interface IUpdateFunctionContext {
  model: IModel;
  view: IView;
  notify: (event: "updateOptions", data: Record<string, unknown>) => void;
}

export function updateFunction(
  this: IUpdateFunctionContext,
  entity: TEntity,
  data: TData,
): void {
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
}
