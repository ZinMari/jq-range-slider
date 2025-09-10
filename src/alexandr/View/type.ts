import type { IObserver } from "../Observer/type";

export interface IBaseSubView extends IObserver<TSubViewEvents> {
  item: JQuery<HTMLElement>;
}

export type TSubViewEvents = {
  clickOnSlider: {
    pixelClick: number;
  };
};
