

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

interface BaseSubViewInterface extends Observer<SubViewEvents> {
  item: JQuery<HTMLElement>;
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
    orientation: "vertical" | "horizontal";
    from: number;
    to: number;
  };
  modelSetRulerChanged: {
    isSetRuler: boolean;
  };
  modelShowFlagChanged: {
    isSetValueFlag: boolean;
  };
  modelOrientationChanged: {
    orientation: "vertical" | "horizontal";
  };
  modelTypeChanged: {
    type: "single" | "double";
  };
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
