import { TModelEvents } from "../Model/type";
import { TViewEvents } from "../View/View/type";

export const VIEW_EVENTS: (keyof TViewEvents)[] = [
  "viewInit",
  "viewThumbsPositionChanged",
  "clickOnSlider",
];

export const MODEL_EVENTS: (keyof TModelEvents)[] = [
  "modelThumbsPositionChanged",
  "modelMinMaxValuesChanged",
  "modelProgressbarUpdated",
  "modelSetRulerChanged",
  "modelShowFlagChanged",
  "modelOrientationChanged",
  "modelTypeChanged",
];
