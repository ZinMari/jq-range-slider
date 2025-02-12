export default class SliderPresenter {
  view: any;
  model: any;
  pixelInOneStep: number;
  moveDirection: 'top' | 'left';
  minThumbPixelPosition: number;
  maxThumbPixelPosition: number;

  constructor(view: any, model: any) {
    this.view = view;
    this.model = model;
  }

  init(config: AlexandrSettings): void {
    this.model.bindStepValueChanged(this.onStepValueChanged);

    this.model.init({ ...config });
    this.view.init({ ...config });

    this.view.bindThumbsMove(this.handleThumbsMove);
    this.model.bindThumbPositionChanged(this.onThumbsPositionChanged);

    //Методы которые единожды нужно вызвать, чтобы установить начальные значения
    this.onStepValueChanged(this.model.stepValue, this.model.maxValue, this.model.minValue);
    this.onThumbsPositionChanged('min', this.model.minPosition);
    this.onThumbsPositionChanged('max', this.model.maxPosition);
  }

  handleThumbsMove = (type: 'min' | 'max', position: any) => {
    if (type === 'min') {
      this.model.setMinPosition(position);
    } else if (type === 'max') {
      this.model.setMaxPosition(position);
    }
  };

  onStepValueChanged = (stepValue: number, maxValue: number, minValue: number) => {
    this.view.getPixelInOneStep(stepValue, maxValue, minValue);
  };

  onThumbsPositionChanged = (type: 'min' | 'max', newPosition: any) => {
    this.view.updateThumbsPosition(type, newPosition);
  };
}
