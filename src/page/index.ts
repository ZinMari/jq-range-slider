import './style.scss'

$('.slider1 .slider-block__slider').alexandr();
$('.slider2 .slider-block__slider').alexandr();


function initPanel(slider: any, panel: any){
    const sliderOptions = $(slider).alexandr('option')
    panel = $(panel);

    panel.find('input').each(function(){
        const target = $(this);

        switch(target.attr('type')){
            case 'number': {
                target.val(sliderOptions[target.attr('name')])
            }
            case 'radio': {
                sliderOptions[target.attr('name')] === target.val() && target.attr('checked', 'true');
            }
            case 'checkbox': {
                sliderOptions[target.attr('name')] && target.attr('checked', 'true');
            }
        }
    })
}

initPanel('.slider1 .slider-block__slider', '.slider1 .slider-block__panel')

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