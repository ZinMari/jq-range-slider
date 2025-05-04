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
  controlsStepValues?: [JQuery<HTMLElement>];
  orientation?: "horizontal" | "vertical";
  type?: "single" | "double";
}

type AlexandrSettingsKeys =
  | "minValue"
  | "maxValue"
  | "stepValue"
  | "showMinMaxValue"
  | "orientation"
  | "type"
  | "showValueFlag"
  | "showRuler"
  | "minPosition"
  | "maxPosition"
  | "elemForShowValueMin"
  | "elemForShowValueMax"
  | "lineClass"
  | "progressBarClass"
  | "thumbClass"
  | "thumbMinClass"
  | "thumbMaxClass"
  | "showMinValueClass"
  | "showMaxValueClass"
  | "controlsMinThumb"
  | "controlsMaxThumb";

interface Model extends Observer {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  type: "single" | "double";
  init: (options: AlexandrSettings) => {
    minValue: number;
    maxValue: number;
    minPosition: number;
    maxPosition: number;
    stepValue: number;
  };
  setMinPosition: (minPosition: number) => void;
  setMaxPosition: (setMaxPosition: number) => void;
}

interface BaseSubViewInterface {
  item: JQuery<HTMLElement>;
}

interface RulerView extends BaseSubViewInterface {
  dividings: JQuery<HTMLElement>[];
  countDivivdings: number;
}

interface MinMaxValueLineView {
  wrap: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;
}

type ElementsCoords = {
  left: number;
  width: number;
  top: number;
  height: number;
};

interface View extends Observer {
  slider: JQuery<HTMLElement>;
  thumbs: Array<BaseSubViewInterface>;
  container: JQuery<HTMLElement>;
  line: BaseSubViewInterface;
  moveDirection: "top" | "left";
  orientation: "horizontal" | "vertical";
  type: "single" | "double";
  pixelInOneStep: number;
  sliderLength: number;
  minThumbPixelPosition: number | undefined;
  maxThumbPixelPosition: number | undefined;
  showMinMaxValue: boolean;
  sliderMinMaxValueLine: MinMaxValueLineView;
  showMinValueClass: string;
  showMaxValueClass: string;
  showRuler: boolean;
  ruler: RulerView;
  showValueFlag: boolean;
  progressbar: BaseSubViewInterface;
  controlsMinThumb: Array<JQuery<HTMLElement>>;
  controlsMaxThumb: Array<JQuery<HTMLElement>>;
  controlsStepValues: Array<JQuery<HTMLElement>>;
  init: (options: AlexandrSettings) => void;
  updateThumbsPosition: (thumb: "min" | "max", position: number) => void;
  updateMinMaxValueLine: (min: number, max: number) => void;
  updateRulerValue: (min: number, max: number) => void;
  updateFlagValues: (thumb: "min" | "max", position: number) => void;
  updateInputsValue: (type: "min" | "max", value: number) => void;
  updateStepInputs: (value: number) => void;
  _getCoords: (elem: JQuery<EventTarget>) => ElementsCoords;
  _getShiftThumb: (options: {
    event: PointerEvent;
    currentThumbCoords: ElementsCoords;
    orientation: string;
  }) => number;
  setPixelInOneStep: (options: {
    min: number;
    max: number;
    step: number;
  }) => void;
  _getNewThumbCord: (options: {
    event: MouseEvent;
    shiftClickThumb: number;
    sliderLineCoords: ElementsCoords;
    currentThumbCoords: ElementsCoords;
  }) => number;
  _equateValueToStep: (value: number) => number;
  _validateDoubleThumbValue: (options: {
    currenThumb: JQuery<EventTarget>;
    value: number;
    minThumbPixelPosition: number;
    maxThumbPixelPosition: number;
    pixelInOneStep: number;
  }) => number;
  _handleSliderClick: (
    event: MouseEvent,
    handler: (type: "min" | "max", value: number) => void,
  ) => void;
  _setProgressBar: () => void;
  _setVerticalOrientation: () => void;
}

interface Presenter {
  init: (options: AlexandrSettings) => {
    minValue: number;
    maxValue: number;
    minPosition: number;
    maxPosition: number;
    stepValue: number;
  };
  update: (observerInfoObject: ObserverInfoObject) => void;
}

interface Observer {
  subscriber: Presenter;
  addSubscriber: (subscriber: Presenter) => void;
  notify: (observerInfoObject: ObserverInfoObject) => void;
}

interface ObserverInfoObject {
  event: string;
  type?: "min" | "max";
  currentValue?: number;
  min?: number;
  max?: number;
  step?: number;
}
