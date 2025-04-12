import '@testing-library/jest-dom';

import SliderLineView from '../../../View/SliderLineView/SliderLineView';

describe('Slider line class', () => {
  let wrappElement: JQuery<HTMLElement>;
  let lineElement: BaseSubViewInterface;
  let className: string;
  const baseClassName: string = 'alexandr__line';

  beforeEach(() => {
    wrappElement = $('<div>');
    className = Math.random().toString();
    lineElement = new SliderLineView(wrappElement, className);
  });

  test(`Элемент содержит произвольный класс назначенный пользователем, например ${className}`, () => {
    expect(lineElement.item[0]).toHaveClass(className);
  });

  test(`Элемент содержит базовый класс`, () => {
    expect(lineElement.item[0]).toHaveClass(baseClassName);
  });

  test(`Элемент линии был добавлен в родителя`, () => {
    expect(wrappElement[0]).toContainElement(lineElement.item[0]);
  });
});
