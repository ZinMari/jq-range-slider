import '@testing-library/jest-dom';
import Model from '../../Model/SliderModel';

describe('Model class', () => {
    const model: Model = new Model();

    const settings = {
        minValue: 5,
        maxValue: 5,
        minPosition: 0,
        maxPosition: 0,
        stepValue: 1
    }

    model.init(settings)
  
    test('Минимальное значение меньше максимального, если передать маскимальное minValue=5 maxValue=0', () => {
        expect(model.minValue < model.maxValue).toBeTruthy();
    });
});
  