export interface IProgressBarView {
  item: JQuery<HTMLElement>;
  update: (data: { from: number; to: number }) => void;
}
