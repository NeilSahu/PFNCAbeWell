/***********
 * enable-auto-scroll for autoScroll to enable
 * slide-timer for controlling the slider speed default is 3000
 * slides-data is the data and data should be in this format {image:'',heading:'',description:''}
 * show-full is for 100% width other wise use customWidth 
 * custom-width is use for controlling the width of the slider manually
 * 
 */
import { LightningElement, api, track } from 'lwc';

const CARD_VISIBLE_CLASSES = 'fade slds-show img-bg'
const CARD_HIDDEN_CLASSES = 'fade slds-hide img-bg'

const DOT_VISIBLE_CLASSES = 'dot active'
const DOT_HIDDEN_CLASSES = 'dot'

const DEFAULT_SLIDER_TIMER = 3000 // 3 second
const DEFAULT_SLIDER_WIDTH = 700

export default class CustomCaraousel extends LightningElement {

    @api slideTimer = DEFAULT_SLIDER_TIMER
    @api enableAutoScroll = false
    @api customWidth = DEFAULT_SLIDER_WIDTH
    @api showFull = false
    @track sliderFlag = true;
    @track slider;

    slides = []
    slideIndex = 1
    timer

    get maxWidth() {
        return this.showFull ? `width:100%` : `width:${Number(this.customWidth)}px`;
    }

    @api
    get slidesData() {
        return this.slides;
    }

    set slidesData(data) {
        this.slides = data.map((item, index) => {
            return index === 0 ? {
                ...item,
                slideIndex: index + 1,
                cardClasses: CARD_VISIBLE_CLASSES,
                dotClases: DOT_VISIBLE_CLASSES
            } : {
                    ...item,
                    slideIndex: index + 1,
                    cardClasses: CARD_HIDDEN_CLASSES,
                    dotClases: DOT_HIDDEN_CLASSES
                }
        })
    }

    connectedCallback() {
        // if(this.enableAutoScroll){
        //     this.timer = window.setInterval(()=>{
        //         this.slideSelectionHandler(this.slideIndex+1)
        //     }, Number(this.slideTimer))
        // }
        if (this.sliderFlag) {
            this.slider = window.setInterval(() => {
                this.slideSelectionHandler(this.slideIndex + 1)
            }, 3000);
        }
    }

    disconnectedCallback() {
        // if(this.enableAutoScroll){
        //     window.clearInterval(this.timer);
        // }
        if (this.sliderFlag) {
            window.clearInterval(this.slider);
        }
    }

    backSlide() {
        let slideIndex = this.slideIndex - 1
        this.slideSelectionHandler(slideIndex)
    }

    forwardSlide() {
        let slideIndex = this.slideIndex + 1
        this.slideSelectionHandler(slideIndex)
    }

    currentSlide(event) {
        let slideIndex = Number(event.target.dataset.id)
        this.slideSelectionHandler(slideIndex)
    }

    slideSelectionHandler(id) {
        if (id > this.slides.length) {
            this.slideIndex = 1
        } else if (id < 1) {
            this.slideIndex = this.slides.length
        } else {
            this.slideIndex = id
        }
        this.slides = this.slides.map(item => {
            return this.slideIndex === item.slideIndex ? {
                ...item,
                cardClasses: CARD_VISIBLE_CLASSES,
                dotClases: DOT_VISIBLE_CLASSES
            } : {
                    ...item,
                    cardClasses: CARD_HIDDEN_CLASSES,
                    dotClases: DOT_HIDDEN_CLASSES
                }
        })
    }

}