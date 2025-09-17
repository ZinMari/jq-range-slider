import getCoordinates from "./getCoordinates";

const handlerClickOnSlider = (
  event: PointerEvent,
  line: JQuery<HTMLElement>,
  orientation: "horizontal" | "vertical",
  notify: (
    eventName: "clickOnSlider",
    data: {
      pixelClick: number;
    },
  ) => void,
) => {
  event.preventDefault();
  const target = event.currentTarget;

  if (target instanceof HTMLElement) {
    if (target.classList.contains("slider__thumb")) {
      return;
    }
  }

  const sliderLineCoordinates = getCoordinates(line);

  // на скольких пикселях от линии произошел клик
  const pixelClick =
    orientation === "horizontal"
      ? event.pageX - sliderLineCoordinates.left
      : event.pageY - sliderLineCoordinates.top;

  notify("clickOnSlider", {
    pixelClick,
  });
};

export default handlerClickOnSlider;
