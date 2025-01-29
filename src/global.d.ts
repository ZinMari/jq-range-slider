interface JQuery {
  alexandr(props?: object): JQuery;
}

interface AlexandrSettings {
  minValue: number;
  maxValue: number;
  stepValue: number;
  showMinMaxValue: boolean;
  orientation: 'vertical' | 'horizontal';
  type: 'single' | 'double';
  showInput: boolean;
  showValueFlag: boolean;
  showRuler: boolean;
  initialValues: [number, number?];
  elemForShowValueMin: JQuery<HTMLElement>;
  elemForShowValueMax: JQuery<HTMLElement>;
  lineClass: string;
  progressBarClass: string;
  thumbClass: string;
  thumbMinClass: string;
  thumbMaxClass: string;
  showMinValueClass: string;
  showMaxValueClass: string;
  container?: JQuery<HTMLElement>;
  elemForInputMin?: JQuery<HTMLElement>;
  elemForInputMax?: JQuery<HTMLElement>;
}

interface Model {
  minValue: number;
  maxValue: number;
  stepValue: number;
}

interface View {
  container: any;
  slider: any;
  sliderLine: any;
  sliderProgressBar: any;
  sliderThumbs: any;
  sliderOrientation: any;
  sliderInitialValues: any;
  elemForShowValueMin: any;
  elemForShowValueMax: any;
  elemForInputMin: any;
  elemForInputMax: any;
  type: any;
  showInput: any;
  showValueFlag: any;
  showRuler: any;
  inputs: any;
  thumbClass: any;
  thumbMinClass: any;
  thumbMaxClass: any;
  sliderMinMaxValueLine: any;
  presenter: any;
  sliderRuler: any;
  sliderLength: any;
}

interface BaseSubViewInterface {
  item: JQuery<HTMLElement>;
}

interface SliderRulerView extends BaseSubViewInterface {
  dividings: JQuery<HTMLElement>[];
  countDivivdings: number;
}
type ElementsCoords = {
  left: number;
  width: number;
  top: number;
  height: number;
};
