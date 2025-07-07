import View from "./View/View/View";
import Presenter from "./Presenter/Presenter";
import Model from "./Model/Model";
import Observer from "./Observer/Observer";

function requireAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map(r);
}

requireAll(require.context("./", true, /\.(scss)$/));

(function ($) {
  class Alexandr extends Observer<AlexandrEvents>{
    private presenter: Presenter;
    sliderData: AlexandrSettings = null;

    constructor(options: AlexandrSettings) {
      super();
      this.presenter = new Presenter(new View(), new Model());
      this.presenter.init(options);

      this.presenter.addSubscriber("updateOptions", this.updateOptions);
    }

    updateOptions = (dataOptions: PresenterEvents["updateOptions"]) => {
      this.sliderData[dataOptions.propName] = dataOptions.propValue;
      this.notify("sliderUpdated", this.sliderData)
    };

    initPlugin(
      target: HTMLElement,
      options: AlexandrSettings,
    ): JQuery<HTMLElement> {
      options.container = $(target);

      const alexandr = new Alexandr(options);
      alexandr.sliderData = options;

      $(target).data("alexandr", alexandr);

      return $(target);
    }

    clearPlugin(target: HTMLElement) {
      const jqtarget = $(target);
      jqtarget.removeData("alexandr");
      jqtarget.find(".alexandr").remove();
      return target;
    }

    refreshPlugin(target: HTMLElement, options: AlexandrSettings) {
      const upgradeOptions = $.extend(
        {},
        $(target).data("alexandr").sliderData,
        options,
      );
      this.clearPlugin(target);
      this.initPlugin(target, upgradeOptions);
    }

    destroyPlugin(target: HTMLElement) {
      $(target).data("alexandr").presenter.destroy();
      $(target).removeData("alexandr");
    }

    connectToPluginData(fn: any){
      this.addSubscriber("sliderUpdated", fn)
    }
  }

  function isSliderInitialized(elem: JQuery<HTMLElement>): boolean {
    return elem.data("alexandr");
  }

  function isGetOptionsObject(argument: string | AlexandrSettings) {
    return argument === "options";
  }

  function isSetOptions(option: string | AlexandrSettings) {
    return option === "update";
  }

  function isGetOption(
    slider: Alexandr,
    optionName: string | AlexandrSettings,
  ) {
    return typeof optionName === "string" && optionName in slider.sliderData;
  }

  $.fn.alexandr = function (
    options: string | AlexandrSettings,
): JQuery<HTMLElement> {
    if (!isSliderInitialized($(this)) && isSetOptions(options)) {
      return;
    }
    if (!isSliderInitialized($(this))) {
      const config = $.extend({}, $.fn.alexandr.defaults, options);
      config.container = this;

      const alexandr = new Alexandr(config);
      alexandr.sliderData = config;

      $(this).data("alexandr", alexandr);
      return this;
    }

    if (isSliderInitialized($(this)) && options === "destroy") {
      $(this).data("alexandr").destroyPlugin(this);
      return $(this);
    }

    if (isSliderInitialized($(this)) && options === "connect") {
      $(this).data("alexandr").connectToPluginData(arguments[1]);
      return $(this);
    }

    if (isSliderInitialized($(this)) && isGetOptionsObject(options)) {
      return $(this).data("alexandr").sliderData;
    }

    if (isSliderInitialized($(this)) && isSetOptions(options)) {
      $(this).data("alexandr").refreshPlugin(this, arguments[1]);
      return $(this);
    }

    if (
      isSliderInitialized($(this)) &&
      isGetOption($(this).data("alexandr"), options)
    ) {
      return $(this).data("alexandr").sliderData[String(options)];
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
  };
})(jQuery);
