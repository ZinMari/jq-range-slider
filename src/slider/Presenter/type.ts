import { TModelEvents } from "../Model/type";
import { TSliderSettings } from "../Slider/type";
import { TViewEvents } from "../View/View/type";

export type TPresenterEvents = {
  updateOptions: Partial<TSliderSettings>;
};

export type TEntity =
  | "viewInit"
  | "viewThumbsPositionChanged"
  | "clickOnSlider"
  | "modelThumbsPositionChanged"
  | "modelMinMaxValuesChanged"
  | "modelProgressbarUpdated"
  | "modelSetRulerChanged"
  | "modelShowFlagChanged"
  | "modelOrientationChanged"
  | "modelTypeChanged";

export type TData =
  | TViewEvents["viewInit"]
  | TViewEvents["viewThumbsPositionChanged"]
  | TViewEvents["clickOnSlider"]
  | TModelEvents["modelThumbsPositionChanged"]
  | TModelEvents["modelMinMaxValuesChanged"]
  | TModelEvents["modelProgressbarUpdated"]
  | TModelEvents["modelSetRulerChanged"]
  | TModelEvents["modelShowFlagChanged"]
  | TModelEvents["modelOrientationChanged"]
  | TModelEvents["modelTypeChanged"];
