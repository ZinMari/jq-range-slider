import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/dom";
import View from "../../View/View/View";
import getRandomInteger from "../../utils/getRandomInteger";

import type { TSliderSettings } from "../../type";

describe("Вид:", () => {
  const settingsDefault: TSliderSettings = {
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
  describe("Создает сабвью:", () => {
    const view: View = new View(settingsDefault);
    view.setInitialValues();
    test("Кнопки", () => {
      expect(view.thumbs).toBeDefined();
    });
    test("Отображение инимального и максимальным знаечния", () => {
      expect(view.sliderMinMaxValueLine).toBeDefined();
    });
    test("Линейку", () => {
      expect(view.ruler).toBeDefined();
    });
    test("Прогрессбар", () => {
      expect(view.progressbar).toBeDefined();
    });
  });
  describe("Работает с подписчиками:", () => {
    const view: View = new View(settingsDefault);
    view.setInitialValues();
    const subscriber = jest.fn();
    const subscriber2 = jest.fn();
    view.addSubscriber("viewThumbsPositionChanged", subscriber);
    view.addSubscriber("viewThumbsPositionChanged", subscriber2);
    test("Добавляет пописчиков:", () => {
      expect(view.subscribers["viewThumbsPositionChanged"].size).toBe(2);
    });
    test("Удаляет пописчиков:", () => {
      view.removeSubscriber("viewThumbsPositionChanged", subscriber);
      expect(view.subscribers["viewThumbsPositionChanged"].size).toBe(1);
    });
  });
  describe("Вызывет функции обновления в сабвью:", () => {
    const view: View = new View(settingsDefault);
    view.setInitialValues();

    test("Флажков:", () => {
      const spy = jest.spyOn(view.thumbs, "updateFlagValues");
      view.updateFlagValues({
        type: "max",
        currentValue: getRandomInteger(),
      });
      expect(spy).toHaveBeenCalled();
    });
    test("Кнопок:", () => {
      const spy = jest.spyOn(view.thumbs, "updateThumbsPosition");
      view.updateThumbsPosition({
        type: "min",
        pixelPosition: getRandomInteger(),
        moveDirection: "left",
      });
      expect(spy).toHaveBeenCalled();
    });
    test("Типа слайдера:", () => {
      const spy = jest.spyOn(view.thumbs, "updateType");
      view.updateType({
        type: "double",
      });
      expect(spy).toHaveBeenCalled();
    });
    test("Минимального и максимального значения:", () => {
      const spy = jest.spyOn(view.sliderMinMaxValueLine, "update");
      view.updateMinMaxValueLine({
        min: getRandomInteger(),
        max: getRandomInteger(),
      });
      expect(spy).toHaveBeenCalled();
    });
    test("Прогрессбара:", () => {
      const spy = jest.spyOn(view.progressbar, "update");
      view.updateProgressBar({
        orientation: "horizontal",
        from: getRandomInteger(),
        to: getRandomInteger(),
      });
      expect(spy).toHaveBeenCalled();
    });
  });
  describe("Вертикальная ориентация устанавливается:", () => {
    const view: View = new View(settingsDefault);
    view.setInitialValues();
    view.updateOrientation({ orientation: "vertical" });

    test("Добавляется класс на кнопки:", () => {
      expect(view.thumbs.minThumb[0]).toHaveClass(
        "slider__thumb_type_vertical",
      );
    });

    test("При установке горизонтальной ориентации, на линейке нет класса для установки вертикальной ориентации:", () => {
      view.updateOrientation({ orientation: "horizontal" });
      expect(view.ruler.item[0]).not.toHaveClass("slider__ruler_type_vertical");
    });
  });
  describe("Линейка устанавливает значения:", () => {
    const view: View = new View(settingsDefault);
    view.setInitialValues();

    view.updateRuler({ min: 0, max: 50 });

    const divisions = view.ruler.divisions.map(elem => {
      return elem.attr("data-dividing");
    });

    test("При вызове функции updateRuler значения устанавливаются в линейку:", () => {
      expect(divisions.every(elem => elem !== undefined)).toBeTruthy();
    });
  });
  describe("Клик по линейке работает:", () => {
    const view: View = new View(settingsDefault);
    view.setInitialValues();

    const spyHandler = jest.spyOn(view.ruler, "handler");
    fireEvent.pointerDown(view.ruler.item[0]);

    test("Функция handler вызывается ", () => {
      expect(spyHandler).toHaveBeenCalled();
    });
  });
  describe("Слайдер:", () => {
    const container = $("<div>").attr({ class: "test-container" });
    const settings = Object.assign(settingsDefault, {
      container,
    });
    const view: View = new View(settings);
    view.setInitialValues();
    $("body").append(container);

    const line = container.find(".slider__line")[0];

    test("добавляется в DOM:", () => {
      expect(line).not.toBe(null);
    });

    test("Для линии устанавливается вертикальная ориентация", () => {
      view.updateOrientation({ orientation: "vertical" });
      expect(line).toHaveClass("slider__line_type_vertical");
    });
    container.remove();
  });
});
