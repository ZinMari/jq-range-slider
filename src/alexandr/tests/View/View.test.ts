import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/dom';

import SliderView from '../../View/SliderView';

describe('Вид:', () => {
    const baseSettings: AlexandrSettings = {
            container: $('<div>').attr({'class':'container'}),
            minValue: 1000,
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
            controlsMinThumb: [$('<input>').attr({'class':'controlMinThumb'})],
            controlsMaxThumb: [$('<input>').attr({'class':'controlMaxThumb'})],
    }
    describe('Корректно обрабатывает переданные параметры:', () => {
            test('Слайдер добавляется в контейнер', () => {
                const view = new SliderView();
                view.init(baseSettings);
                expect(view.container[0]).toContainElement(view.slider[0])
            });
            test('При указании типа double создается 2 кнопки', () => {
                const view = new SliderView();
                view.init(baseSettings);
                expect(view.thumbs.length).toBe(2);
            });
            test('При указании типа single создается 1 кнопка', () => {
                const view = new SliderView();
                view.init($.extend({}, baseSettings, {type: 'single'}));
                expect(view.thumbs.length).toBe(1);
            });
            test('При передачи в кач-ве контейнера элемента, отличного от div или article - ошибка', () => {
                const view = new SliderView();
                expect(()=>{view.init($.extend({}, baseSettings, {container: $('<input>')}))}).toThrow();
            });
    });

    describe('При выборе вертикальной ориентации добавляются все необходимые классы:', ()=>{
        const view = new SliderView();
        view.init($.extend({}, baseSettings, {orientation: 'vertical'}))

        test('Слайдер: ', ()=>{
            expect(view.slider[0]).toHaveClass('alexandr--vertical')
        })
        test('Линия слайдера: ', ()=>{
            expect(view.line.item[0]).toHaveClass('alexandr__line--vertical')
        })
        test('Минимальное и максимальное значение: ', ()=>{
            expect(view.sliderMinMaxValueLine.wrap[0]).toHaveClass('alexandr__values--vertical')
        })
    })

    describe('Функции для связки прослушиваетелей не вызывают ошибок:', ()=>{
        const view = new SliderView();
        view.init(baseSettings);

        test('Движение ползунков - bindThumbsMove', ()=>{
            expect(()=>{view.bindThumbsMove(
                ()=>{}
            )}).not.toThrow()
        })

        test('Изменение инпутов - bindInputsChange', ()=>{
            expect(()=>{view.bindInputsChange(
                ()=>{}
            )}).not.toThrow()
        })

        test('Клик по слайдеру - bindLineClick', ()=>{
            expect(()=>{view.bindLineClick(
                ()=>{}
            )}).not.toThrow()
        })

        test('Клик по линейке - bindRulerClick', ()=>{
            expect(()=>{view.bindRulerClick(
                ()=>{}
            )}).not.toThrow()
        })
    })

    describe('Функция updateThumbsPosition обновляет позицию ползунка', ()=>{
        const view = new SliderView();
        view.init($.extend(baseSettings)); 
        
        test('Минимального: ', ()=>{
            const newPosition = 6;
            view.updateThumbsPosition('min', newPosition)
            expect(view.thumbs[0].item[0]).toHaveStyle({[view.moveDirection]: newPosition + 'px'});
        })

        test('Максимального: ', ()=>{
            const newPosition = 6;
            view.updateThumbsPosition('max', newPosition)
            expect(view.thumbs[1].item[0]).toHaveStyle({[view.moveDirection]: newPosition + 'px'});
        })
    })

    describe('Функция updateMinMaxValueLine обновляет значения линии слайдера', ()=>{
        const view = new SliderView();
        view.init(baseSettings); 
        
        test('Минимальное: ', ()=>{
            const oldMin = view.sliderMinMaxValueLine.min.text();
            const oldMax = view.sliderMinMaxValueLine.max.text();

            view.updateMinMaxValueLine(10, 100)
            expect(view.sliderMinMaxValueLine.min.text()).not.toBe(oldMin);
            expect(view.sliderMinMaxValueLine.max.text()).not.toBe(oldMax);
        })
    })

    test('Функция updateRulerValue обновляет значения линейки', ()=>{
        const view = new SliderView();
        view.init(baseSettings); 
        
        
        const oldValues: string[] = [];

        $.each(view.ruler.dividings, function () {
            oldValues.push(this.attr('data-dividing'));
        });

        view.updateRulerValue(10, 100);

        $.each(view.ruler.dividings, function (index, elem) {
            expect(elem.attr('data-dividing')).not.toBe(oldValues[index])
        });
    })

    describe('Функция updateFlagValues обновляет значения флажков', ()=>{
        const view = new SliderView();
        view.init(baseSettings); 

        const oldMinFlug = view.thumbs[0].item.attr('data-value');
        const oldMaxFlug = view.thumbs[1].item.attr('data-value');

        test('Минимального: ', ()=>{
            view.updateFlagValues('min', 100)
            expect(view.thumbs[0].item.attr('data-value')).not.toBe(oldMinFlug);
        })

        test('Максимального: ', ()=>{
            view.updateFlagValues('max', 100)
            expect(view.thumbs[1].item.attr('data-value')).not.toBe(oldMaxFlug);
        })
    });

    describe('Функция updateInputsValue обновляет значения инпутов', ()=>{
        const view = new SliderView();
        view.init(baseSettings); 

        view.updateInputsValue('min', 1);
        view.updateInputsValue('max', 5);

        const oldValueMin = view.controlsMinThumb[0].val();
        const oldValueMax = view.controlsMaxThumb[0].val();

        test('Минимального: ', ()=>{
            view.updateInputsValue('min', 10);
            expect(view.controlsMinThumb[0][0]).not.toHaveValue(oldValueMin);
        })

        test('Максимального: ', ()=>{
            view.updateInputsValue('max', 100);
            expect(view.controlsMaxThumb[0][0]).not.toHaveValue(oldValueMax);
        })
    })

    describe('Функция setPixelInOneStep корректно рассчитывает количество пикселей в шаге:', ()=>{
        const view = new SliderView();
        view.init(baseSettings); 

        test('при полученном отрицательном значении шага вернет 1: ', ()=>{
            view.setPixelInOneStep({min: 5, max: 10, step: -100});
            expect(view.pixelInOneStep).toBeGreaterThan(0);
        })
    })

    describe('Функция _equateValueToStep:', ()=>{
        const view = new SliderView();
        view.init(baseSettings)

        test('выбросит ошибку при получении NaN:', ()=>{
            expect(()=>{view._equateValueToStep(NaN)}).toThrow();
        })

        test('возвращает число:', ()=>{
            expect(typeof view._equateValueToStep(60)).toBe('number');
        })
    })

    describe('Инпуты получают значения:', ()=>{
        const view = new SliderView();
        view.init(baseSettings);
        const user = userEvent.setup();

        test('Минимальный', () => {
            fireEvent.change(view.controlsMinThumb[0][0], { target: { value: 135 } });
            expect(view.controlsMinThumb[0][0]).toHaveValue("135");
        })

        test('Максимальный', () => {  
            fireEvent.change(view.controlsMaxThumb[0][0], { target: { value: 135 } });
            expect(view.controlsMaxThumb[0][0]).toHaveValue("135");
        })
    })

    describe('Инпуты вызывают коллбэк:', ()=>{
        const view = new SliderView();
        view.init(baseSettings);

        const user = userEvent.setup();
        
        const mockCallback = jest.fn((type, value) => {});
        view.bindInputsChange(mockCallback)

        test('Минимальный', () => {
            fireEvent.change(view.controlsMinThumb[0][0], { target: { value: 135 } });
            expect(mockCallback).toHaveBeenCalledWith('min', 135 );
        })

        test('Максимальный', () => {
            fireEvent.change(view.controlsMaxThumb[0][0], { target: { value: 135 } });
            expect(mockCallback).toHaveBeenCalledWith('max', 135 );
        })
    })

    describe('Функция _getCoords возвращает объект с требуемыми ключами:', ()=>{
        const view = new SliderView();

        test('Left', ()=>{
            expect(Object.keys(view._getCoords($('<input>')))).toContain('left')
        })
    })

    describe('Функция _validateDoubleThumbValue: ',()=>{
        const view = new SliderView();
        view.init(baseSettings);

        const args = {
            currenThumb: view.thumbs[0],
            value: 50,
            minThumbPixelPosition: 0,
            maxThumbPixelPosition: 50,
            pixelInOneStep: 30,
        }

        test('не вернет одинаковые позиции для ползунков:', ()=>{
            expect(view._validateDoubleThumbValue({
                currenThumb: view.thumbs[0].item,
                value: 50,
                minThumbPixelPosition: 0,
                maxThumbPixelPosition: 50,
                pixelInOneStep: 30,
            })).not.toBe(args.maxThumbPixelPosition)
        })

        

        test('вернет число:', ()=>{
            expect(typeof view._validateDoubleThumbValue({
                currenThumb: view.thumbs[1].item,
                value: 50,
                minThumbPixelPosition: 0,
                maxThumbPixelPosition: 300,
                pixelInOneStep: 30,
            })).toBe('number')
        })

       

        test('не вернет одинаковые позиции для ползунков:', ()=>{
            expect(typeof view._validateDoubleThumbValue( {
                currenThumb: view.thumbs[1].item,
                value: -50,
                minThumbPixelPosition: 0,
                maxThumbPixelPosition: 300,
                pixelInOneStep: 30,
            })).toBe('number')
        })
    })

    describe('Функция _setProgressBar: ', ()=>{
        test('устанавливает ширину при вертикальной ориентации: ', ()=>{
            const view = new SliderView();
            view.init($.extend({}, baseSettings, {orientation: 'vertical'}));

            const oldHeight = view.progressbar.item.css('width');
            view._setProgressBar();
            expect(view.progressbar.item.css('width')).not.toBe(oldHeight)
        })

        test('устанавливает ширину при вертикальной ориентации и одном ползунке: ', ()=>{
            const view = new SliderView();
            view.init($.extend({}, baseSettings, {orientation: 'vertical', type: 'single'}));
            
            const oldHeight = view.progressbar.item.css('width');
            view._setProgressBar();
            expect(view.progressbar.item.css('width')).not.toBe(oldHeight)
        })

        test('устанавливает высоту при горизонтальной ориентации и одном ползунке: ', ()=>{
            const view = new SliderView();
            view.init($.extend({}, baseSettings, {orientation: 'horizontal', type: 'single'}));
            
            const oldHeight = view.progressbar.item.css('height');
            view._setProgressBar();
            expect(view.progressbar.item.css('height')).not.toBe(oldHeight)
        })
    })
});