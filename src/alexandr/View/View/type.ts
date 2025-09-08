export interface View extends Observer<ViewEvents> {
  thumbs: ThumbView;
  sliderMinMaxValueLine: MinMaxValueLineView;
  ruler: any;
  // ruler: RulerView;
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