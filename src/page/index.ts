import "./styles/main.scss";

import initSliderComplex from "./components/slider-complex/slider-complex";

initSliderComplex(".slider1", {
  type: "single",
  minValue: 0,
  maxValue: 100,
  showMinValueClass: "newMin",
  showMaxValueClass: "newMax",
});
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
