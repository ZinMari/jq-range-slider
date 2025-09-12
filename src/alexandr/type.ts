import type { IObserver } from "./Observer/type";

declare global {
  interface JQuery {
    alexandr: AlexandrFunction;
  }
}

interface AlexandrFunction {
  (options: string | TAlexandrSettings): JQuery<HTMLElement>;
  defaults?: TAlexandrSettings;
}

export interface IAlexandr extends IObserver<TAlexandrEvents> {
  update: (observerInfoObject: {
    [K in keyof TAlexandrSettings]: TAlexandrSettings[K];
  }) => void;
  sliderData: Partial<Record<keyof TAlexandrSettings, unknown>>;
}

export type TAlexandrSettings = {
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
};

export type TAlexandrEvents = {
  sliderUpdated: Partial<Record<keyof TAlexandrSettings, unknown>> | null;
};
