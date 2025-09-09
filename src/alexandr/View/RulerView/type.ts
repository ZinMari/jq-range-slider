import type { BaseSubViewInterface } from "../type";

export interface RulerView extends BaseSubViewInterface {
  divisions: JQuery<HTMLElement>[];
  countDivisions: number;
  update: (min: number, max: number) => void;
  showRuler: () => void;
  hideRuler: () => void;
}
