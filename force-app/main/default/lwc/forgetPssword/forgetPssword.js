import { LightningElement,track } from 'lwc';
import imageResoure from '@salesforce/resourceUrl/WebsiteGeneralHeader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import forgotPassword from '@salesforce/apex/CommunityAuthController.forgotPassword';
export default class ForgetPssword extends LightningElement {

    bewell_logo = imageResoure + '/PFNCA_PrimaryLogo_Color_tm_RGB_150dpi-1@2x.png';
    backgroundImage = `background-image: url(${this.bewell_logo})`;
    @track userName;
    getUserPassword(event){
     this.userName = event.target.value;
    }
    resetPassword(){
      forgotPassword({userName:this.userName}).then(result => {
       console.log('Resultt>> ',result);
       if(result){
        this.ShowToast('Success','Password reset link send successfully please check your email and reset it.' , 'Success','dismissable'); 
       } else{
        this.ShowToast('Failed','Error while resetting password contact your system admin.' , 'error','dismissable'); 
       }
      }).catch(e=>{
          console.log('ERRRR>> ',e);
          this.ShowToast('Failed','Error while resetting password contact your system admin.' , 'error','dismissable'); 
      })
    }

     ShowToast(title, message,variant,mode) {
        const event = new ShowToastEvent({
            title: title+':)',
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }
}