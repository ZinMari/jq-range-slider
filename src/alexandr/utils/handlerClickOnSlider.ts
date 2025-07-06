import getCoords from "./getCoords";

const handlerClickOnSlider = (
  event: PointerEvent,
  line: JQuery<HTMLElement>,
  orientation: "horizontal" | "vertical",
  notify: (
    eventName: "clicOnSlider",
    data: {
      pixelClick: number;
    },
  ) => void,
) => {
  event.preventDefault();
  const target = event.currentTarget;

  if (target instanceof HTMLElement) {
    if (target.classList.contains("alexandr__thumb")) {
      return;
    }
  }

  const sliderLineCoords = getCoords(line);

  // на скольких пикселях от линии произошел клик
  const pixelClick =
    orientation === "horizontal"
      ? event.pageX - sliderLineCoords.left
      : event.pageY - sliderLineCoords.top;

  notify("clicOnSlider", {
    pixelClick,
  });
};

export default handlerClickOnSlider;
