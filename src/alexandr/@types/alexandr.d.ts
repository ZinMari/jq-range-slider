interface JQuery {
  alexandr: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any | ((options: string | AlexandrSettings) => JQuery<HTMLElement>);
}

interface AlexandrSettings {
  minValue?: number;
  maxValue?: number;
  container?: JQuery<HTMLElement>;
  stepValue?: number;
  showMinMaxValue?: boolean;
  showValueFlag?: boolean;
  showRuler?: boolean;
  minPosition?: number;
  maxPosition?: number;
  elemForShowValueMin?: JQuery<HTMLElement>;
  elemForShowValueMax?: JQuery<HTMLElement>;
  lineClass?: string;
  progressBarClass?: string;
  thumbClass?: string;
  thumbMinClass?: string;
  thumbMaxClass?: string;
  showMinValueClass?: string;
  showMaxValueClass?: string;
  orientation?: "horizontal" | "vertical";
  type?: "single" | "double";
}

interface UpdateThumbData {
  type: "max" | "min";
  shiftClickThumb: number;
  lineCoords: ElementsCoords;
  thumbCoords: ElementsCoords;
  clientEvent: number;
  clientLineCoordsOffset: number;
  clientLineCoordsSize: number;
  clientThumbCoordsSize: number;
}

interface ConvertData {
  value: number;
  pixelInOneStep: number;
  minValue: number;
  stepValue: number;
}

interface PixelInOneStepData {
  sliderLength: number;
  max: number;
  min: number;
  step: number;
}

interface GetNewThumbCordData {
  clientEvent: number;
  clientLineCoordsOffset: number;
  clientLineCoordsSize: number;
  clientThumbCoordsSize: number;
  shiftClickThumb: number;
}

interface ViewCoords {
  sliderLength: number;
  minThumbWidth: number;
  minThumbHeight: number;
  maxThumbWidth: number | undefined;
  maxThumbHeight: number | undefined;
}

interface ElementsCoords {
  left: number;
  width: number;
  top: number;
  height: number;
}

interface Model extends Observer<ModelEvents> {
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
  refreshOptions: (options: AlexandrSettings) => void
}

interface BaseSubViewInterface extends Observer<SubViewEvents> {
  item: JQuery<HTMLElement>;
}

interface LineViewInterface extends BaseSubViewInterface {
  setVerticalOrientation: () => void;
  setHorizontalOrientation: () => void;
  destroy: (typeEvent: keyof SubViewEvents)=> void;
}

interface RulerView extends BaseSubViewInterface {
  divisions: JQuery<HTMLElement>[];
  countDivisions: number;
  update: (min: number, max: number) => void;
  showRuler: () => void;
  hideRuler: () => void;
}

interface ThumbView {
  showFlag: () => void;
  hideFlag: () => void;
  updateFlagValues: (thumb: "min" | "max", position: number) => void;
  updateThumbsPosition: (
    thumb: "min" | "max",
    position: number,
    moveDirection: "top" | "left",
  ) => void;
}

interface MinMaxValueLineView {
  item: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;
  update: (min: number, max: number) => void;
}

interface ProgressBarView {
  item: JQuery<HTMLElement>;
  update: (data: { from: number; to: number }) => void;
}

interface View extends Observer<ViewEvents> {
  thumbs: ThumbView;
  sliderMinMaxValueLine: MinMaxValueLineView;
  ruler: RulerView;
  progressbar: ProgressBarView;
  updateProgressBar: (data: { from: number; to: number }) => void;
  updateRuler: (min: number, max: number) => void;
  updateShowRuler: (dataObject: ModelEvents['modelSetRulerChanged']) => void;
  updateOrientation: (dataObject: ModelEvents['modelOrientationChanged']) => void;
  updateMinMaxValueLine: (min: number, max: number) => void;
  updateThumbsPosition: (
    type: "min" | "max",
    pixelPosition: number,
    moveDirection: "top" | "left",
  ) => void;
  updateFlagValues: (thumb: "min" | "max", currentValue: number) => void;
  destroy: () => void;
  setInitialValues: () => void;
}

interface ObserverSubscriber<T> {
  (infoObject: T[keyof T]): void;
}

interface Observer<T> {
  subscribers: { [K in keyof T]?: Set<ObserverSubscriber<T>> };
  addSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: (infoObject: T[K]) => void,
  ): void;
  removeSubscriber: (
    typeEvent: keyof T,
    subscriber: ObserverSubscriber<T>,
  ) => void;
  removeAllSubscribers: (typeEvent: keyof T) => void;
  notify<K extends keyof T>(typeEvent: K, observerInfoObject: T[K]): void;
}

interface Alexandr extends Observer<AlexandrEvents> {
  update: (observerInfoObject: {
    [K in keyof AlexandrSettings]: AlexandrSettings[K];
  }) => void;
  sliderData: Partial<Record<keyof AlexandrSettings, unknown>>;
}

interface ModelEvents {
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
    from: number;
    to: number;
  };
  modelSetRulerChanged: {
    isSetRuler: boolean;
  }
  modelOrientationChanged: {
    orientation: "vertical" | "horizontal";
  }
}

interface ViewEvents {
  viewThumbsPositionChanged: UpdateThumbData;
  clickOnSlider: {
    pixelClick: number;
  };
  viewInit: ViewCoords;
}

interface PresenterEvents {
  updateOptions: Partial<AlexandrSettings>;
}

interface SubViewEvents {
  clickOnSlider: {
    pixelClick: number;
  };
}

interface ThumbViewEvents {
  thumbsPositionChanged: {
    type: "max" | "min";
    currentValue: number;
    moveDirection: "top" | "left";
  };
  updateThumbPosition: UpdateThumbData;
}

interface AlexandrEvents {
  sliderUpdated: Partial<Record<keyof AlexandrSettings, unknown>> | null;
}

interface ValueConverter {
  pixelInOneStep: (data: PixelInOneStepData) => number;
  convertPixelToUnits: (data: ConvertData) => number;
  convertUnitsToPixels: (data: ConvertData) => number;
}
