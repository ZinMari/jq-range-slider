// import Model from '../../Model/Model';

// describe('Модель:', ()=>{
//     describe('Минимальное значение слайдера всегда меньше максимального:', () => {
//         test('при minValue=5 maxValue=0', () => {
//             const model: Model = new Model();
//             const settings = {
//                 minValue: 5,
//                 maxValue: 0,
//                 stepValue: 10
//             }
//             model.init(settings)
//             expect(model.minValue < model.maxValue).toBeTruthy();
//         });
//         test('при minValue=1 maxValue=1', () => {
//             const model: Model = new Model();
//             const settings = {
//                 minValue: 1,
//                 maxValue: 1,
//                 stepValue: 10
//             }
//             model.init(settings)
//             expect(model.minValue < model.maxValue).toBeTruthy();
//         });
//     });

//     describe('Значение шага всегда больше нуля:', () => {
//         test('при заданном значении 0', () => {
//             const model: Model = new Model();
//             const settings = {
//                 stepValue: 0
//             }
//             model.init(settings)
//             expect(model.stepValue).toBeGreaterThan(0);
//         });
//         test('при заданном отрицательном значении -100', () => {
//             const model: Model = new Model();
//             const settings = {
//                 stepValue: 10
//             }
//             model.init(settings)
//             expect(model.stepValue).toBeGreaterThan(0);
//         });
//     });

//     describe('Корректно обрабатывается NaN:', () => {
//         test('minValue не равно NaN при переданном NaN', () => {
//             const model: Model = new Model();
//             const settings = {
//                 minValue: NaN,
//             }
//             model.init(settings)
//             expect(model.minValue).not.toBeNaN();
//         });
//         test('stepValue не равно NaN при переданном NaN', () => {
//             const model: Model = new Model();
//             const settings = {
//                 stepValue: NaN
//             }
//             model.init(settings)
//             expect(model.stepValue).not.toBeNaN();
//         });
//         test('maxValue не равно NaN при переданном NaN', () => {
//             const model: Model = new Model();
//             const settings = {
//                 maxValue: NaN
//             }
//             model.init(settings)
//             expect(model.maxValue).not.toBeNaN();
//         });
//         test('minPosition не равно NaN при переданном NaN', () => {
//             const model: Model = new Model();
//             const settings = {
//                 minPosition: NaN
//             }
//             model.init(settings)
//             expect(model.minPosition).not.toBeNaN();
//         });
//         test('maxPosition не равно NaN при переданном NaN', () => {
//             const model: Model = new Model();
//             const settings = {
//                 maxPosition: NaN
//             }
//             model.init(settings)
//             expect(model.maxPosition).not.toBeNaN();
//         });
//     });

//     describe('Функции для обновления модели были назначены:', () => {
//         const model: Model = new Model();

//         test('onThumbsPositionChanged', () => {
//             model.bindThumbsPositionChanged(function(){});
//             expect(model.onThumbsPositionChanged).toBeDefined();
//         });

//         test('onStepValueChenged', () => {
//             model.bindStepValueChanged(function(){});
//             expect(model.onStepValueChenged).toBeDefined();
//         });

//         test('onMinMaxValuesChanged', () => {
//             model.bindMinMaxValuesChanged(function(){});
//             expect(model.onMinMaxValuesChanged).toBeDefined();
//         });

//         test('onMinMaxValuesChanged', () => {
//             model.bindMinMaxValuesChanged(function(){});
//             expect(model.onMinMaxValuesChanged).toBeDefined();
//         });
//     });

//     describe('Функции для обновления модели были назначены:', () => {
//         const model: Model = new Model();

//         test('onThumbsPositionChanged', () => {
//             model.bindThumbsPositionChanged(function(){});
//             expect(model.onThumbsPositionChanged).toBeDefined();
//         });
//     });

//     describe('Функция для валидации положение ползунка всегда возвращает позицию в пределах диапазона слайдера:', () => {
//         test('при заданном диапазоне 0-100 и заданном положении ползунка 1000', () => {
//             const model: Model = new Model();
//             const settings: AlexandrSettings = {
//                 minValue: 0,
//                 maxValue: 100,
//                 stepValue: 1,
//                 minPosition: 1000,
//                 type: 'single',
//             }
//             model.init(settings)
//             expect(model.minPosition).toBeLessThanOrEqual(model.maxValue);
//         });
//         test('при заданном диапазоне 0-100 и заданном положении ползунка -100', () => {
//             const model: Model = new Model();
//             const settings: AlexandrSettings = {
//                 minValue: 0,
//                 maxValue: 100,
//                 stepValue: 1,
//                 minPosition: -100,
//                 type: 'single',
//             }
//             model.init(settings)
//             expect(model.minPosition).toBeLessThanOrEqual(model.maxValue);
//         });
//         test('при заданном диапазоне 0-100 и заданном положении двойного ползунка 1000', () => {
//             const model: Model = new Model();
//             const settings: AlexandrSettings = {
//                 minValue: 0,
//                 maxValue: 100,
//                 stepValue: 1,
//                 maxPosition: 1000,
//                 type: 'double',
//             }
//             model.init(settings)
//             expect(model.maxPosition).toBeLessThanOrEqual(model.maxValue);
//         });
//         test('при заданном диапазоне 0-100 и заданном положении двойного ползунка -100', () => {
//             const model: Model = new Model();
//             const settings: AlexandrSettings = {
//                 minValue: 0,
//                 maxValue: 100,
//                 stepValue: 1,
//                 maxPosition: -100,
//                 type: 'double',
//             }
//             model.init(settings)
//             expect(model.maxPosition).toBeLessThanOrEqual(model.maxValue);
//         });
//     });

// })


  