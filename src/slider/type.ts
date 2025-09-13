import type { IObserver } from "./Observer/type";

declare global {
  interface JQuery {
    slider: SliderFunction;
  }
}

interface SliderFunction {
  (
    options: string | TSliderSettings,
    newOptions?: TSliderSettings | JQuery<HTMLElement> | TAlexandrCoonect,
  ): JQuery<HTMLElement>;
  defaults?: TSliderSettings;
}

type TAlexandrCoonect = (options: TSliderSettings) => void;

export interface IAlexandr extends IObserver<TAlexandrEvents> {
  update: (observerInfoObject: {
    [K in keyof TSliderSettings]: TSliderSettings[K];
  }) => void;
  sliderData: Partial<Record<keyof TSliderSettings, unknown>>;
}

export type TSliderSettings = {
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
  sliderUpdated: Partial<Record<keyof TSliderSettings, unknown>> | null;
};
