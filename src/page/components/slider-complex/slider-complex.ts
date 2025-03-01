function initSlider(slider: any, options: any){
    $(slider).children('.slider-complex__slider').alexandr({
        controlsMinThumb: [$(slider).find('.form__controlMinThumb')],
        controlsMaxThumb: [$(slider).find('.form__controlMaxThumb')],
        ...options
    });
}

function setValueToPanel(slider: any){
    const panel = $(slider).find('.slider-complex__panel');
    const sliderOptions = $(slider).find('.slider-complex__slider').alexandr('option');
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
        $(this).find('.slider-complex__slider').alexandr('option', {[target.attr('name')]: target.prop('checked')});
    } else {
        $(this).find('.slider-complex__slider').alexandr('option', {[target.attr('name')]: target.val()});
    }
}

export default function initSliderComplex(slider: any, options: any){
    initSlider(slider, options);
    setValueToPanel(slider)
    $(slider).on('change', onChangePanelValue);
}