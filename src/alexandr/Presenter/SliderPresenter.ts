class SliderPresenter {
  view: View;
  model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
  }

  init(config: AlexandrSettings) {
    this.view.init({ ...config });
    const upgradeModelOptions = this.model.init({ ...config });

    this.view.setPixelInOneStep({min: this.model.minValue, max: this.model.maxValue, step: this.model.stepValue});

    this.model.bindThumbsPositionChanged(this.onThumbsPositionChanged);
    this.model.bindStepValueChanged(this.onStepValueChenged);
    this.model.bindMinMaxValuesChanged(this.onMinMaxValuesChanged);
    


    this.view.updateThumbsPosition('min', this._convertUnitsToPixels(this.model.minPosition));
    this.view.updateThumbsPosition('max', this._convertUnitsToPixels(this.model.maxPosition));
    this.view.updateFlagValues('min', this.model.minPosition);
    this.view.updateFlagValues('max', this.model.maxPosition);
    this.view.updateInputsValue('max', this.model.maxPosition);
    this.view.updateInputsValue('min', this.model.minPosition);
    
    this.view.updateMinMaxValueLine(this.model.minValue, this.model.maxValue);
    this.view.updateRulerValue(this.model.minValue, this.model.maxValue);
    

    //свяжу обработчик события с моделью
    this.view.bindThumbsMove(this.handleThumbsPositionChanged);
    this.view.bindLineClick(this.handleThumbsPositionChanged);
    this.view.bindRulerClick(this.handleThumbsPositionChanged);
    this.view.bindInputsChange(this.handleInputsChange);

    return upgradeModelOptions;
  }

  onThumbsPositionChanged = (thumb: 'min' | 'max', position: number) => {
    this.view.updateThumbsPosition(thumb, this._convertUnitsToPixels(position));
    this.view.updateFlagValues(thumb, position);
    this.view.updateInputsValue(thumb, position);
  };

  onStepValueChenged = (min: number, max: number, step: number) => {
    this.view.setPixelInOneStep({min, max, step});
  };

  onMinMaxValuesChanged = (min: number, max: number) => {
    //обновим значения в линии
    this.view.updateMinMaxValueLine(min, max);

    //обновим значения в линейке
    this.view.updateRulerValue(min, max);
  };

  handleThumbsPositionChanged = (thumb: 'min' | 'max', position: number) => {
    if (thumb === 'min') {
      this.model.setMinPosition(this._convertPixelToUnits(position));
    } else if (thumb === 'max') {
      this.model.setMaxPosition(this._convertPixelToUnits(position));
    }
  };

  handleInputsChange = (input: 'min' | 'max', value: number) => {
    if (input === 'min') {
      this.model.setMinPosition(value);
    } else if (input === 'max') {
      this.model.setMaxPosition(value);
    }
  };

  _convertUnitsToPixels(value: number): number {
    let withMinvalue = value - this.model.minValue;
    let pixels = withMinvalue * (this.view.pixelInOneStep / this.model.stepValue);
    return pixels;
  }

  _convertPixelToUnits(value: number): number {
    return Math.round(
      (value / this.view.pixelInOneStep) * this.model.stepValue + this.model.minValue,
    );
  }
}

export default SliderPresenter;