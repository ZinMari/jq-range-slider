import type { Observer } from "../Observer/type";
import type { AlexandrSettings } from "../type";
import type { UpdateThumbData } from "../View/ThumbView/type";
import type { ViewCoords } from "../View/View/type";

export type Model = Observer<ModelEvents> & {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  pixelInOneStep: number;
  type: "single" | "double";
  moveDirection: "top" | "left";
  orientation: "horizontal" | "vertical";
  setThumbsPosition: (thumbType: "min" | "max", value: number) => void;
  setMinValue: (minValue: number) => void;
  setMaxValue: (maxValue: number) => void;
  setStepValue: (value: number) => void;
  updateThumbPosition: (options: UpdateThumbData) => void;
  clickOnSlider: (options: { pixelClick: number }) => void;
  modelGetCordsView: (viewCoords: ViewCoords) => void;
  setProgressBarSize: () => void;
  setInitialValues: () => void;
  setOrientation: (orientation: "vertical" | "horizontal") => void;
  refreshOptions: (options: AlexandrSettings) => void;
};

export type ModelEvents = {
  modelThumbsPositionChanged: {
    type: "min" | "max";
    currentValue: number;
    pixelPosition: number;
    moveDirection: "top" | "left";
  };
  modelStepValueChanged: {
    stepValue: number;
  };
  modelMinMaxValuesChanged: {
    min: number;
    max: number;
  };
  modelProgressbarUpdated: {
    orientation: "vertical" | "horizontal";
    from: number;
    to: number;
  };
  modelSetRulerChanged: {
    isSetRuler: boolean;
  };
  modelShowFlagChanged: {
    isSetValueFlag: boolean;
  };
  modelOrientationChanged: {
    orientation: "vertical" | "horizontal";
  };
  modelTypeChanged: {
    type: "single" | "double";
  };
};

export type GetNewThumbCordData = {
  clientEvent: number;
  clientLineCoordsOffset: number;
  clientLineCoordsSize: number;
  clientThumbCoordsSize: number;
  shiftClickThumb: number;
};
