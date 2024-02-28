import { LightningElement,wire } from 'lwc';
import getSingleResource from '@salesforce/apex/bwps_websiteGeneralFaqClass.getSingleResource';
import imageResource from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import imageResource1 from '@salesforce/resourceUrl/WebsiteGenFaqImage';
import {CurrentPageReference} from 'lightning/navigation';
export default class Bwps_WIP_resourceDetailView extends LightningElement {
    img1 = `${imageResource}/WebsiteGeneralFiles/blog_photo.png`;
    backIcon = imageResource1 + "/chevron-1.svg";
    name;
    description;
    author;
    date;
    result1;
    dateTimeFormatter(dateString){
        // - dateString: "2023-01-17T11:01:12.000Z"
        // - retrun format: "January 17, 2023"
        const event = new Date(dateString);
        const options = {  year: 'numeric', month: 'long', day: 'numeric' };
        return event.toLocaleDateString('en-US', options);
    }
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if(currentPageReference){
          var base64Data=currentPageReference.state?.app;
           this.result1 =window.atob(base64Data);
           console.log('OUTPUT : ',this.result1);
            getSingleResource({resId:this.result1}) .then(result => {
               this.name =result[0].Name;
               this.description = result[0].Description__c;
               this.author = result[0].CreatedBy.FirstName +' '+ result[0].CreatedBy.LastName,
               this.date = this.dateTimeFormatter(result[0].CreatedDate),
               this.link = "https://player.vimeo.com/video/"+result[0].BWPS_Link__c,
               this.template.querySelector(".blog-info").innerHTML = `<style>p{margin-bottom: 1rem;}</style>` + this.description;
               console.log('OUTPUT : ',this.resource);
            }).catch(error=>{
                console.log('OUTPUT : ',error);
            });
        }
    }
    handleBack(){
        console.log('yoooooooo');
       window.open('/PFNCADNA/s/bwps-websitegeneralhomepage','_self');
    }
}