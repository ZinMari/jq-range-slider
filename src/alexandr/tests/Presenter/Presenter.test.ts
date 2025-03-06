import Presenter from '../../Presenter/SliderPresenter';
import Model from '../../Model/SliderModel';
import View from '../../View/SliderView';

describe('Презентер:', ()=>{
    test('создается и в нем существуют модель и вид', () => {
        const presenter: Presenter = new Presenter(new View(), new Model());
        expect(presenter).toBeDefined();
        expect(presenter.view).toBeDefined();
        expect(presenter.model).toBeDefined();
    });
});