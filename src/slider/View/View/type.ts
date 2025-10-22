import type { TModelEvents } from "../../Model/type";
import type { IObserver } from "../../Observer/type";
import type { IMinMaxValueLine } from "../MinMaxValueLineView/type";
import type { IProgressBarView } from "../ProgressbarView/type";
import type { IRulerView } from "../RulerView/type";
import type { IThumbView, TUpdateThumbData } from "../ThumbView/type";

export interface IView extends IObserver<TViewEvents> {
  thumbs: IThumbView;
  sliderMinMaxValueLine: IMinMaxValueLine;
  ruler: IRulerView;
  progressbar: IProgressBarView;
  updateProgressBar: (data: TModelEvents["modelProgressbarUpdated"]) => void;
  updateRuler: ({ min, max }: TModelEvents["modelMinMaxValuesChanged"]) => void;
  updateShowRuler: (dataObject: TModelEvents["modelSetRulerChanged"]) => void;
  updateOrientation: (
    dataObject: TModelEvents["modelOrientationChanged"],
  ) => void;
  updateMinMaxValueLine: ({
    min,
    max,
  }: TModelEvents["modelMinMaxValuesChanged"]) => void;
  updateThumbsPosition: ({
    type,
    pixelPosition,
    orientation,
  }: Partial<TModelEvents["modelThumbsPositionChanged"]>) => void;
  updateType: (dataObject: TModelEvents["modelTypeChanged"]) => void;
  updateShowFlag: ({
    isSetValueFlag,
  }: TModelEvents["modelShowFlagChanged"]) => void;
  updateFlagValues: ({
    type,
    currentValue,
  }: Partial<TModelEvents["modelThumbsPositionChanged"]>) => void;
  destroy: () => void;
  setInitialValues: () => void;
}

export type TViewEvents = {
  viewThumbsPositionChanged: TUpdateThumbData;
  clickOnSlider: {
    pixelClick: number;
  };
  viewInit: TViewCoordinates;
};

export type TViewCoordinates = {
  sliderLength: number;
  minThumbWidth: number;
  minThumbHeight: number;
  maxThumbWidth: number | undefined;
  maxThumbHeight: number | undefined;
};
