import type { IObserver } from "../Observer/type";

export interface BaseSubViewInterface extends IObserver<SubViewEvents> {
  item: JQuery<HTMLElement>;
}

export interface SubViewEvents {
  clickOnSlider: {
    pixelClick: number;
  };
}
