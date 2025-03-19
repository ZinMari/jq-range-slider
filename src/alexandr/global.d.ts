interface JQuery {
  alexandr: any | ((options: string | AlexandrSettings)=> JQuery<HTMLElement>);
}

interface AlexandrSettings {
    [key: string]: number | JQuery<HTMLElement> | boolean | string | [JQuery<HTMLElement>];
    minValue?: number,
    maxValue?: number,
    container?: JQuery<HTMLElement>,
    stepValue?: number,
    showMinMaxValue?: boolean,
    showValueFlag?: boolean,
    showRuler?: boolean,
    minPosition?: number,
    maxPosition?: number,
    elemForShowValueMin?: JQuery<HTMLElement>,
    elemForShowValueMax?: JQuery<HTMLElement>,
    lineClass?: string,
    progressBarClass?: string,
    thumbClass?: string,
    thumbMinClass?: string,
    thumbMaxClass?: string,
    showMinValueClass?: string,
    showMaxValueClass?: string,
    controlsMinThumb?: [JQuery<HTMLElement>],
    controlsMaxThumb?: [JQuery<HTMLElement>],
    orientation?: 'horizontal' | 'vertical';
    type?: 'single' | 'double';
}

type AlexandrSettingsKeys = 'minValue' | 'maxValue' | 'stepValue' | 'showMinMaxValue' | 'orientation' | 'type'| 'showValueFlag'| 'showRuler'| 'minPosition'| 'maxPosition'| 'elemForShowValueMin'| 'elemForShowValueMax'| 'lineClass'| 'progressBarClass'| 'thumbClass'| 'thumbMinClass'| 'thumbMaxClass'| 'showMinValueClass'| 'showMaxValueClass'| 'controlsMinThumb'| 'controlsMaxThumb'

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
  init: (options: AlexandrSettings) => void;
  _setMinValue: (minValue: number) => void;
  _setMaxValue: (maxValue: number) => void;
  _setStepValue: (stepValue: number) => void;
  setMinPosition: (minPosition: number) => void;
  setMaxPosition: (setMaxPosition: number) => void;
  bindThumbsPositionChanged: (callback: (type: 'min' | 'max', position: number) => void)=> void;
  bindStepValueChanged: (callback: (minValue: number, maxValue: number, stepValue: number) => void)=> void;
  bindMinMaxValuesChanged: (callback: (minValue: number, maxValue: number) => void)=> void
  _validatePosition: (value: number)=> number;
  _validateDoublePosition: (type: 'min' | 'max', value: number)=> number;
  _equateValueToStep: (value: number)=> number;
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
    init: (options: AlexandrSettings) => void;
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
    _getShiftThumb: (options: {event: JQueryEventObject, currentThumbCoords: ElementsCoords, orientation: string})=> number;
    setPixelInOneStep: (options: {min: number, max: number, step: number}) =>void;
    _getNewThumbCord: (
      event: MouseEvent,
      shiftClickThumb: number,
      sliderLineCoords: ElementsCoords,
      currentThumbCoords: ElementsCoords,
    )=> number;
    _equateValueToStep: (value: number)=> number;
    _validateDoubleThumbValue: (
      options: {
        currenThumb: JQuery<EventTarget>, 
        value: number, 
        minThumbPixelPosition: number, 
        maxThumbPixelPosition: number,
        pixelInOneStep: number,
      })=> number;
    _handleSliderClick: (event: JQuery.Event, handler:(type:'min'|'max',value:number)=>void)=>void;
    _setProgressBar: ()=> void;
    _setVerticalOrientation: ()=> void;
}

interface Presenter {
  view: View;
  model: Model;
  init: (options: AlexandrSettings) => void;
  onThumbsPositionChanged: (thumb: 'min' | 'max', position: number) => void;
  onStepValueChenged :(min: number, max: number, step: number) =>void;
  onMinMaxValuesChanged : (min: number, max: number) => void;
  handleThumbsPositionChanged : (thumb: 'min' | 'max', position: number) =>void;
  handleInputsChange: (input: 'min' | 'max', value: number) => void;
  _convertUnitsToPixels: (value: number)=> number;
  _convertPixelToUnits: (value: number)=> number;
}
