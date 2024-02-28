import { LightningElement, track } from 'lwc';
export default class GuestUserSupportTab extends LightningElement {
 
   @track Resources = true;
    contact = false;
    Faqs = false;

    

    handleResources(){
        this.contact = false;
        this.Resources = true;
        this.Faqs = false;
    }

    handleFaq(){
     
        this.contact = false;
        this.Resources = false;
        this.Faqs =true;
           console.log("data1", this.Faqs);
    }

    handleContact(){
        this.Resources = false;
        this.contact = true;
        this.Faqs =false;
    }

}