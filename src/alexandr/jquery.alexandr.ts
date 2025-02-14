import SliderView from './View/SliderView';
import SliderPresenter from './Presenter/SliderPresenter';
import SliderModel from './Model/SliderModel';
import './jquery.alexandr.scss';
// import './theme-dark.scss';

(function ($) {
  const defaults: AlexandrSettings = {
    minValue: 0,
    maxValue: 100,
    stepValue: 10,
    showMinMaxValue: true,
    orientation: 'vertical',
    type: 'double',
    showInput: true,
    showValueFlag: true,
    showRuler: true,
    minPosition: 10,
    maxPosition: 20,
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

  $.fn.alexandr = function (options): JQuery {
    const config = $.extend({}, defaults, options);
    config.container = this;

    const presenter = new SliderPresenter(new SliderView(), new SliderModel());
    presenter.init(config);

    return this.first();
  };
})(jQuery);

$('.container').alexandr();
