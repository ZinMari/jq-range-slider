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
    const attrName: string | undefined = $(this).attr("name");
    if (
      $(this).attr("value") === sliderOptions[attrName as keyof TSliderSettings]
    ) {
      $(this).prop("checked", "true");
    }
  });

  $.each($number, function () {
    const attrName: string | undefined = $(this).attr("name");
    if (attrName && sliderOptions) {
      const value = sliderOptions[attrName as keyof TSliderSettings];
      if (value !== undefined) {
        $(this).attr("value", value.toString());
      }
    }
  });

  $.each($checkbox, function () {
    const attrName: string | undefined = $(this).attr("name");
    $(this).prop("checked", sliderOptions[attrName as keyof TSliderSettings]);
  });
}

function onChangePanelValue(event: Event) {
  event.preventDefault();

  const targetElement = event.target as HTMLElement | null;

  if (targetElement) {
    const $target: JQuery<EventTarget> = $(targetElement);
    const attrType = $target.attr("type");
    const nameAttr = $target.attr("name");

    if (nameAttr) {
      if (attrType === "radio" || attrType === "number") {
        $target
          .closest(".js-slider-complex")
          .find(".js-slider-complex__slider")
          .slider("update", { [nameAttr]: $target.val() });
      }

      if (attrType === "checkbox") {
        $target
          .closest(".js-slider-complex")
          .find(".js-slider-complex__slider")
          .slider("update", { [nameAttr]: $target.prop("checked") });
      }
    }
  }
}

function onSliderValueChange(options: TSliderSettings) {
  const $panel = options.container?.parent().find(".js-slider-complex__panel");
  if ($panel) {
    $panel.find(".js-form__controlMinThumb").val(options.minPosition ?? 0);
    $panel.find(".js-form__controlMaxThumb").val(options.maxPosition ?? 0);
    $panel.find(".js-form__controlMinValue").val(options.minValue ?? 0);
    $panel.find(".js-form__controlMaxValue").val(options.maxValue ?? 0);
    $panel.find(".js-form__controlStep").val(options.stepValue ?? 0);
    $panel.find(".js-form__controlFlag").prop("checked", options.showValueFlag);
    $panel.find(".js-form__controlRuler").prop("checked", options.showRuler);
  }
}

function initSliderComplex(slider: string, options: TSliderSettings) {
  initSlider(slider, options);
  setValueToPanel(slider);
  $(slider).on("change.slider", onChangePanelValue);
}

export default initSliderComplex;
