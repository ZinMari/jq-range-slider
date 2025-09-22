export type TElementsCoordinates = {
  left: number;
  width: number;
  top: number;
  height: number;
};

export default function getCoordinates(
  elem: JQuery<EventTarget>,
): TElementsCoordinates {
  const offset = elem.offset();
  const width = elem.outerWidth();
  const height = elem.outerHeight();

  if (!offset || !width || !height) {
    throw new Error();
  }

  return {
    left: offset.left + window.scrollX,
    width,
    top: offset.top + window.scrollY,
    height,
  };
}
