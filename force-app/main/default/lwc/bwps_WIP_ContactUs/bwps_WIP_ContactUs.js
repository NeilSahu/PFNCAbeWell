import { LightningElement, track } from 'lwc';
import LeadData from '@salesforce/apex/BWPS_ShareScheduleClass.CreateLeadforContactUs';
import social from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import Logo from '@salesforce/resourceUrl/WIPlogo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import heroImage from '@salesforce/resourceUrl/headerHeroImages';

export default class Bwps_WIP_ContactUs extends LightningElement {

    heroImage = heroImage + '/headerCU.png';
    @track loading = false;
    blueTwitter = `${social}/WebsiteGeneralFiles/Twitter.svg`;
    blueFacebook = `${social}/WebsiteGeneralFiles/Facebook.svg`;
    blueInstragram = `${social}/WebsiteGeneralFiles/Instagram.svg`;
    bottomimg = `${Logo}/WIPlogo/bottomImageAboutUs.png`;
    contactus = `${Logo}/WIPlogo/contactus.png`;
    name = '';
    email = '';
    confirmemail = '';
    phone = '';
    message = '';
    LeadRecord;
    NameVal = 'Subject data';
    Emailval = 'Body Data';
    Phoneval = 'LWC@gmail.com';
    MessageVal = 'hello this is message section';

    onSubmit() {
        //event.preventDefault();
        console.log('ind');
        this.template.querySelector(`[data-id= 'name']`).value = this.template.querySelector(`[data-id= 'name']`).value.trim();
        this.template.querySelector(`[data-id= 'email']`).value = this.template.querySelector(`[data-id= 'email']`).value.trim();
        this.template.querySelector(`[data-id= 'message']`).value = this.template.querySelector(`[data-id= 'message']`).value.trim();

        this.template.querySelector(`[data-id= 'name']`).reportValidity();
        this.template.querySelector(`[data-id= 'email']`).reportValidity();
        this.template.querySelector(`[data-id= 'confirmemail']`).reportValidity();
        this.template.querySelector(`[data-id= 'message']`).reportValidity();

        let messgaeFieldElement = this.template.querySelector(`[data-id= 'message']`);
        let emailFieldElement = this.template.querySelector(`[data-id= 'email']`);
        let confirmEmailFieldElement = this.template.querySelector(`[data-id= 'confirmemail']`);

        console.log('New==> ', emailFieldElement.value);
        let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailFieldElement.value);

        if (!this.template.querySelector(`[data-id= 'name']`).reportValidity()) {
            return;

        } else if (emailFieldElement.value == '') {
            emailFieldElement.setCustomValidity('Please fill out this field.');
            emailFieldElement.reportValidity();
            return;

        } else if (!check) {
            emailFieldElement.setCustomValidity('Invalid Email Address');
            emailFieldElement.reportValidity();
            return;

        } else if (confirmEmailFieldElement.value == '') {
            confirmEmailFieldElement.setCustomValidity("Please fill out this field.");
            confirmEmailFieldElement.reportValidity();
            return;
        } 
        else if (emailFieldElement.value != confirmEmailFieldElement.value) {
            confirmEmailFieldElement.setCustomValidity("Email Address did'nt match");
            confirmEmailFieldElement.reportValidity();
            return;
        } 
        else if (!this.template.querySelector(`[data-id= 'message']`).reportValidity()) {

            return;
        } else {
            emailFieldElement.setCustomValidity('');
            emailFieldElement.reportValidity();
        }

        this.NameVal = this.template.querySelector(`[data-id= 'name']`).value;
        this.Emailval = this.template.querySelector(`[data-id= 'email']`).value;
        // this.Phoneval = this.template.querySelector(`[data-id= 'phone']`).value;
        this.MessageVal = this.template.querySelector(`[data-id= 'message']`).value;
        this.temp = {
            "LeadDetails": {
                "Name": this.NameVal,
                "Email": this.Emailval,
                "Message": this.MessageVal
            }
        }
        console.log("body  " + this.MessageVal);
        console.log("temp : ", JSON.stringify(this.temp));


        this.loading = true;

        LeadData({ LeadDetails: this.temp })
            .then(result => {
                this.LeadRecord = result;
                console.log("output");
                console.log(this.LeadRecord);
                this.loading = false;
                if (this.LeadRecord != '' && this.LeadRecord != undefined) {
                    // this.loading = false;
                    this.ShowToast();
                }
                else if (this.LeadRecord == '' || this.LeadRecord == undefined) {
                    // this.loading = false;
                    this.showErrorToast();
                }
                this.template.querySelector(`[data-id= 'name']`).value = '';
                this.template.querySelector(`[data-id= 'email']`).value = '';
                this.template.querySelector(`[data-id= 'message']`).value = '';
            })
            .catch(error => {
                this.error = error;
                console.log('error', this.error)
                this.loading = false;
                this.showErrorToast();
                this.template.querySelector(`[data-id= 'name']`).value = '';
                this.template.querySelector(`[data-id= 'email']`).value = '';
                this.template.querySelector(`[data-id= 'message']`).value = '';
            });
    }
    ShowToast() {
        const event = new ShowToastEvent({
            title: 'Thank you for Contacting Us',
            message: 'Our team will get back to you soon :)',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Some unexpected error occured',
            message: 'please check your details again',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }


}