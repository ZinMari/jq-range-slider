export interface BaseSubViewInterface extends Observer<SubViewEvents> {
  item: JQuery<HTMLElement>;
}

export interface SubViewEvents {
  clickOnSlider: {
    pixelClick: number;
  };
}