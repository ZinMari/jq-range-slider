import type { IObserver } from "../Observer/type";
import type { TUserSliderSettings } from "../Slider/type";
import type { TUpdateThumbData } from "../View/ThumbView/type";
import type { TViewCoordinates } from "../View/View/type";

export interface IModel extends IObserver<TModelEvents> {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number | null;
  stepValue: number;
  pixelInOneStep: number;
  type: "single" | "double";
  orientation: "horizontal" | "vertical";
  setThumbsPosition: (thumbType: "min" | "max", value: number) => void;
  setMinValue: (minValue: number) => void;
  setMaxValue: (maxValue: number) => void;
  setStepValue: (value: number) => void;
  updateThumbPosition: (options: TUpdateThumbData) => void;
  clickOnSlider: (options: { pixelClick: number }) => void;
  modelGetCordsView: (viewCoordinates: TViewCoordinates) => void;
  setProgressBarSize: () => void;
  setInitialValues: () => void;
  setOrientation: (orientation: "vertical" | "horizontal") => void;
  refreshOptions: (options: TUserSliderSettings) => void;
}

export type TModelEvents = {
  modelThumbsPositionChanged: {
    type: "min" | "max";
    currentValue: number | null;
    pixelPosition: number | null;
    orientation: "vertical" | "horizontal";
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
  clientLineCoordinatesOffset: number;
  clientLineCoordinatesSize: number;
  clientThumbCoordinatesSize: number;
  shiftClickThumb: number;
};
