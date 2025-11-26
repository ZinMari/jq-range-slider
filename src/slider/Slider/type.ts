import type { IObserver } from "../Observer/type";

export interface ISlider extends IObserver<TSliderEvents> {
  update: (
    typeEvent: "updateOptions",
    observerInfoObject: {
      [K in keyof TSliderSettings]: TSliderSettings[K];
    },
  ) => void;
  sliderData: Partial<Record<keyof TSliderSettings, unknown>> | null;
}

export type TSliderSettings = {
  minValue: number;
  maxValue: number;
  container?: JQuery<HTMLElement>;
  stepValue: number;
  showMinMaxValue: boolean;
  showValueFlag: boolean;
  showRuler: boolean;
  minPosition: number;
  maxPosition: number;
  elemForShowValueMin: JQuery<HTMLElement>;
  elemForShowValueMax: JQuery<HTMLElement>;
  lineClass: string;
  progressBarClass: string;
  thumbMinClass: string;
  thumbMaxClass: string;
  showMinValueClass: string;
  showMaxValueClass: string;
  orientation: "horizontal" | "vertical";
  type: "single" | "double";
};

export type TSliderEvents = {
  sliderUpdated: Partial<Record<keyof TSliderSettings, unknown>> | null;
};

export type TUserSliderSettings = Partial<TSliderSettings>;
