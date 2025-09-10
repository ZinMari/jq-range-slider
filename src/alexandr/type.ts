import type { IObserver } from "./Observer/type";

declare global {
  interface JQuery {
    alexandr:
      | any
      | ((options: string | AlexandrSettings) => JQuery<HTMLElement>);
  }
}

export interface AlexandrSettings {
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
  thumbMinClass?: string;
  thumbMaxClass?: string;
  showMinValueClass?: string;
  showMaxValueClass?: string;
  orientation?: "horizontal" | "vertical";
  type?: "single" | "double";
}

export interface Alexandr extends IObserver<AlexandrEvents> {
  update: (observerInfoObject: {
    [K in keyof AlexandrSettings]: AlexandrSettings[K];
  }) => void;
  sliderData: Partial<Record<keyof AlexandrSettings, unknown>>;
}

export interface AlexandrEvents {
  sliderUpdated: Partial<Record<keyof AlexandrSettings, unknown>> | null;
}
