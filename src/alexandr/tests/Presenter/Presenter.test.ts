import Presenter from '../../Presenter/SliderPresenter';
import Model from '../../Model/SliderModel';
import View from '../../View/SliderView';

describe('Презентер:', ()=>{
    const presenter: Presenter = new Presenter(new View(), new Model());
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

    test('создается и в нем существуют модель и вид', () => {
        expect(presenter).toBeDefined();
        expect(presenter.view).toBeDefined();
        expect(presenter.model).toBeDefined();
    });

    test('Функция convertUnitsToPixels всегда возвращает число', ()=>{
        expect(typeof presenter.convertUnitsToPixels(NaN)).not.toBeNaN();
    })

    test('Функция convertPixelToUnits всегда возвращает число', ()=>{
        expect(typeof presenter.convertPixelToUnits(NaN)).not.toBeNaN();
    })

    describe('При вызове функции init:', ()=>{
        const presenter: Presenter = new Presenter(new View(), new Model());
        const result = presenter.init(baseSettings)

        test('возвращаетс объект', ()=>{
            expect(typeof result).toBe('object')
        })

        test('onThumbsPositionChanged изменяет минимальную позицию во view', ()=>{
            const oldValue = presenter.view.minThumbPixelPosition;
            presenter.onThumbsPositionChanged('min', 100)
            
            expect(presenter.view.minThumbPixelPosition).not.toBe(oldValue)
        })     

        test('onThumbsPositionChanged изменяет максимальную позицию во view', ()=>{
            const oldValue = presenter.view.maxThumbPixelPosition;
            presenter.onThumbsPositionChanged('max', 100)
            expect(presenter.view.maxThumbPixelPosition).not.toBe(oldValue)
        })                
    })
});