import SliderView from './View/SliderView';
import SliderPresenter from './Presenter/SliderPresenter';
import SliderModel from './Model/SliderModel';
import './jquery.alexandr.scss';
// import './theme-dark.scss';

(function ($) {
  const defaults: AlexandrSettings = {
    minValue: 100,
    maxValue: 1000,
    stepValue: 20,
    showMinMaxValue: true,
    orientation: 'horizontal',
    type: 'double',
    showInput: true,
    showValueFlag: true,
    showRuler: true,
    initialValues: [1, 1],
    elemForShowValueMin: $('.min'),
    elemForShowValueMax: $('.max'),
    lineClass: '',
    progressBarClass: '',
    thumbClass: '',
    thumbMinClass: '',
    thumbMaxClass: '',
    showMinValueClass: '',
    showMaxValueClass: '',
  };

  class Alexandr {
    config: AlexandrSettings;
    view: View;
    model: Model;
    presenter: Presenter;

    constructor(element: JQuery<HTMLElement>, options: AlexandrSettings | undefined) {
      this.config = $.extend({}, defaults, options);
      this.config.container = element;
      this.presenter = new SliderPresenter(new SliderView(), new SliderModel());
      this.presenter.init(this.config);
    }
  }

  $.fn.alexandr = function (options): JQuery {
    new Alexandr(this.first(), options);
    return this.first();
  };
})(jQuery);

$('body').alexandr();
