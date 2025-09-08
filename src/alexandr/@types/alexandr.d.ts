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

interface AlexandrEvents {
  sliderUpdated: Partial<Record<keyof AlexandrSettings, unknown>> | null;
}


