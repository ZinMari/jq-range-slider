export interface MinMaxValueLineView {
  item: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;
  update: (min: number, max: number) => void;
}