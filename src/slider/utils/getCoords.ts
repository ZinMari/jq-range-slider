export type TElementsCoords = {
  left: number;
  width: number;
  top: number;
  height: number;
};

export default function getCoords(elem: JQuery<EventTarget>): TElementsCoords {
  const boxLeft = elem.offset().left;
  const boxRight = boxLeft + elem.outerWidth();
  const boxTop = elem.offset().top;
  const boxBottom = boxTop + elem.outerHeight();

  return {
    left: boxLeft + window.scrollX,
    width: boxRight - boxLeft,
    top: boxTop + window.scrollY,
    height: boxBottom - boxTop,
  };
}
