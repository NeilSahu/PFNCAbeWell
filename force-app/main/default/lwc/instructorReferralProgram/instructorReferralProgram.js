import { LightningElement, track, wire, api } from 'lwc';
import myImage from '@salesforce/resourceUrl/ReferralProgramImage';
import LeadData from '@salesforce/apex/BWPS_ShareScheduleClass.CreateLeadforScheduleClassshared';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class InstructorReferralProgram extends LightningElement {

    getAllClasses = myImage;
    sendHandler() {
        let name = this.template.querySelector('.nameClass').value;
        let email = this.template.querySelector('.emailClass').value;
        console.log('name : ', name);
        console.log('email : ', email);
    }
    // send email code
    @track CaseRecords;
    @track temp;
    @track loader = false;
    Subject = 'Subject data';
    Body = 'Body Data';
    Email = 'LWC@gmail.com';
    sendMailMethod() {
        console.log('ind');
        let nameFieldElement = this.template.querySelector('.nameClass');
        let name = this.template.querySelector('.nameClass').value;
        let emailFieldElement = this.template.querySelector('.emailClass');
        let email = this.template.querySelector('.emailClass').value;
        this.temp = {
            "LeadDetails": {
                "Subject": 'Be Well Parkinson\'s Referral Program',
                "Body": 'Hello ' + name + ', You have been referred for Be Well Parkinson\'s in Be Well Parkinson\'s Referral Program.',
                "Email": email
            }
        }

        let check = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(emailFieldElement.value);
        this.template.querySelector('.nameClass').value = this.template.querySelector('.nameClass').value.trim();
        if (this.template.querySelector('.nameClass').value == '') {
            console.log('OUTPUT2');
            nameFieldElement.setCustomValidity('Please Enter Name');
            nameFieldElement.reportValidity();
        } else if (!check) {
            emailFieldElement.setCustomValidity('Invalid Email Address');
            emailFieldElement.reportValidity();
        } else {
            console.log("email  " + email);
            console.log("temp : ", JSON.stringify(this.temp));
            this.loader = true;
            LeadData({ LeadDetails: this.temp })
                .then(result => {
                    this.CaseRecords = result;
                    this.loader = false;
                    if (this.CaseRecords == null) {
                        // this.template.querySelector('c-toast-message').showToast('error', 'Please enter the details.');
                        this.showToast('Please enter the details.', 'error');
                    }
                    else {
                        // this.template.querySelector('c-toast-message').showToast('success', 'Mail sent successfully.');
                        this.showToast('Mail sent successfully.', 'success');
                    }
                })
                .catch(error => {
                    this.error = error;
                    this.loader = false;
                    console.log('error>>>', this.error)
                });
            console.log("fire");
            const custEvent = new CustomEvent(
                'callpasstoparent', {
                detail: 'false'
            });
            this.dispatchEvent(custEvent);

            this.template.querySelector('.nameClass').value = "";
            this.template.querySelector('.emailClass').value = "";
        }

    }

    showToast(title, variant) {
        console.log('title= ', title);
        console.log('variant= ', variant);
        const event = new ShowToastEvent({
            title: title,
            // message: 'Toast Message',
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}