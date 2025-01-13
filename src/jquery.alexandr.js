import SliderView from './View/SliderView';
import SliderPresenter from './Presenter/SliderPresenter';
import SliderModel from './Model/SliderModel';
import './style.scss';

(function ($) {
  const defaults = {
    slider: $('.slider29'),
    minValue: 0,
    maxValue: 400,
    stepValue: 50,
    showMinMaxValue: true,
    orientation: 'horizontal',
    type: 'double',
    initialValues: [200, 400],
    elemForShowValueMin: $('.min'),
    elemForShowValueMax: $('.max'),
    elemForInputMin: $('.inputs__item-min'),
    elemForInputMax: $('.inputs__item-max'),
  };
  $.fn.alexander = function (options) {
    var config = $.extend({}, defaults, options);
    let jFirst = this.first();
    class SliderAlex {
      constructor({
        slider,
        minValue,
        maxValue,
        stepValue,
        showMinMaxValue,
        orientation,
        type,
        initialValues,
        elemForShowValueMin,
        elemForShowValueMax,
        elemForInputMin,
        elemForInputMax,
      }) {
        this.view = new SliderView({
          slider,
          showMinMaxValue,
          orientation,
          type,
          initialValues,
          elemForShowValueMin,
          elemForShowValueMax,
          elemForInputMin,
          elemForInputMax,
        });
        this.model = new SliderModel({ minValue, maxValue, stepValue });
        this.presenter = new SliderPresenter(this.view, this.model);
      }
    }

    const a = new SliderAlex(config);

    return jFirst;
  };
})(jQuery);

$('.slider29').alexander({ maxValue: 10000 });
