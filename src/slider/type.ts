import { TSliderSettings, TUserSliderSettings } from "./Slider/type";

declare global {
  interface JQuery {
    slider: ISliderFunction;
  }
}

interface ISliderFunction {
  (
    options: string | TUserSliderSettings,
    newOptions?: TUserSliderSettings | JQuery<HTMLElement> | TSliderConnect,
  ): JQuery<HTMLElement>;
  defaults: TSliderSettings;
}

type TSliderConnect = (options: TSliderSettings) => void;
