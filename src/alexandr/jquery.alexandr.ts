import SliderView from './View/SliderView';
import SliderPresenter from './Presenter/SliderPresenter';
import SliderModel from './Model/SliderModel';
import './jquery.alexandr.scss';
// import './theme-dark.scss';

(function ($) {
  class Alexandr {
    presenter: Presenter;
    constructor(options: AlexandrSettings) {
      this.presenter = new SliderPresenter(new SliderView(), new SliderModel());
      this.presenter.init(options);
    }
  }

  $.extend(Alexandr.prototype, {
    _initPlugin(target: HTMLElement, options: AlexandrSettings): JQuery<HTMLElement>{
      $(target).data('alexandr', new Alexandr(options));
      $(target).data('alexandrOptions', options);

      return $(target)
    },
    _optionPlugin(target: JQuery<HTMLElement>, options: AlexandrSettingsKeys | AlexandrSettings, value?: string): string | number | boolean | JQuery<HTMLElement> | [JQuery<HTMLElement>] | AlexandrSettings{
      target = $(target);

      const inst: AlexandrSettings | undefined = target.data('alexandrOptions');

      if (!options || (typeof options == 'string' && value == null)) {
        const name: AlexandrSettingsKeys = options as AlexandrSettingsKeys;
        options = inst || {};
        return options && name ? options[name] : options;
      }

      options = options || {};

      // if (typeof options === 'string') {
      //   const name: AlexandrSettingsKeys = options as AlexandrSettingsKeys;
      //   options = {};
      //   options[name] = value;
      // }


      this._refreshPlugin(target, $.extend(inst, options));
    },

    _refreshPlugin(target: JQuery<HTMLElement>, options: AlexandrSettings) {
      this._destroyPlugin(target);
      this._initPlugin(target, options);
    },

    _destroyPlugin(target: JQuery<HTMLElement>) {
      target = $(target);
      target.removeData('alexandr').removeData('alexandrOptions');
      target.find('.alexandr').remove();
      return target;
    },
  });

  function isNotChained(method: string| AlexandrSettings, otherArgs: Array<string> | undefined): boolean {
    if (
      method === 'option' &&
      (otherArgs.length === 0 || (otherArgs.length === 1 && typeof otherArgs[0] === 'string'))
    ) {
      return true;
    }
  }

  $.fn.alexandr = function (options: string | AlexandrSettings): JQuery<HTMLElement> {
    const otherArgs = Array.prototype.slice.call(arguments, 1);

    if (isNotChained(options, otherArgs)) {
      const plugin = $(this).data('alexandr');

      return plugin['_' + options + 'Plugin'].apply(plugin, [this[0]].concat(otherArgs));
    }

    const config = $.extend({}, $.fn.alexandr.defaults, options);
    config.container = this;

    return this.each(function () {
      if (typeof options === 'string' && $(this).data('alexandr')) {
        const plugin = $(this).data('alexandr');

        if (!plugin['_' + options + 'Plugin']) {
          throw 'Unknown method: ' + options;
        }

        plugin['_' + options + 'Plugin'].apply(plugin, [this].concat(otherArgs));
      } else if (!$(this).data('alexandr')) {
        $(this).data('alexandr', new Alexandr(config));
        $(this).data('alexandrOptions', config);
      }
    });
  };

  $.fn.alexandr.defaults = {
    minValue: -10,
    maxValue: 1000,
    stepValue: 10,
    showMinMaxValue: true,
    orientation: 'horizontal',
    type: 'double',
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
    controlsMinThumb: [],
    controlsMaxThumb: [],
  };
})(jQuery);