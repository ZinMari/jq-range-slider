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

interface Model extends Observer<ModelEvents> {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  type: "single" | "double";
  init: (options: AlexandrSettings) => void;
  setMinPosition: (minPosition: number) => void;
  setMaxPosition: (maxPosition: number) => void;
  setMinValue: (minValue: number) => void;
  setMaxValue: (maxValue: number) => void;
  setStepValue: (value: number) => void;
}

interface BaseSubViewInterface {
  item: JQuery<HTMLElement>;
}

interface RulerView extends BaseSubViewInterface {
  dividings: JQuery<HTMLElement>[];
  countDivivdings: number;
  update: (min: number, max: number) => void;
  showRuler: () => void;
  hideRuler: () => void;
}

interface ThumbView extends BaseSubViewInterface {
  showFlug: () => void;
  hideFlug: () => void;
  updateFlagValue: (position: number) => void;
}

interface MinMaxValueLineView {
  wrap: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;
  update: (min: number, max: number) => void;
}

interface ProgressBarView extends BaseSubViewInterface {
  update(styleobject: { [key: string]: string | number }): void;
}

type ElementsCoords = {
  left: number;
  width: number;
  top: number;
  height: number;
};

interface View extends Observer<ViewEvents> {
  pixelInOneStep: number;
  sliderMinMaxValueLine: MinMaxValueLineView;
  ruler: RulerView;
  init: (options: AlexandrSettings) => void;
  updateThumbsPosition: (thumb: "min" | "max", position: number) => void;
  updateFlagValues: (thumb: "min" | "max", position: number) => void;
  updateThumbsControlsValue: (type: "min" | "max", value: number) => void;
  updateSliderControlsValue: (type: "min" | "max", value: number) => void;
  updateStepControls: (value: number) => void;
  updateProgressBar(): void;
  setPixelInOneStep: (
    options:
      | {
          min: number;
          max: number;
          step: number;
        }
      | ObserverInfoObject,
  ) => void;
  destroy: () => void;
}

interface Presenter extends Observer<PresenterEvents> {
  init: (options: AlexandrSettings) => void;
}

type ObserverSubscriber = (infoObject: ObserverInfoObject) => void;

interface Observer<T> {
  subscribers: { [K in keyof T]?: Set<ObserverSubscriber> };
  addSubscriber<K extends keyof T>(
    typeEvent: K,
    subscriber: ObserverSubscriber,
  ): void;
  removeSubscriber: (
    typeEvent: keyof T,
    subscriber: ObserverSubscriber,
  ) => void;
  notify: (typeEvent: keyof T, observerInfoObject: ObserverInfoObject) => void;
}

interface ObserverInfoObject {
  type?: "min" | "max";
  currentValue?: number;
  min?: number;
  max?: number;
  step?: number;
  propName?: string;
  propValue?: string | number;
}

interface Alexandr {
  update: (observerInfoObject: ObserverInfoObject) => void;
  sliderData: AlexandrSettings;
}

type ModelEvents = {
  modelThumbsPositionChanged: "modelThumbsPositionChanged";
  modelStepValueChenged: "modelStepValueChenged";
  modelMinMaxValuesChanged: "modelMinMaxValuesChanged";
};

type ViewEvents = {
  viewThumbsControlsChanged: "viewThumbsControlsChanged";
  viewSliderValueControlsChanged: "viewSliderValueControlsChanged";
  viewStepControlsChanged: "viewStepControlsChanged";
  viewThumbsPositionChanged: "viewThumbsPositionChanged";
};

type PresenterEvents = {
  updateOptions: "updateOptions";
};
