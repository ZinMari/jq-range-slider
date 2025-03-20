# [Alexandr](https://mariezin.github.io/search-for-hotels/)
Плагин слайдера для jQuery - контрол, который позволяет перетягиванием задавать числовое значение.

## Начало работы
Для начала работы склонируйте все содержимое репозитория `https://github.com/MarieZin/alexandr.git` Затем запустите команду `npm i`, которая установит все необходимые зависимости. Далее доступны следующие команды:
- `npm run build:dev` — сборка проекта в режиме разработки.
- `npm run build:dev` — сборка продакшн-версии проекта.
- `npm run start:prod` - запук сервера в продакшн-версии.
- `npm run start:dev` - запук сервера в режиме разработки.
- `npm run test` — запуск всех тестов
- `npm run test:model` — запуск тестов модели
- `npm run test:presenter` — запуск тестов презентера
- `npm run test:view` — запуск тестов вида

## Использование
Слайдер применяется к div или article тегам:
````html
<div class="main">
    <div class="div-slider">
        <!-- Тут будет слайдер -->
    </div>
    <div class="article-slider">
        <!-- Тут будет слайдер -->
    </div>
    <!-- Тут будет ошибка -->
    <input class="input-slider">
</div>
````

### Инициализация:
````html
<div class="slider">
    <!-- Тут будет слайдер -->
</div>
````
Инициализация без настроек - настройки будут взяты по умолчанию:
```javascript
<script src="jquery.min.js"></script>
<script src="rangeslider.min.js"></script>

$('.slider').alexandr();
```

Инициализация с пользовательскими настройками:
```javascript
$('.slider').alexandr({
    minValue: 0,
    maxValue: 1000,
    stepValue: 10,
});
```

### Изменить настройки:
Передать объект с настройками
```javascript
$('.slider').alexandr({
    minValue: 0,
    maxValue: 1000,
    stepValue: 10,
});
```
Передать отдельную опцию
```javascript
$('.slider').alexandr('option', 'minValue', 5000);
```
### Доступные настройки:
<table>
    <thead>
        <tr>
            <th>№</th>
            <th>Опция</th>
            <th>Тип</th>
            <th>Описание</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>minValue</td>
            <td>number</td>
            <td>Минимальное возможное значение слайдера</td>
        </tr>
        <tr>
            <td>2</td>
            <td>maxValue</td>
            <td>number</td>
            <td>Максимальное возможное значение слайдера</td>
        </tr>
        <tr>
            <td>3</td>
            <td>stepValue</td>
            <td>number</td>
            <td>Шаг слайдера</td>
        </tr>
        <tr>
            <td>4</td>
            <td>showMinMaxValue</td>
            <td>boolean</td>
            <td>Показать/скрыть отображение мин. и макс. возможных значений слайдера</td>
        </tr>
        <tr>
            <td>5</td>
            <td>orientation</td>
            <td>string: 'vertical' | 'hotizontal'</td>
            <td>Вертикальная/горизонтальная ориентация</td>
        </tr>
        <tr>
            <td>6</td>
            <td>type</td>
            <td>string: 'single' | 'double'</td>
            <td>Одиночное значение/диапазон значений</td>
        </tr>
        <tr>
            <td>7</td>
            <td>showValueFlag</td>
            <td>boolean</td>
            <td>Показать/скрыть флажки со значениями</td>
        </tr>
        <tr>
            <td>8</td>
            <td>showRuler</td>
            <td>boolean</td>
            <td>Показать/скрыть линейку</td>
        </tr>
        <tr>
            <td>9</td>
            <td>minPosition</td>
            <td>number</td>
            <td>Позиция минимального/одиночного ползунка</td>
        </tr>
        <tr>
            <td>10</td>
            <td>maxPosition</td>
            <td>number</td>
            <td>Позиция максимального ползунка</td>
        </tr>
        <tr>
            <td>11</td>
            <td>elemForShowValueMin</td>
            <td>&lsaquo;JQuery&lsaquo;HTMLElement&rsaquo;</td>
            <td>Элемент куда отображать минимальное/одиночное значение</td>
        </tr>
        <tr>
            <td>12</td>
            <td>elemForShowValueMax</td>
            <td>&lsaquo;JQuery&lsaquo;HTMLElement&rsaquo;</td>
            <td>Элемент куда отображать максимальное значение</td>
        </tr>
        <tr>
            <td>13</td>
            <td>controlsMinThumb</td>
            <td>[&lsaquo;JQuery&lsaquo;HTMLElement&rsaquo;]</td>
            <td>Инпуты для управления минимальной позицией</td>
        </tr>
        <tr>
            <td>14</td>
            <td>controlsMaxThumb</td>
            <td>[&lsaquo;JQuery&lsaquo;HTMLElement&rsaquo;]</td>
            <td>Инпуты для управления максимальной позицией</td>
        </tr>
        <tr>
            <td>15</td>
            <td>lineClass</td>
            <td>string</td>
            <td>Пользовательский класс для линии</td>
        </tr>
        <tr>
            <td>16</td>
            <td>progressBarClass</td>
            <td>string</td>
            <td>Пользовательский класс для прогрессбара</td>
        </tr>
        <tr>
            <td>17</td>
            <td>thumbClass</td>
            <td>string</td>
            <td>Пользовательский класс для одиночного ползунка</td>
        </tr>
        <tr>
            <td>18</td>
            <td>thumbMinClass</td>
            <td>string</td>
            <td>Пользовательский класс для минимального ползунка</td>
        </tr>
        <tr>
            <td>19</td>
            <td>thumbMaxClass</td>
            <td>string</td>
            <td>Пользовательский класс для максимального ползунка</td>
        </tr>
        <tr>
            <td>20</td>
            <td>showMinValueClass</td>
            <td>string</td>
            <td>Пользовательский класс для минимального и максимального значения</td>
        </tr>
        <tr>
            <td>21</td>
            <td>showMaxValueClass</td>
            <td>string</td>
            <td>Пользовательский класс для максимального значения</td>
        </tr>
    </tbody>
</table>

### Получить опции слайдера:
В виде объекта
```javascript
$('.slider').alexandr('option');
```
В виде значения
```javascript
$('.slider').alexandr('option', 'minValue');
```

### Убить слайдер:
```javascript
$('.slider').alexandr('destroy');
```

### Переопределить глобальные значения по умолчанию
Функция должна вызываться перед применением плагина. Настройки, передаваемые этой функции, 
добавляются в список значений по умолчанию и затем применяются 
ко всем вновь создаваемым экземплярам плагина.

```javascript
// переопределить настройки
$.alexandr.setDefaults({max: 300, truncate: false});

// инициализировать слайдер
$('.slider').alexandr();
```
