function initSlider(slider: string, options: AlexandrSettings): void{
    $(slider).children('.slider-complex__slider').alexandr({
        controlsMinThumb: [$(slider).find('.form__controlMinThumb')],
        controlsMaxThumb: [$(slider).find('.form__controlMaxThumb')],
        ...options
    });
}

function setValueToPanel(slider: string): void{
    const panel: JQuery<HTMLElement> = $(slider).find('.slider-complex__panel');
    const sliderOptions: AlexandrSettings = $(slider).find('.slider-complex__slider').alexandr('option');
    const inputs: JQuery<HTMLElement> = panel.find('input');

    $.each(inputs, function(){
        const attrName: string = $(this).attr('name');
        switch($(this).attr('type')){
            case 'radio': {
                if($(this).attr('value') === sliderOptions[attrName]){
                    $(this).attr('checked', 'true')
                }

                break;
            }
            case 'number': {
                attrName in sliderOptions && $(this).val(sliderOptions[attrName].toString())
                break;
            }
            case 'checkbox': {
                sliderOptions[attrName] && $(this).attr('checked', 'true')
                break;
            }
        }
    })
}

function onChangePanelValue(event: Event){
    event.preventDefault();
    const target: JQuery<EventTarget> = $(event.target); 

    if(target.hasClass('form__controlMinThumb') || target.hasClass('form__controlMaxThumb')){
        return;
    }

    if(target.attr('type') === 'checkbox'){
        target.closest('.slider-complex').find('.slider-complex__slider').alexandr('option', {[target.attr('name')]: target.prop('checked')});
    } else {
        target.closest('.slider-complex').find('.slider-complex__slider').alexandr('option', {[target.attr('name')]: target.val()});
    }
}

function initSliderComplex(slider: string, options: AlexandrSettings){
    initSlider(slider, options);
    setValueToPanel(slider)
    $(slider).on('change', onChangePanelValue);
}

export default initSliderComplex;