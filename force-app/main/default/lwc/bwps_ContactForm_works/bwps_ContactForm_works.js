import { LightningElement,wire } from 'lwc';
import butterfly_blue from '@salesforce/resourceUrl/butterfly_blue';
import getUserProfileName from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchUserDetail';
export default class Bwps_ContactForm_works extends LightningElement {
butterFlyIcon =butterfly_blue;

 //onContactUsClick = '/PFNCADNA/s/bwps-wip-contactus';

guestUser = false;

onContactUsClick(){
    if(this.guestUser){
        
           window.open('/PFNCADNA/s/guestusercontact','_self');
    }else{

        window.open('/PFNCADNA/s/bwps-wip-contactus','_self');   
    }
}
     @wire(getUserProfileName)
    getUserProfile({data,error}){
        
        if(data){
            if(data.Profile.Name == 'Guest User'){

                this.guestUser = true;
            
            }
        }

    }
}