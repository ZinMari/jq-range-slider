import type { IBaseSubView } from "../type";

export interface IRulerView extends IBaseSubView {
  divisions: JQuery<HTMLElement>[];
  countDivisions: number;
  update: (min: number, max: number) => void;
  showRuler: () => void;
  hideRuler: () => void;
}
