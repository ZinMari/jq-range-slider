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

  class Alexandr{
    constructor(options){
      this.config = $.extend({}, defaults, options);
      this.init();
    }  
  }

  Alexandr.prototype.init = function(){        
        this.view = new SliderView({...this.config});
        this.model = new SliderModel({...this.config});
        this.presenter = new SliderPresenter(this.view, this.model);
  }

  $.fn.alexander = function (options) {
    new Alexandr(options);
    return this.first();
  };
})(jQuery);

$('.slider29').alexander();
