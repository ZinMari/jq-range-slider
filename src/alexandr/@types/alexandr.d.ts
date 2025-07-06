interface JQuery {
  alexandr: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any
    | ((
        options: string | AlexandrSettings,
        restOptions: [],
      ) => JQuery<HTMLElement>);
}

interface AlexandrSettings {
  [key: string]:
    | number
    | JQuery<HTMLElement>
    | boolean
    | string
    | [JQuery<HTMLElement>];
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
  controlsMinThumb?: [JQuery<HTMLElement>];
  controlsMaxThumb?: [JQuery<HTMLElement>];
  controlsMinValue?: [JQuery<HTMLElement>];
  controlsMaxValue?: [JQuery<HTMLElement>];
  controlsStepValues?: [JQuery<HTMLElement>];
  controlsFlag?: [JQuery<HTMLElement>];
  controlsRuler?: [JQuery<HTMLElement>];
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
  init: (options: AlexandrSettings) => void;
  setThumbsPosition: (thumbType: "min" | "max", value: number) => void;
  setMinValue: (minValue: number) => void;
  setMaxValue: (maxValue: number) => void;
  setStepValue: (value: number) => void;
  updateThumbPosition: (options: UpdateThumbData) => void;
  clicOnSlider: (options: { pixelClick: number }) => void;
  modelGetCordsView: (viewCoords: ViewCoords) => void;
  setProgressBarSize: () => void;
  setInitialValues: () => void;
}

interface BaseSubViewInterface extends Observer<SubViewEvents> {
  item: JQuery<HTMLElement>;
}

interface LineViewInterface extends BaseSubViewInterface {
  setVerticalOrientation: (height: number) => void;
}

interface RulerView extends BaseSubViewInterface {
  dividings: JQuery<HTMLElement>[];
  countDivivdings: number;
  update: (min: number, max: number) => void;
  showRuler: () => void;
  hideRuler: () => void;
}

interface ThumbView {
  showFlug: () => void;
  hideFlug: () => void;
  updateFlagValues: (thumb: "min" | "max", position: number) => void;
  updateThumbsPosition: (
    thumb: "min" | "max",
    position: number,
    moveDirection: "top" | "left",
  ) => void;
}

interface MinMaxValueLineView {
  wrap: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;
  update: (min: number, max: number) => void;
}

interface ProgressBarView {
  update: (data: any) => void;
}

interface View extends Observer<ViewEvents> {
  thumbs: ThumbView;
  sliderMinMaxValueLine: MinMaxValueLineView;
  ruler: RulerView;
  progressbar: ProgressBarView;
  init: (options: AlexandrSettings) => void;
  updateThumbsControlsValue: (type: "min" | "max", value: number) => void;
  updateSliderControlsValue: (type: "min" | "max", value: number) => void;
  updateStepControls: (stepValue: number) => void;
  destroy: () => void;
  setInitialValues: () => void;
}

interface Presenter extends Observer<PresenterEvents> {
  init: (options: AlexandrSettings) => void;
}

type ObserverSubscriber<T> = (infoObject: T[keyof T]) => void;

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
  notify<K extends keyof T>(typeEvent: K, observerInfoObject: T[K]): void;
}

interface Alexandr {
  update: (observerInfoObject: {
    [K in keyof AlexandrSettings]: AlexandrSettings[K];
  }) => void;
  sliderData: AlexandrSettings;
}

interface ModelEvents {
  modelThumbsPositionChanged: {
    type: "min" | "max";
    currentValue: number;
    pixelPosition: number;
    moveDirection: "top" | "left";
  };
  modelStepValueChenged: {
    stepValue: number;
  };
  modelMinMaxValuesChanged: {
    min: number;
    max: number;
  };
  modelProressbarUpdated: {
    from: number;
    to: number;
  };
}

interface ViewEvents {
  viewThumbsControlsChanged: {
    type: "min" | "max";
    currentValue: number;
  };
  viewSliderValueControlsChanged: {
    type: "min" | "max";
    currentValue: number;
  };
  viewStepControlsChanged: {
    stepValue: number;
  };
  viewThumbsPositionChanged: UpdateThumbData;
  clicOnSlider: {
    pixelClick: number;
  };
  viewInit: ViewCoords;
}

interface PresenterEvents {
  updateOptions: {
    propName: keyof AlexandrSettings;
    propValue: AlexandrSettings[keyof AlexandrSettings];
  };
}

interface SubViewEvents {
  clicOnSlider: {
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
