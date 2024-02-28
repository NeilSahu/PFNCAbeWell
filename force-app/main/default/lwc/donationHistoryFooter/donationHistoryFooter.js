import { LightningElement } from 'lwc';
import CLOSELogo from '@salesforce/resourceUrl/Close';
export default class DonationHistoryFooter extends LightningElement {
   closeIcon =`${CLOSELogo}#logo`;
    showModal = false;


    handleClick(){
        this.showModal = true;
    }

    closeModal(){
        this.showModal = false;   
    }

     passToParent(event){
         this.closeModal();
         console.log("log");
        
       
    }

}