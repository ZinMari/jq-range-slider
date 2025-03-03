import './style.scss'

import initSliderComplex from './components/slider-complex/slider-complex';



initSliderComplex('.slider1', {type: 'single'});
initSliderComplex('.slider2', {orientation: 'vertical'});
initSliderComplex('.slider3', {minValue: 500, maxValue: 1000, orientation: 'vertical'});
initSliderComplex('.slider4', {showValueFlag: false, showRuler: false, type: 'single', minPosition: 900});