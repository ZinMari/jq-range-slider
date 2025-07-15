import Model from "../../Model/Model";
import getRandomInteger from "../../utils/getRandomInteger";

describe("Модель:", () => {
  const settingsDefault: AlexandrSettings = {
    minValue: 5,
    maxValue: 0,
    stepValue: 10,
    orientation: "horizontal",
    type: "double",
    showValueFlag: true,
    showRuler: true,
    minPosition: 0,
    maxPosition: 0,
  };

  const coords: ElementsCoords = {
    left: getRandomInteger(),
    width: getRandomInteger(),
    top: getRandomInteger(),
    height: getRandomInteger(),
  };

  describe("Минимальное значение слайдера всегда меньше максимального:", () => {
    test("при minValue=5 maxValue=0", () => {
      const model: Model = new Model(settingsDefault);
      expect(model.minValue < model.maxValue).toBeTruthy();
    });
  });
  describe("Значение шага всегда больше нуля:", () => {
    test("при заданном значении 0", () => {
      const settings = Object.assign(settingsDefault, { stepValue: 0 });
      const model: Model = new Model(settings);
      expect(model.stepValue).toBeGreaterThan(0);
    });
    test("при заданном отрицательном значении -100", () => {
      const settings = Object.assign(settingsDefault, { stepValue: -100 });
      const model: Model = new Model(settings);
      expect(model.stepValue).toBeGreaterThan(0);
    });
  });
  describe("Функция установки ориентации меняет ориентацию:", () => {
    test("Установка вертикальной ориентации", () => {
      const settings = Object.assign(settingsDefault, {
        orientation: "horizontal",
      });
      const model: Model = new Model(settings);
      model.setOrientation("vertical");
      expect(model.orientation).toBe("vertical");
    });
  });
  describe("При изменении типа слайдера с диапазона на одиночное значение, данные второго ползунка сбрасываются :", () => {
    test("", () => {
      const settings: AlexandrSettings = Object.assign(settingsDefault, {
        type: "double",
      });
      const model: Model = new Model(settings);
      model.setType("single");
      expect(model.maxPosition).toBeNull();
    });
  });
  describe("После вызова updateThumbPosition, позиция ползунка была изменена:", () => {
    test("", () => {
      const model: Model = new Model(settingsDefault);
      const options: UpdateThumbData = {
        type: "max",
        shiftClickThumb: getRandomInteger(),
        lineCoords: coords,
        thumbCoords: coords,
        clientEvent: getRandomInteger(),
        clientLineCoordsOffset: getRandomInteger(),
        clientLineCoordsSize: getRandomInteger(),
        clientThumbCoordsSize: getRandomInteger(),
      };
      const oldThumbPosition = model.maxThumbPixelPosition;
      model.updateThumbPosition(options);
      expect(model.maxThumbPixelPosition).not.toBe(oldThumbPosition);
    });
  });
  describe("Подписка на события прогрессбара работает:", () => {
    test("", () => {
      const model: Model = new Model(settingsDefault);
      const subscriber = jest.fn();
      model.addSubscriber("modelProgressbarUpdated", subscriber);
      model.setProgressBarSize();
      expect(subscriber).toHaveBeenCalled();
    });
  });
  describe("Подписка на события установки линейки работает:", () => {
    test("", () => {
      const model: Model = new Model(settingsDefault);
      const subscriber = jest.fn();
      model.addSubscriber("modelSetRulerChanged", subscriber);
      model.setRuler(true);
      expect(subscriber).toHaveBeenCalled();
    });
  });
  describe("При диапазоне, минимальное положение ползунка, всегда меньше максимального:", () => {
    const model: Model = new Model(settingsDefault);
    model.pixelInOneStep = getRandomInteger();
    model.sliderLength = getRandomInteger();

    test("при минползунке 300 и максползунке 100", () => {
      model.setThumbsPosition("min", 300);
      model.setThumbsPosition("max", 100);
      expect(model.minPosition).toBeLessThan(model.maxPosition);
    });

    test("при минползунке 300 и максползунке 300", () => {
      model.setThumbsPosition("min", 300);
      model.setThumbsPosition("max", 300);
      expect(model.minPosition).toBeLessThan(model.maxPosition);
    });
  });
  describe("При установке нового значения шага он будет в допустимом диапазоне:", () => {
    test("при минзначении слайдера 100 и максзначении слайдера 200 и  шаге 300", () => {
      const settings: AlexandrSettings = Object.assign(settingsDefault, {
        minValue: 100,
        maxValue: 200,
      });
      const model: Model = new Model(settings);
      model.setStepValue(300);
      expect(model.stepValue).toBeLessThanOrEqual(
        model.maxValue - model.minValue,
      );
    });
    test("при минзначении слайдера 100 и максзначении слайдера 200 и  шаге -300", () => {
      const settings: AlexandrSettings = Object.assign(settingsDefault, {
        minValue: 100,
        maxValue: 200,
      });
      const model: Model = new Model(settings);
      model.setStepValue(-300);
      expect(model.stepValue).toBeGreaterThan(0);
    });
  });
  describe("При установке нового максимального значения слайдера оно больше минимального:", () => {
    test("при минзначении слайдера 100 и и новом максимальном значении -30", () => {
      const settings: AlexandrSettings = Object.assign(settingsDefault, {
        minValue: 100,
        maxValue: 200,
      });
      const model: Model = new Model(settings);
      model.setMaxValue(-30);
      expect(model.maxValue).toBeGreaterThan(model.minValue);
    });
  });
  describe("При установке нового минимального значения слайдера оно меньше максимального:", () => {
    test("при максзначении слайдера 100 и и новом минимальном значении 300", () => {
      const settings: AlexandrSettings = Object.assign(settingsDefault, {
        maxValue: 100,
      });
      const model: Model = new Model(settings);
      model.setMinValue(300);
      expect(model.minValue).toBeLessThan(model.maxValue);
    });
  });
  describe("При срабатывании клика по слайдеру: ", () => {
    test("вызывается функции установки нового значения ползунка:", () => {
      const model: Model = new Model(settingsDefault);
      const spy = jest.spyOn(model, "setThumbsPosition");
      model.clickOnSlider({ pixelClick: getRandomInteger() });
      expect(spy).toHaveBeenCalled();
    });
  });
  describe("Подписчики модели удаляются: ", () => {
    test("Подписчик на флажки:", () => {
      const model: Model = new Model(settingsDefault);
      const fn = jest.fn();
      model.addSubscriber("modelShowFlagChanged", fn);
      model.removeSubscriber("modelShowFlagChanged", fn);
      expect(model.subscribers.modelShowFlagChanged.size).toBe(0);
    });
  });
});
