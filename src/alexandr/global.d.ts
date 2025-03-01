interface JQuery {
  alexandr: any;
}

interface JQueryStatic {
  alexandr: any;
}

interface AlexandrSettings {
  minValue?: number;
  maxValue?: number;
  stepValue?: number;
  minPosition: number;
  maxPosition: number;
  showMinMaxValue?: boolean;
  orientation?: 'vertical' | 'horizontal';
  type?: 'single' | 'double';
  showInput?: boolean;
  showValueFlag?: boolean;
  showRuler?: boolean;
  elemForShowValueMin?: JQuery<HTMLElement>;
  elemForShowValueMax?: JQuery<HTMLElement>;
  lineClass?: string;
  progressBarClass?: string;
  thumbClass?: string;
  thumbMinClass?: string;
  thumbMaxClass?: string;
  showMinValueClass?: string;
  showMaxValueClass?: string;
  container?: JQuery<HTMLElement>;
  elemForInputMin?: JQuery<HTMLElement>;
  elemForInputMax?: JQuery<HTMLElement>;
}

interface Model {
  minValue: number;
  maxValue: number;
  minPosition: number;
  maxPosition: number;
  stepValue: number;
  type: 'single' | 'double';
  onThumbsPositionChanged?: (type: 'min' | 'max', position: number) => void;
  onStepValueChenged?: (minValue: number, maxValue: number, stepValue: number) => void;
  onMinMaxValuesChanged?: (minValue: number, maxValue: number) => void;
  init: any;
  setMinValue: (minValue: number) => void;
  setMaxValue: (maxValue: number) => void;
  setStepValue: (stepValue: number) => void;
  setMinPosition: (minPosition: number) => void;
  setMaxPosition: (setMaxPosition: number) => void;
  bindThumbsPositionChanged: (callback: (type: 'min' | 'max', position: number) => void)=> void;
  bindStepValueChanged: (callback: (minValue: number, maxValue: number, stepValue: number) => void)=> void;
  bindMinMaxValuesChanged: (callback: (minValue: number, maxValue: number) => void)=> void
  validatePosition: (value: number)=> number;
  validateDoublePosition: (type: 'min' | 'max', value: number)=> number;
  equateValueToStep: (value: number)=> number;
}

interface BaseSubViewInterface {
  item: JQuery<HTMLElement>;
}

interface SliderRulerView extends BaseSubViewInterface {
  dividings: JQuery<HTMLElement>[];
  countDivivdings: number;
}

interface SliderMinMaxValueLineView {
  wrap: JQuery<HTMLElement>;
  min: JQuery<HTMLElement>;
  max: JQuery<HTMLElement>;
}

type ElementsCoords = {
  left: number;
  width: number;
  top: number;
  height: number;
};

interface View {
  slider: JQuery<HTMLElement>;
    thumbs: Array<BaseSubViewInterface>;
    container: JQuery<HTMLElement>;
    line: BaseSubViewInterface;
    moveDirection: 'top' | 'left';
    orientation: 'horizontal' | 'vertical';
    type: 'single' | 'double';
    pixelInOneStep: number;
    sliderLength: number;
    minThumbPixelPosition: number | undefined;
    maxThumbPixelPosition: number | undefined;
    showMinMaxValue: boolean;
    sliderMinMaxValueLine: SliderMinMaxValueLineView;
    showMinValueClass: string;
    showMaxValueClass: string;
    showRuler: boolean;
    ruler: SliderRulerView;
    showValueFlag: boolean;
    progressbar: BaseSubViewInterface;
    controlsMinThumb:  Array<JQuery<HTMLElement>>;
    controlsMaxThumb:  Array<JQuery<HTMLElement>>;
    init: any;
    bindThumbsMove: (handler:(type:'min'|'max', value:number) => void)=>void;
    bindInputsChange: (handler:(type:'min'|'max', value:number) => void)=>void;
    bindLineClick:(handler:(type:'min'|'max', value:number) => void) =>void;
    bindRulerClick: (handler:(type:'min'|'max', value:number) => void) =>void;
    updateThumbsPosition: (thumb:'min'|'max', position:number) =>void;
    updateMinMaxValueLine: (min:number,max:number) =>void;
    updateRulerValue: (min:number,max:number) =>void;
    updateFlagValues: (thumb:'min'|'max',position:number) =>void;
    updateInputsValue: (type:'min'|'max',value:number) =>void;
    _getCoords: (elem:JQuery<EventTarget>)=> ElementsCoords;
    _getShiftThumb: (event: JQueryEventObject, currentThumbCoords: ElementsCoords, orientation: string)=> number;
    setPixelInOneStep: (min: number, max: number, step: number) =>void;
    _getNewThumbCord: (
      event: MouseEvent,
      shiftClickThumb: number,
      sliderLineCoords: ElementsCoords,
      currentThumbCoords: ElementsCoords,
    )=> number;
    equateValueToStep: (value: number)=> number;
    validateDoubleThumbValue: (
      currenThumb: JQuery<EventTarget>,
      value: number,
      minThumbPixelPosition: number,
      maxThumbPixelPosition: number,
      pixelInOneStep: number,
    )=> number;
    _handleSliderClick: (event: JQueryEventObject, handler:(type:'min'|'max',value:number)=>void)=>void;
    _setProgressBar: ()=> void;
    setVerticalOrientation: ()=> void;
}

interface Presenter {
  view: View;
  model: Model;
  pixelInOneStep: number;
  moveDirection: 'top' | 'left';
  minThumbPixelPosition: number;
  maxThumbPixelPosition: number;
  setMinMaxValue: () => void;
  setValuesToRuler: () => void;
  onChangeInput: (event: Event) => void;
  onThumbMouseDown: (event: Event) => void;
  onSliderLineClick: (event: Event) => void;
  onRulerClick: (event: Event) => void;
  init: (options: AlexandrSettings) => void;
}
