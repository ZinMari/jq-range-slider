import type { ModelEvents } from "../../Model/type";
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
  updateRuler: ({ min, max }: ModelEvents["modelMinMaxValuesChanged"]) => void;
  updateShowRuler: (dataObject: ModelEvents["modelSetRulerChanged"]) => void;
  updateOrientation: (
    dataObject: ModelEvents["modelOrientationChanged"],
  ) => void;
  updateMinMaxValueLine: ({
    min,
    max,
  }: ModelEvents["modelMinMaxValuesChanged"]) => void;
  updateThumbsPosition: ({
    type,
    pixelPosition,
    moveDirection,
  }: Partial<ModelEvents["modelThumbsPositionChanged"]>) => void;
  updateType: (dataObject: ModelEvents["modelTypeChanged"]) => void;
  updateShowFlag: ({
    isSetValueFlag,
  }: ModelEvents["modelShowFlagChanged"]) => void;
  updateFlagValues: ({
    type,
    currentValue,
  }: Partial<ModelEvents["modelThumbsPositionChanged"]>) => void;
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