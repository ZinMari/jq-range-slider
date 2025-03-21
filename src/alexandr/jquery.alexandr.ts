/*eslint no-undef: "off"*/

import SliderView from "./View/SliderView";
import SliderPresenter from "./Presenter/SliderPresenter";
import SliderModel from "./Model/SliderModel";
import "./jquery.alexandr.scss";
// import './theme-dark.scss';

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
      this.presenter = new SliderPresenter(new SliderView(), new SliderModel());
      this.upgradeModelValues = this.presenter.init(options);
    }
  }

  $.extend(Alexandr.prototype, {
    _initPlugin(
      target: HTMLElement,
      options: AlexandrSettings,
    ): JQuery<HTMLElement> {
      const alexandr = new Alexandr(options);
      $(target).data("alexandr", alexandr);
      $(target).data(
        "alexandrOptions",
        $.extend(options, alexandr.upgradeModelValues),
      );
      return $(target);
    },
    _optionPlugin(
      target: JQuery<HTMLElement>,
      options: AlexandrSettingsKeys | AlexandrSettings,
      value?: string,
    ):
      | string
      | number
      | boolean
      | JQuery<HTMLElement>
      | [JQuery<HTMLElement>]
      | AlexandrSettings {
      target = $(target);
      const inst: AlexandrSettings | undefined = target.data("alexandrOptions");

      const optionsIsString = typeof options == "string";
      const valueNotPass = value == null;

      if (!options || (optionsIsString && valueNotPass)) {
        const name: AlexandrSettingsKeys = options as AlexandrSettingsKeys;
        options = inst || {};
        return options && name ? options[name] : options;
      }

      options = options || {};

      if (typeof options === "string") {
        const name: AlexandrSettingsKeys = options as AlexandrSettingsKeys;
        options = {
          [name]: value,
        };
      }

      this._refreshPlugin(target, $.extend(inst, options));
    },

    _refreshPlugin(target: JQuery<HTMLElement>, options: AlexandrSettings) {
      this._destroyPlugin(target);
      this._initPlugin(target, options);
    },

    _destroyPlugin(target: JQuery<HTMLElement>) {
      target = $(target);
      target.removeData("alexandr").removeData("alexandrOptions");
      target.find(".alexandr").remove();
      return target;
    },
  });

  function isNotChained(
    method: string | AlexandrSettings,
    otherArgs: Array<string> | undefined,
  ): boolean {
    const isRequestOptionObject = method === "option";
    const requestEntireOptionsObject = otherArgs.length === 0;
    const requestOneProperty =
      otherArgs.length === 1 && typeof otherArgs[0] === "string";

    if (
      isRequestOptionObject &&
      (requestEntireOptionsObject || requestOneProperty)
    ) {
      return true;
    }
  }

  function sliderIsInitialized(elem: JQuery<HTMLElement>): boolean {
    return elem.data("alexandr");
  }

  function isMethod(options: string | AlexandrSettings): boolean {
    return typeof options === "string";
  }

  $.fn.alexandr = function (
    options: string | AlexandrSettings,
    ...restOptions: []
  ): JQuery<HTMLElement> {
    const otherArgs = Array.prototype.slice.call(restOptions, 1);

    if (isNotChained(options, otherArgs)) {
      const plugin = $(this).data("alexandr");
      return plugin["_" + options + "Plugin"].call(
        plugin,
        this[0],
        ...otherArgs,
      );
    }

    const config = $.extend({}, $.fn.alexandr.defaults, options);
    config.container = this;

    return this.each(function () {
      if (isMethod(options) && sliderIsInitialized($(this))) {
        const plugin = $(this).data("alexandr");

        if (!plugin["_" + options + "Plugin"]) {
          throw "Unknown method: " + options;
        }

        plugin["_" + options + "Plugin"].call(plugin, this[0], ...otherArgs);
      } else if (!sliderIsInitialized($(this))) {
        const alexandr = new Alexandr(config);
        $(this).data("alexandr", alexandr);
        $(this).data(
          "alexandrOptions",
          $.extend(config, alexandr.upgradeModelValues),
        );
      }
    });
  };

  $.fn.alexandr.defaults = {
    minValue: 1000,
    maxValue: 1000,
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
  };
})(jQuery);
