export default class SliderPresenter {
  view: any;
  model: any;

  constructor(view: any, model: any) {
    this.view = view;
    this.model = model;
  }

  init(config: AlexandrSettings): void {
    this.view.init({ ...config });
    this.model.init({ ...config });

    this.view.setPixelInOneStep(this.model.minValue, this.model.maxValue, this.model.stepValue);
    this.model.bindStepValueChanged(this.onStepValueChenged);

    // один раз вызовем метод для установки начальных значений, и далее  свяжем метод с моделью
    this.view.updateThumbsPosition('min', this.model.minPosition);
    this.view.updateThumbsPosition('max', this.model.maxPosition);
    this.model.bindThumbsPositionChanged(this.onThumbsPositionChanged);

    // один раз вызовем метод для установки начальных значений, и далее  свяжем метод с моделью
    this.view.updateMinMaxValueLine(this.model.minValue, this.model.maxValue);
    this.view.updateRulerValue(this.model.minValue, this.model.maxValue);
    this.model.bindMinMaxValuesChanged(this.onMinMaxValuesChanged);

    //свяжу обработчик события с моделью
    this.view.bindThumbsMove(this.handleThumbsPositionChanged);
    this.view.bindInputsChange(this.handleInputsChange);
  }

  onThumbsPositionChanged = (thumb: 'min' | 'max', position: number) => {
    this.view.updateThumbsPosition(thumb, this.convertUnitsToPixels(position));
  };

  onStepValueChenged = (min: number, max: number, step: number) => {
    this.view.setPixelInOneStep(min, max, step);
  };

  onMinMaxValuesChanged = (min: number, max: number) => {
    //обновим значения в линии
    this.view.updateMinMaxValueLine(min, max);

    //обновим значения в линейке
    this.view.updateRulerValue(min, max);
  };

  handleThumbsPositionChanged = (thumb: 'min' | 'max', position: number) => {
    if (thumb === 'min') {
      this.model.setMinPosition(this.convertPixelToUnits(position));
    } else if (thumb === 'max') {
      this.model.setMaxPosition(this.convertPixelToUnits(position));
    }
  };

  handleInputsChange = (input: 'min' | 'max', value: number) => {
    if (input === 'min') {
      this.model.setMinPosition(value);
    } else if (input === 'max') {
      this.model.setMaxPosition(value);
    }
  };

  convertUnitsToPixels(value: number): number {
    let withMinvalue = value - this.model.minValue;
    let pixels = withMinvalue * (this.view.pixelInOneStep / this.model.stepValue);
    return pixels;
  }

  convertPixelToUnits(value: number): number {
    return Math.round(
      (value / this.view.pixelInOneStep) * this.model.stepValue + this.model.minValue,
    );
  }
}
