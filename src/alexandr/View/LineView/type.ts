import type { BaseSubViewInterface, SubViewEvents } from "../type";

export interface ILineView extends BaseSubViewInterface {
  setVerticalOrientation: () => void;
  setHorizontalOrientation: () => void;
  destroy: (typeEvent: keyof SubViewEvents) => void;
}
