import type { TSliderSettings } from "../../../slider/type";

function initSlider(slider: string, options: TSliderSettings): void {
  $(slider)
    .children(".slider-complex__slider")
    .slider(options)
    .slider("connect", onSliderValueChange);
}

function setValueToPanel(slider: string): void {
  const $panel: JQuery<HTMLElement> = $(slider).find(
    ".js-slider-complex__panel",
  );

  const sliderOptions: TSliderSettings = $(slider)
    .find(".js-slider-complex__slider")
    .slider("options") as TSliderSettings;

  const $radio: JQuery<HTMLElement> = $panel.find("input[type=radio]");
  const $checkbox: JQuery<HTMLElement> = $panel.find("input[type=checkbox]");
  const $number: JQuery<HTMLElement> = $panel.find("input[type=number]");

  $.each($radio, function () {
    const attrName: string = $(this).attr("name");
    if (
      $(this).attr("value") === sliderOptions[attrName as keyof TSliderSettings]
    ) {
      $(this).prop("checked", "true");
    }
  });

  $.each($number, function () {
    const attrName: string = $(this).attr("name");
    $(this).attr(
      "value",
      sliderOptions[attrName as keyof TSliderSettings].toString(),
    );
  });

  $.each($checkbox, function () {
    const attrName: string = $(this).attr("name");
    $(this).prop("checked", sliderOptions[attrName as keyof TSliderSettings]);
  });
}

function onChangePanelValue(event: Event) {
  event.preventDefault();

  const $target: JQuery<EventTarget> = $(event.target);
  const attrType = $target.attr("type");

  if (attrType === "radio" || attrType === "number") {
    $target
      .closest(".js-slider-complex")
      .find(".js-slider-complex__slider")
      .slider("update", { [$target.attr("name")]: $target.val() });
  }

  if (attrType === "checkbox") {
    $target
      .closest(".js-slider-complex")
      .find(".js-slider-complex__slider")
      .slider("update", { [$target.attr("name")]: $target.prop("checked") });
  }
}

function onSliderValueChange(options: TSliderSettings) {
  const $panel = options.container.parent().find(".js-slider-complex__panel");
  $panel.find(".js-form__controlMinThumb").val(options.minPosition);
  $panel.find(".js-form__controlMaxThumb").val(options.maxPosition);
  $panel.find(".js-form__controlMinValue").val(options.minValue);
  $panel.find(".js-form__controlMaxValue").val(options.maxValue);
  $panel.find(".js-form__controlStep").val(options.stepValue);
  $panel.find(".js-form__controlFlag").prop("checked", options.showValueFlag);
  $panel.find(".js-form__controlRuler").prop("checked", options.showRuler);
}

function initSliderComplex(slider: string, options: TSliderSettings) {
  initSlider(slider, options);
  setValueToPanel(slider);
  $(slider).on("change.alexandr", onChangePanelValue);
}

export default initSliderComplex;
