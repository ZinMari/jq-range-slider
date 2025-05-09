import "./style.scss";

import initSliderComplex from "./components/slider-complex/slider-complex";

initSliderComplex(".slider1", { type: "single", minValue: 0, maxValue: 100 });
initSliderComplex(".slider2", { orientation: "vertical", stepValue: 500 });
initSliderComplex(".slider3", {
  minValue: -10,
  maxValue: 150,
  orientation: "vertical",
});
initSliderComplex(".slider4", {
  showValueFlag: false,
  showRuler: false,
  type: "single",
  minPosition: 900,
});

$(".slider1").children(".slider-complex__slider").alexandr("destroy");
