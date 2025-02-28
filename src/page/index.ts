import './style.scss'

// $('.slider1 .slider-block__slider').alexandr({
//     controlsMinThumb: [$('.form__controlMinThumb')],
//     controlsMaxThumb: [$('.form__controlMaxThumb')],
// });
// $('.slider2 .slider-block__slider').alexandr();


function initSliderPanel(slider: any){
    const controlsMinThumb = slider.children('.form__controlMinThumb');
    const controlsMaxThumb = slider.children('.form__controlMaxThumb');
    const panel = slider.children('.slider-block__panel');

    $(slider).children('.slider-block__slider').alexandr({
        controlsMinThumb,
        controlsMaxThumb,
    });
}

initSliderPanel('.slider1');
initSliderPanel('.slider2');


function setValueToPanel(slider: any, panel: any){
    const sliderOptions = $(slider).alexandr('option');
    panel = $(panel);
    const inputs = panel.find('input');

    $.each(inputs, function(){
        switch($(this).attr('type')){
            case 'radio': {
                if($(this).attr('value') === sliderOptions[$(this).attr('name')]){
                    $(this).attr('checked', 'true')
                }

                break;
            }
            case 'number': {
                $(this).attr('name') in sliderOptions && $(this).val(sliderOptions[$(this).attr('name')])
                break;
            }
            case 'checkbox': {
                sliderOptions[$(this).attr('name')] && $(this).attr('checked', 'true')
                break;
            }
        }
    })
}

setValueToPanel('.slider1 .slider-block__slider', '.slider1 .slider-block__panel')

function onChangePanelValue(event: any){
    event.preventDefault()
    const target = $(event.target);


    if(target.attr('type') === 'checkbox'){
        $('.slider1 .slider-block__slider').alexandr('option', {[target.attr('name')]: target.prop('checked')});
    } else {
        $('.slider1 .slider-block__slider').alexandr('option', {[target.attr('name')]: target.val()});
    }
    console.log(target.attr('name'))
    console.log(target.val())
}

$('.form__block').on('change', onChangePanelValue)