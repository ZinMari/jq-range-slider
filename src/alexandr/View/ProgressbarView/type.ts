export interface ProgressBarView {
  item: JQuery<HTMLElement>;
  update: (data: { from: number; to: number }) => void;
}
