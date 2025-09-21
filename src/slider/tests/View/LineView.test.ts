// @ts-nocheck
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/dom";
import LineView from "../../View/LineView/LineView";
import getRandomInteger from "../../utils/getRandomInteger";

describe("Линия:", () => {
  const line: LineView = new LineView("test-class");
  test("Создается:", () => {
    expect(line.item).toBeDefined();
  });
  test("Удаляется:", () => {
    const subscriber = jest.fn();
    line.addSubscriber("clickOnSlider", subscriber);
    line.destroy("clickOnSlider");
    expect(line.subscribers.clickOnSlider.size).toBe(0);
  });
});
