import { TModelEvents } from "../../Model/type";

export interface IProgressBarView {
  item: JQuery<HTMLElement>;
  update: (dataObject: TModelEvents["modelProgressbarUpdated"]) => void;
}
