function initSlider(slider: string, options: AlexandrSettings): void {
  $(slider)
    .children(".slider-complex__slider")
    .alexandr({
      controlsMinThumb: [$(slider).find(".js-form__controlMinThumb")],
      controlsMaxThumb: [$(slider).find(".js-form__controlMaxThumb")],
      controlsMinValue: [$(slider).find(".js-form__controlMinValue")],
      controlsMaxValue: [$(slider).find(".js-form__controlMaxValue")],
      controlsStepValues: [$(slider).find(".js-form__controlStep")],
      controlsFlag: [$(slider).find(".js-form__controlFlag")],
      ...options,
    });
}

// function setValueToPanel(slider: string): void {
//   const $panel: JQuery<HTMLElement> = $(slider).find(
//     ".js-slider-complex__panel",
//   );
//   const sliderOptions: AlexandrSettings = $(slider)
//     .find(".js-slider-complex__slider")
//     .alexandr("options");

//   const $inputs: JQuery<HTMLElement> = $panel.find("input");

//   $.each($inputs, function () {
//     const attrName: string = $(this).attr("name");
//     const attrNameInSliderOptions = attrName in sliderOptions;
//     switch ($(this).attr("type")) {
//       case "radio": {
//         if ($(this).attr("value") === sliderOptions[attrName]) {
//           $(this).attr("checked", "true");
//         }
//         break;
//       }
//       case "number": {
//         if (attrNameInSliderOptions) {
//           $(this).val(sliderOptions[attrName].toString());
//         }
//         break;
//       }
//       case "checkbox": {
//         if (sliderOptions[attrName]) {
//           $(this).attr("checked", "true");
//         }
//         break;
//       }
//     }
//   });
// }

function onChangePanelValue(event: Event) {
  event.preventDefault();
  const $target: JQuery<EventTarget> = $(event.target);

  if (
    $target.hasClass("js-form__controlMinThumb") ||
    $target.hasClass("js-form__controlMaxThumb") ||
    $target.hasClass("js-form__controlMinValue") ||
    $target.hasClass("js-form__controlMaxValue")
  ) {
    return;
  }

  if ($target.attr("type") === "checkbox") {
    $target
      .closest(".js-slider-complex")
      .find(".js-slider-complex__slider")
      .alexandr("options", { [$target.attr("name")]: $target.prop("checked") });
  } else {
    $target
      .closest(".js-slider-complex")
      .find(".js-slider-complex__slider")
      .alexandr("options", { [$target.attr("name")]: $target.val() });
  }
}

function initSliderComplex(slider: string, options: AlexandrSettings) {
  initSlider(slider, options);
  // setValueToPanel(slider);
  $(slider).on("change.alexandr", onChangePanelValue);
}

export default initSliderComplex;
