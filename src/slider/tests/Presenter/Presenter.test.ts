import Presenter from "../../Presenter/Presenter";
import Model from "../../Model/Model";
import View from "../../View/View/View";

import type { TAlexandrSettings } from "../../type";

describe("Презентер:", () => {
  const settingsDefault: TAlexandrSettings = {
    container: $("<div>").attr({ class: "container" }),
    minValue: 1000,
    maxValue: 2000,
    stepValue: 10,
    orientation: "horizontal",
    type: "double",
    showValueFlag: true,
    showRuler: true,
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
  };
  const presenter: Presenter = new Presenter(
    new View(settingsDefault),
    new Model(settingsDefault),
  );

  test("создается", () => {
    expect(presenter).toBeDefined();
  });
});
