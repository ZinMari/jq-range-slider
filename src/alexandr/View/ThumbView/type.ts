import type { TElementsCoords } from "../../utils/getCoords";

export interface IThumbView {
  showFlag: () => void;
  hideFlag: () => void;
  updateFlagValues: (thumb: "min" | "max", position: number) => void;
  updateThumbsPosition: (
    thumb: "min" | "max",
    position: number,
    moveDirection: "top" | "left",
  ) => void;
}

export type TThumbViewEvents = {
  thumbsPositionChanged: {
    type: "max" | "min";
    currentValue: number;
    moveDirection: "top" | "left";
  };
  updateThumbPosition: TUpdateThumbData;
};

export type TUpdateThumbData = {
  type: "max" | "min";
  shiftClickThumb: number;
  lineCoords: TElementsCoords;
  thumbCoords: TElementsCoords;
  clientEvent: number;
  clientLineCoordsOffset: number;
  clientLineCoordsSize: number;
  clientThumbCoordsSize: number;
};
