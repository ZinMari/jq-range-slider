import type { TModelEvents } from "../../Model/type";
import type { Observer } from "../../Observer/type";
import type { MinMaxValueLineView } from "../MinMaxValueLineView/type";
import type { ProgressBarView } from "../ProgressbarView/type";
import type { RulerView } from "../RulerView/type";
import type { ThumbView, UpdateThumbData } from "../ThumbView/type";

export interface View extends Observer<ViewEvents> {
  thumbs: ThumbView;
  sliderMinMaxValueLine: MinMaxValueLineView;
  ruler: RulerView;
  progressbar: ProgressBarView;
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
  viewThumbsPositionChanged: UpdateThumbData;
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
