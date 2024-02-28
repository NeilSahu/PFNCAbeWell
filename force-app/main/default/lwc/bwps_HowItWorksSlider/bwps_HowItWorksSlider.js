import { LightningElement } from 'lwc';
import testimg from '@salesforce/resourceUrl/testimg';
import testimg2 from '@salesforce/resourceUrl/testimg2';
import testimg3 from '@salesforce/resourceUrl/testimg3';
import BackgroundImageContact from '@salesforce/resourceUrl/BackgroundImageContact';
import sliderbackgroundimg from '@salesforce/resourceUrl/sliderbackgroundimg';
export default class Bwps_HowItWorksSlider extends LightningElement {

     imgarr = [testimg,testimg2,testimg3];
    // sliderbackgroundimg = sliderbackgroundimg;
     count = 0;
     slideimg = '';
     progress = 2000;  
     BackgroundImageContact=BackgroundImageContact
     get backgroundStyleImg() 
     {
         return `background-image:url(${BackgroundImageContact})`;
     }
     get backgroundStyle() {
        return `
        width: 100%;
        margin-left: 0rem;
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: bottom;
        background-position-x: 0rem;
        background-image:url(${sliderbackgroundimg})`;
    }
    connectedCallback() {  
        this.slideimg = this.imgarr[this.count];
        this._interval = setInterval(() => {  
        this.count++;
        if (this.count==3) {
            this.count=0;
        }     
        this.template.querySelectorAll('.dot-btn').forEach(dots => {
            if (dots.classList.contains('btn-visible')) {
                dots.classList.remove('btn-visible')
            }
        });
        this.template.querySelectorAll('.dot-btn')[this.count].classList.add('btn-visible')
        this.slideimg = this.imgarr[this.count];
        // console.log(this.count)
        // console.log(this.slideimg)
        }, this.progress);    
    }

}