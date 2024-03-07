import { LightningElement,track,wire } from 'lwc';
import testimg from '@salesforce/resourceUrl/testimg';
import testimg2 from '@salesforce/resourceUrl/testimg2';
import testimg3 from '@salesforce/resourceUrl/testimg3';
import BackgroundImageContact from '@salesforce/resourceUrl/BackgroundImageContact';
import sliderbackgroundimg from '@salesforce/resourceUrl/sliderbackgroundimg';
import sliderbackgroundimg2 from '@salesforce/resourceUrl/sliderbackgroundimg2';
import testimonialAboutUs from '@salesforce/apex/GetSliderSRecords.testimonialAboutUs';

export default class Bwps_HowItWorksSlider extends LightningElement {
    
    imgarr = [testimg,testimg2,testimg3];
    // sliderbackgroundimg = sliderbackgroundimg;
    count = 0;
    slideimg = '';
    @track testimonalArray = [];
    @track testimonalMainArr = [];
    @track index = 0;
    @track defaultImage = testimg;
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
        background-size: 95%;
        background-position: bottom;
        background-position-x: 0rem;
        background-image:url(${sliderbackgroundimg2})`;
    }
    connectedCallback() {  
        // this.slideimg = this.imgarr[this.count];
        // this._interval = setInterval(() => {  
        // this.count++;
        // if (this.count==3) {
        //     this.count=0;
        // }     
        // this.template.querySelectorAll('.dot-btn').forEach(dots => {
        //     if (dots.classList.contains('btn-visible')) {
        //         dots.classList.remove('btn-visible')
        //     }
        // });
        // this.template.querySelectorAll('.dot-btn')[this.count].classList.add('btn-visible')
        // this.slideimg = this.imgarr[this.count];
        // // console.log(this.count)
        // // console.log(this.slideimg)
        // }, this.progress); 

        if(true){
            let slider = window.setInterval(()=>{
                this.updateTestimonalRecord();
            }, 2000);
        }   
    }

    @wire(testimonialAboutUs)
    testimonialAboutUss({ error, data }) {
        //console.log('dattaa : ',JSON.stringify(data));
        if (data) {
            if (data != undefined && data != null) {
                try{
                    let arr = data;
                    for (let i = 0; i < arr.length; i++) {
                        let img = arr[i].Photo_URL__c;
                        if(img != '' && img != null && img != undefined){
                            img = arr[i].Photo_URL__c;
                        }else{
                            img = this.defaultImage;
                        }
                        let obj = {
                            "id": arr[i].Id,
                            "image": img,
                            "name": arr[i].testimonial_Name__c,
                            "message": arr[i].testimonialquote__c,
                            "designation" : arr[i].testimonial_designation__c
                        }
                        this.testimonalMainArr.push(obj); 
                    }
                    //console.log('this.testimonalMainArr : ',JSON.stringify(this.testimonalMainArr));
                    //this.testimonalArray.push(this.testimonalMainArr[0]);
                    //this.updateTestimonalRecord();  
                }
                catch(error){
                    console.log('catch error : ',error, error.message);
                }
            }
        } 
        if (error) {
            console.log('erroeeee>>>', error, error.message, JSON.stringify(error));
        }
    } 
    updateTestimonalRecord(){
        try{
            //console.log('Index : ',this.index);
            if(this.index > 2){
                this.index = 0;
            }
            if(this.index < this.testimonalMainArr.length){
                this.testimonalArray = [];
                this.testimonalArray.push(this.testimonalMainArr[this.index]);
            }
            this.index = this.index + 1;
            //console.log('this.testimonalArray : ',JSON.stringify(this.testimonalArray));
        }
        catch(error){
            console.log('err : ',error , error.message);
        }
    } 
}