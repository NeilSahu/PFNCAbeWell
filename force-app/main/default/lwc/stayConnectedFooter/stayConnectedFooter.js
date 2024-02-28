import { LightningElement, track } from 'lwc';
import StayConnected from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import CreateCaseForSubscription from '@salesforce/apex/BWPS_NeedHelpcaseCreate.CreateCaseForSubscription';
import CreateLeadForSubscription from '@salesforce/apex/BWPS_NeedHelpcaseCreate.CreateLeadforNewsLetter';
export default class StayConnectedFooter extends LightningElement {
    @track StayConnectedButterfly = `${StayConnected}/WebsiteGeneralFiles/butterflyPng.png`;
    backgroundImage = `background-image: url(${this.StayConnectedButterfly})`
    @track submitted = false;
    email = '';
    emailId = 'test@gmail.com';
    Subscribe() {
        // this.emailId = this.template.querySelector(`[data-id= 'email']`).value;
        let emailFieldElement = this.template.querySelector(`[data-id= 'email']`);
        console.log('OUTPUT : ', emailFieldElement.value);
        let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailFieldElement.value);
        let emailId = this.template.querySelector(`[data-id= 'email']`).value;
        let email = this.template.querySelector(`[data-id= 'email']`).reportValidity();
        //console.log('email : ', this.emailId);
        console.log('check ', check);

        if (!check) {
            console.log('dfhgth');
            emailFieldElement.setCustomValidity('Invalid Email');
            emailFieldElement.reportValidity();
            return
        } else {
            emailFieldElement.setCustomValidity('');
            emailFieldElement.reportValidity();
        }

        // if(this.emailId == '' || this.emailId == null || this.emailId == undefined){
        //     return
        // }

        // if(email == false){
        //     return
        //     //this.showErrorToast();
        // }

        if (emailId != '' || emailId != undefined) {
            console.log('emailId==> ', emailId);
            this.submitted = true;

            let temp = {
                "LeadDetails": {
                    "Subject": 'Be Well Parkinson\'s Newsletter',
                    "Body": 'Congratulations !,<br> You have been subscribed for Be Well Parkinson\'s Newsletter.<br>Thankyou',
                    "Email": emailId
                }
            }

            CreateLeadForSubscription({ LeadDetails: temp })
                .then(result => {
                    console.log('result => ', result);
                    if (result) {
                        this.submitted = false;
                        this.ShowToast();
                        this.template.querySelector(`[data-id= 'email']`).value = '';
                    }

                })
                .catch(error => {
                    this.error = error;
                    console.log('this.error ', this.error);
                    this.showErrorToast();
                });

        }
    }
    ShowToast() {
        const event = new ShowToastEvent({
            title: 'You are subscribed user now',
            message: 'Our team will get back to you soon :)',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Some unexpected error occured',
            message: 'Please check your details again',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    // // emailValidation(){

    // //     let emailFieldElement = this.template.querySelector('.emailField');
    // //     let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailFieldElement.value);
    // //     if(!check){

    // //         emailFieldElement.setCustomValidity('Invalid Email Address');
    // //         emailFieldElement.reportValidity();
    // //     }else {
    // //         emailFieldElement.setCustomValidity('');
    // //         emailFieldElement.reportValidity();
    // //     }


    // }

}