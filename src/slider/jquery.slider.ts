import Slider from "./Slider/Slider";
import { TSliderSettings, TUserSliderSettings } from "./Slider/type";
import { ISliderFunction } from "./type";

function requireAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map(r);
}

requireAll(require.context("./", true, /\.(scss)$/));

(function ($) {
  function isSliderInitialized(elem: JQuery<HTMLElement>): boolean {
    return elem.data("slider");
  }

  function isGetOptionsObject(argument: string | TSliderSettings) {
    return argument === "options";
  }

  function isSetOptions(option: string | TUserSliderSettings) {
    return option === "update";
  }

  function isGetOption(slider: Slider, optionName: string | TSliderSettings) {
    if (slider.sliderData) {
      return typeof optionName === "string" && optionName in slider.sliderData;
    }
  }

  $.fn.slider = Object.assign(
    function (
      this: JQuery,
      options: string | TSliderSettings,
    ): JQuery<HTMLElement> | undefined {
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
        Slider.destroyPlugin(this);
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
    },
    {
      defaults: {
        minValue: 1000,
        maxValue: 2000,
        stepValue: 10,
        orientation: "horizontal",
        type: "double",
        showValueFlag: true,
        showRuler: true,
        showMinMaxValue: true,
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
      } as TSliderSettings,
    },
  ) as ISliderFunction;
})(jQuery);
