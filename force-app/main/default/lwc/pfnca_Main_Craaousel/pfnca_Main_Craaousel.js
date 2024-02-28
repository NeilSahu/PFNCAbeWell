import { LightningElement, track } from 'lwc';
import GetSliderSRecords from '@salesforce/apex/GetSliderSRecords.GetAllSliderRecords';

export default class Pfnca_Main_Craaousel extends LightningElement {

    @track slides = [];

    async connectedCallback() {
        await GetSliderSRecords()
            .then((result) => {

                let arr = [];
                var obj = {};

                if (result != undefined && result != null) {

                    result.forEach(currentItem => {
                        obj = {
                            "image": currentItem.SliderURL__c,
                            "heading": currentItem.Name,
                            "description": currentItem.description__c
                        }
                        arr.push(obj);
                    });

                    console.log('Craaousel slider array: ', JSON.stringify(arr));
                    this.slides = arr;

                } else {
                    console.log('Craaousel slider array error: ', JSON.stringify(result));
                }
            })
    }

}