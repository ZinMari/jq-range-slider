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
      controlsRuler: [$(slider).find(".js-form__controlRuler")],
      ...options,
    });
}

function setValueToPanel(slider: string): void {
  const $panel: JQuery<HTMLElement> = $(slider).find(
    ".js-slider-complex__panel",
  );

  const sliderOptions: AlexandrSettings = $(slider)
    .find(".js-slider-complex__slider")
    .alexandr("options");

  const $radio: JQuery<HTMLElement> = $panel.find("input[type=radio]");

  $.each($radio, function () {
    const attrName: string = $(this).attr("name");
    if ($(this).attr("value") === sliderOptions[attrName]) {
      $(this).attr("checked", "true");
    }
  });
}

function onChangePanelValue(event: Event) {
  event.preventDefault();
  const $target: JQuery<EventTarget> = $(event.target);
  
  if($target.attr('type') === 'radio'){
    $target
      .closest(".js-slider-complex")
      .find(".js-slider-complex__slider")
      .alexandr({ [$target.attr("name")]: $target.val() });
  }
}

function initSliderComplex(slider: string, options: AlexandrSettings) {
  initSlider(slider, options);
  setValueToPanel(slider);
  $(slider).on("change.alexandr", onChangePanelValue);
}

export default initSliderComplex;
