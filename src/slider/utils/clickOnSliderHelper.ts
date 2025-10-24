import getCoordinates from "./getCoordinates";

const clickOnSliderHelper = (
  pageX: number,
  pageY: number,
  line: JQuery<HTMLElement>,
  orientation: "horizontal" | "vertical",
  notify: (
    eventName: "clickOnSlider",
    data: {
      pixelClick: number;
    },
  ) => void,
) => {
  const sliderLineCoordinates = getCoordinates(line);

  // на скольких пикселях от линии произошел клик
  const pixelClick =
    orientation === "horizontal"
      ? pageX - sliderLineCoordinates.left
      : pageY - sliderLineCoordinates.top;

  notify("clickOnSlider", {
    pixelClick,
  });
};

export default clickOnSliderHelper;
