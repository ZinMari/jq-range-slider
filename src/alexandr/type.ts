interface JQuery {
  alexandr:
  any | ((options: string | AlexandrSettings) => JQuery<HTMLElement>);
}

interface AlexandrSettings {
  minValue?: number;
  maxValue?: number;
  container?: JQuery<HTMLElement>;
  stepValue?: number;
  showMinMaxValue?: boolean;
  showValueFlag?: boolean;
  showRuler?: boolean;
  minPosition?: number;
  maxPosition?: number;
  elemForShowValueMin?: JQuery<HTMLElement>;
  elemForShowValueMax?: JQuery<HTMLElement>;
  lineClass?: string;
  progressBarClass?: string;
  thumbMinClass?: string;
  thumbMaxClass?: string;
  showMinValueClass?: string;
  showMaxValueClass?: string;
  orientation?: "horizontal" | "vertical";
  type?: "single" | "double";
}