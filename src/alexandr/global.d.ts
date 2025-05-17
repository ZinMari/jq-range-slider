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

interface Model extends Observer {
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
}

interface MinMaxValueLineView {
  wrap: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;
  update: (min: number, max: number) => void;
}

interface ProgressBarView extends BaseSubViewInterface {
  update(styleobject: { [key: string]: string | number }): void
}

type ElementsCoords = {
  left: number;
  width: number;
  top: number;
  height: number;
};

interface View extends Observer {
  pixelInOneStep: number;
  sliderMinMaxValueLine: MinMaxValueLineView;
  ruler: RulerView;
  init: (options: AlexandrSettings) => void;
  updateThumbsPosition: (thumb: "min" | "max", position: number) => void;
  updateFlagValues: (thumb: "min" | "max", position: number) => void;
  updateThumbsControlsValue: (type: "min" | "max", value: number) => void;
  updateSliderControlsValue: (type: "min" | "max", value: number) => void;
  updateStepControls: (value: number) => void;
  updateProgressBar(): void
  setPixelInOneStep: (options: {
    min: number;
    max: number;
    step: number;
  }) => void;
  destroy: () => void;
}

interface Presenter extends Observer {
  init: (options: AlexandrSettings) => void;
  update: (observerInfoObject: ObserverInfoObject) => void;
}

interface Observer {
  subscriber: Presenter | Alexandr;
  addSubscriber: (subscriber: Presenter | Alexandr) => void;
  notify: (observerInfoObject: ObserverInfoObject) => void;
}

interface ObserverInfoObject {
  event?: string;
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
