// @ts-nocheck
import View from "../View/View/View";
import Presenter from "../Presenter/Presenter";
import Model from "../Model/Model";
import Observer from "../Observer/Observer";

import type { TPresenterEvents } from "../Presenter/type";
import {
  ISlider,
  TSliderEvents,
  TSliderSettings,
  TUserSliderSettings,
} from "./type";

export default class Slider extends Observer<TSliderEvents> implements ISlider {
  private presenter: Presenter;
  sliderData: Partial<TSliderSettings> | null = null;

  constructor(options: TSliderSettings) {
    super();
    this.presenter = new Presenter(
      new View({ ...options }),
      new Model({ ...options }),
    );

    this.presenter.addSubscriber("updateOptions", this.update);
  }

  update = (dataOptions: TPresenterEvents["updateOptions"]) => {
    this.sliderData = Object.assign(this.sliderData, dataOptions);
    this.notify("sliderUpdated", this.sliderData);
  };

  refreshPlugin(options: TUserSliderSettings) {
    this.presenter.refreshOptions(options);
  }

  connectToPluginData(fn: (options: TSliderEvents["sliderUpdated"]) => void) {
    this.addSubscriber("sliderUpdated", fn);
  }

  static destroyPlugin(target: HTMLElement) {
    $(target).data("slider").presenter.destroy();
    $(target).removeData("slider");
  }
}
