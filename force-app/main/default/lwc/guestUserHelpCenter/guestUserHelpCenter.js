import { LightningElement } from 'lwc';
import BUTTER_FLY from '@salesforce/resourceUrl/Butterfly';
import CLOSELogo from '@salesforce/resourceUrl/Close';
export default class GuestUserHelpCenter extends LightningElement {
 butterFlyIcon =BUTTER_FLY;

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
    navigateToFaq(){
        window.open('/PFNCADNA/s/guestuserfaq','_self');
    }

    
}