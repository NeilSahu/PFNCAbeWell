import { LightningElement,track,api } from 'lwc';
import CAROUSEL_IMAGES from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import blogs from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';
import GetSliderSRecords from '@salesforce/apex/GetSliderSRecords.GetAllSliderRecords';
// const CAROUSEL_IMAGES = '';
export default class CustomCarouselWrapper extends LightningElement {

    @track slides =[]; 
   /* slides= [
        {
            image:`${CAROUSEL_IMAGES}/WebsiteGeneralFiles/defyparkinson.png`,
            heading:'Defy Parkinson\'s',
            description:'Join Be Well members on our digital platform and get moving, stay connected with others and slow the progression of your disease. Choose from our on-demand classes you can watch anytime and over 30 live classes each week.'
        },
        {
            image:`${CAROUSEL_IMAGES}/WebsiteGeneralFiles/defyparkinson.png`,
            heading:'Caption Two',
            description:'You can add description of second slide here'
        },
        {
            image:`${CAROUSEL_IMAGES}/WebsiteGeneralFiles/defyparkinson.png`,
            heading:'Caption Three',
            description:'You can add description of third slide here'
        }
    ]*/
    
    async connectedCallback() {
        await GetSliderSRecords()
        .then((result) => {
                let arr = [];
                var obj = {};
            if (result != undefined && result != null) {
                    for (let i = 0; i < result.length; i++) {
                        obj = {
                            "image": result[i].SliderURL__c,
                            "heading": result[i].Name,
                            "description": result[i].description__c
                            }
                    arr.push(obj); 
                    }                    
            }  
            console.log('arr slider',JSON.stringify(arr));  
            this.slides = arr;
        })
    }
}