import SliderView from './View/SliderView';
import SliderPresenter from './Presenter/SliderPresenter';
import SliderModel from './Model/SliderModel';
import './jquery.alexandr.scss';
// import './theme-dark.scss';

(function ($) {
  class Alexandr {
    presenter: any;
    constructor(options: any) {
      this.presenter = new SliderPresenter(new SliderView(), new SliderModel());
      this.presenter.init(options);
    }
  }

  $.extend(Alexandr.prototype, {
    _optionPlugin(target: any, options: any, value: any) {
      target = $(target);

      const inst = target.data('alexandrOptions');

      if (!options || (typeof options == 'string' && value == null)) {
        var name = options;
        options = inst || {};
        return options && name ? options[name] : options;
      }

      //   if (!target.hasClass(this.markerClassName)) {
      //     return;
      //   }

      //   options = options || {};

      //   if (typeof options === 'string') {
      //     const name = options;
      //     options = {};
      //     options[name] = value;
      //   }

      //   $.extend(inst.options, options);
    },
  });

  function isNotChained(method: any, otherArgs: any) {
    if (
      method === 'option' &&
      (otherArgs.length === 0 || (otherArgs.length === 1 && typeof otherArgs[0] === 'string'))
    ) {
      return true;
    }
  }

  $.fn.alexandr = function (options: any) {
    const otherArgs = Array.prototype.slice.call(arguments, 1);

    if (isNotChained(options, otherArgs)) {
      const plugin = $(this).data('alexandr');
      return plugin['_' + options + 'Plugin'].apply(plugin, [this[0]].concat(otherArgs));
    }

    const config = $.extend({}, $.fn.alexandr.defaults, options);
    config.container = this;

    return this.each(function () {
      if (!$(this).data('alexandr')) {
        $(this).data('alexandr', new Alexandr(config));
        $(this).data('alexandrOptions', config);
      }
    });
  };

  $.fn.alexandr.defaults = {
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
})(jQuery);

$.fn.alexandr.defaults.minValue = 10;

$('.container').alexandr();
console.log($('.container').alexandr('option'));

$('.container1').alexandr({ orientation: 'horizontal', type: 'single' });
