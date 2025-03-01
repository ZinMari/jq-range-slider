import './style.scss'

function initSlider(slider: any){
    $(slider).children('.slider-block__slider').alexandr({
        controlsMinThumb: [$(slider).find('.form__controlMinThumb')],
        controlsMaxThumb: [$(slider).find('.form__controlMaxThumb')]
    });
}

function setValueToPanel(slider: any){
    const panel = $(slider).find('.slider-block__panel');
    const sliderOptions = $(slider).find('.slider-block__slider').alexandr('option');
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

function onChangePanelValue(event: any){
    event.preventDefault()
    const target = $(event.target);
    if(target.attr('type') === 'checkbox'){
        $(this).find('.slider-block__slider').alexandr('option', {[target.attr('name')]: target.prop('checked')});
    } else {
        $(this).find('.slider-block__slider').alexandr('option', {[target.attr('name')]: target.val()});
    }
}

initSlider('.slider1');
initSlider('.slider2');

setValueToPanel('.slider1')
setValueToPanel('.slider2')

$('.slider1').on('change', onChangePanelValue);
$('.slider2').on('change', onChangePanelValue);