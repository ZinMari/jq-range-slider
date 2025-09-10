import type { IBaseSubView, TSubViewEvents } from "../type";

export interface ILineView extends IBaseSubView {
  setVerticalOrientation: () => void;
  setHorizontalOrientation: () => void;
  destroy: (typeEvent: keyof TSubViewEvents) => void;
}
