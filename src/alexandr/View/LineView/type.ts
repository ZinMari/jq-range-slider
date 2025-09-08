export interface LineViewInterface extends BaseSubViewInterface {
  setVerticalOrientation: () => void;
  setHorizontalOrientation: () => void;
  destroy: (typeEvent: keyof SubViewEvents) => void;
}