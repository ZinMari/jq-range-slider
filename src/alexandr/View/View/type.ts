import type { TModelEvents } from "../../Model/type";
import type { IObserver } from "../../Observer/type";
import type { IMinMaxValueLine } from "../MinMaxValueLineView/type";
import type { IProgressBarView } from "../ProgressbarView/type";
import type { IRulerView } from "../RulerView/type";
import type { IThumbView, TUpdateThumbData } from "../ThumbView/type";

export interface View extends IObserver<ViewEvents> {
  thumbs: IThumbView;
  sliderMinMaxValueLine: IMinMaxValueLine;
  ruler: IRulerView;
  progressbar: IProgressBarView;
  updateProgressBar: (data: { from: number; to: number }) => void;
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
    moveDirection,
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

export interface ViewEvents {
  viewThumbsPositionChanged: TUpdateThumbData;
  clickOnSlider: {
    pixelClick: number;
  };
  viewInit: ViewCoords;
}

export interface ViewCoords {
  sliderLength: number;
  minThumbWidth: number;
  minThumbHeight: number;
  maxThumbWidth: number | undefined;
  maxThumbHeight: number | undefined;
}
