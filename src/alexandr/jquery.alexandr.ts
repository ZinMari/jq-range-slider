import View from "./View/View/View";
import Presenter from "./Presenter/Presenter";
import Model from "./Model/Model";

function requireAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map(r);
}

requireAll(require.context("./View/", true, /\.(scss)$/));

(function ($) {
  class Alexandr {
    presenter: Presenter;

    upgradeModelValues: {
      minValue: number;
      maxValue: number;
      minPosition: number;
      maxPosition: number;
      stepValue: number;
    };

    constructor(options: AlexandrSettings) {
      this.presenter = new Presenter(new View(), new Model());
      this.upgradeModelValues = this.presenter.init(options);
    }
  }

  $.extend(Alexandr.prototype, {
    _initPlugin(
      target: HTMLElement,
      options: AlexandrSettings,
    ): JQuery<HTMLElement> {
      options.container = $(target);

      const alexandr = new Alexandr(options);

      $(target).data("alexandr", alexandr);
      $(target).data(
        "alexandrOptions",
        $.extend(options, alexandr.upgradeModelValues),
      );

      return $(target);
    },
    _refreshPlugin(target: JQuery<HTMLElement>, options: AlexandrSettings) {
      const upgradeOptions = $.extend(
        {},
        $(target).data("alexandrOptions"),
        options,
      );
      this._destroyPlugin(target);
      this._initPlugin(target, upgradeOptions);
    },
    _destroyPlugin(target: JQuery<HTMLElement>) {
      target = $(target);
      target.removeData("alexandr").removeData("alexandrOptions");
      target.find(".alexandr").remove();
      return target;
    },
  });

  function sliderIsInitialized(elem: JQuery<HTMLElement>): boolean {
    return elem.data("alexandr");
  }

  function getOptionsObject(argument: string | AlexandrSettings) {
    return argument === "options";
  }

  function setOptions(argument: string | AlexandrSettings) {
    return typeof argument === "object";
  }

  $.fn.alexandr = function (
    options: string | AlexandrSettings,
  ): JQuery<HTMLElement> {
    const otherArgs = Array.prototype.slice.call(arguments, 1);

    if (!sliderIsInitialized($(this))) {
      const config = $.extend({}, $.fn.alexandr.defaults, options);
      config.container = this;

      const alexandr = new Alexandr(config);

      $(this).data("alexandr", alexandr);
      $(this).data(
        "alexandrOptions",
        $.extend(config, alexandr.upgradeModelValues),
      );

      return this;
    }

    if (sliderIsInitialized($(this)) && getOptionsObject(options)) {
      return $(this).data("alexandrOptions");
    }

    if (sliderIsInitialized($(this)) && setOptions(options)) {
      $(this).data("alexandr")._refreshPlugin($(this), options);
    }
  };

  $.fn.alexandr.defaults = {
    minValue: 1000,
    maxValue: 2000,
    stepValue: 10,
    showMinMaxValue: true,
    orientation: "horizontal",
    type: "double",
    showValueFlag: true,
    showRuler: true,
    minPosition: 10,
    maxPosition: 20,
    elemForShowValueMin: $(".min"),
    elemForShowValueMax: $(".max"),
    lineClass: "",
    progressBarClass: "",
    thumbClass: "",
    thumbMinClass: "",
    thumbMaxClass: "",
    showMinValueClass: "",
    showMaxValueClass: "",
    controlsMinThumb: [],
    controlsMaxThumb: [],
    controlsStepValues: [],
    controlsMinValue: [],
    controlsMaxValue: [],
    controlsFlag: [],
    controlsRuler: [],
  };
})(jQuery);
