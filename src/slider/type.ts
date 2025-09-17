import { TSliderSettings } from "./Slider/type";

declare global {
  interface JQuery {
    slider: ISliderFunction;
  }
}

interface ISliderFunction {
  (
    options: string | TSliderSettings,
    newOptions?: TSliderSettings | JQuery<HTMLElement> | TSliderConnect,
  ): JQuery<HTMLElement>;
  defaults?: TSliderSettings;
}

type TSliderConnect = (options: TSliderSettings) => void;
export { TSliderSettings };
