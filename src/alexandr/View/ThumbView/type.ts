export interface ThumbView {
  showFlag: () => void;
  hideFlag: () => void;
  updateFlagValues: (thumb: "min" | "max", position: number) => void;
  updateThumbsPosition: (
    thumb: "min" | "max",
    position: number,
    moveDirection: "top" | "left",
  ) => void;
}

export interface ThumbViewEvents {
  thumbsPositionChanged: {
    type: "max" | "min";
    currentValue: number;
    moveDirection: "top" | "left";
  };
  updateThumbPosition: UpdateThumbData;
}

export interface UpdateThumbData {
  type: "max" | "min";
  shiftClickThumb: number;
  lineCoords: ElementsCoords;
  thumbCoords: ElementsCoords;
  clientEvent: number;
  clientLineCoordsOffset: number;
  clientLineCoordsSize: number;
  clientThumbCoordsSize: number;
}