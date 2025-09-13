import View from "./View/View/View";
import Presenter from "./Presenter/Presenter";
import Model from "./Model/Model";
import Observer from "./Observer/Observer";

import type { TPresenterEvents } from "./Presenter/type";
import type { IAlexandr, TAlexandrEvents, TSliderSettings } from "./type";

function requireAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map(r);
}

requireAll(require.context("./", true, /\.(scss)$/));

(function ($) {
  class Slider extends Observer<TAlexandrEvents> implements IAlexandr {
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

    initPlugin(
      target: HTMLElement,
      options: TSliderSettings,
    ): JQuery<HTMLElement> {
      options.container = $(target);

      const slider = new Slider(options);
      slider.sliderData = options;

      $(target).data("slider", slider);

      return $(target);
    }

    clearPlugin(target: HTMLElement) {
      const $target = $(target);
      $target.removeData("slider");
      $target.find(".alexandr").remove();
      return target;
    }

    refreshPlugin(options: TSliderSettings) {
      this.presenter.refreshOptions(options);
    }

    destroyPlugin(target: HTMLElement) {
      $(target).data("slider").presenter.destroy();
      $(target).removeData("slider");
    }

    connectToPluginData(
      fn: (options: TAlexandrEvents["sliderUpdated"]) => void,
    ) {
      this.addSubscriber("sliderUpdated", fn);
    }
  }

  function isSliderInitialized(elem: JQuery<HTMLElement>): boolean {
    return elem.data("slider");
  }

  function isGetOptionsObject(argument: string | TSliderSettings) {
    return argument === "options";
  }

  function isSetOptions(option: string | TSliderSettings) {
    return option === "update";
  }

  function isGetOption(slider: Slider, optionName: string | TSliderSettings) {
    return typeof optionName === "string" && optionName in slider.sliderData;
  }

  $.fn.slider = function (
    options: string | TSliderSettings,
  ): JQuery<HTMLElement> {
    if (!isSliderInitialized($(this)) && isSetOptions(options)) {
      return;
    }
    if (!isSliderInitialized($(this))) {
      const config = $.extend({}, $.fn.slider.defaults, options);
      config.container = this;

      const slider = new Slider(config);
      slider.sliderData = config;

      $(this).data("slider", slider);
      return this;
    }

    if (isSliderInitialized($(this)) && options === "destroy") {
      $(this).data("slider").destroyPlugin(this);
      return $(this);
    }

    if (isSliderInitialized($(this)) && options === "connect") {
      $(this).data("slider").connectToPluginData(arguments[1]);
      return $(this);
    }

    if (isSliderInitialized($(this)) && isGetOptionsObject(options)) {
      return $(this).data("slider").sliderData;
    }

    if (isSliderInitialized($(this)) && isSetOptions(options)) {
      $(this).data("slider").refreshPlugin(arguments[1]);
      return $(this);
    }

    if (
      isSliderInitialized($(this)) &&
      isGetOption($(this).data("slider"), options)
    ) {
      return $(this).data("slider").sliderData[String(options)];
    }
  };

  $.fn.slider.defaults = {
    minValue: 1000,
    maxValue: 2000,
    stepValue: 10,
    orientation: "horizontal",
    type: "double",
    showValueFlag: true,
    showRuler: true,
    minPosition: 0,
    maxPosition: 0,
    elemForShowValueMin: $(".min"),
    elemForShowValueMax: $(".max"),
    lineClass: "",
    progressBarClass: "",
    thumbMinClass: "",
    thumbMaxClass: "",
    showMinValueClass: "",
    showMaxValueClass: "",
  };
})(jQuery);
