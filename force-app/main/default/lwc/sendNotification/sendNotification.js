import { LightningElement, track } from 'lwc';
import getProfileList from '@salesforce/apex/sendNotificationController.getProfileList';
import sendNotificationMethod from '@salesforce/apex/sendNotificationController.sendNotification';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SendNotification extends LightningElement {


    @track profileList = [];

    connectedCallback() {
        getProfileList().then(result => {
            let resultData = result;
            this.profileList = resultData.map(e => { return { label: e.Name, value: e.Name } });
            console.log(JSON.parse(JSON.stringify(this.profileList)));
        }).then(error => {
            console.log(error);
        })
    }

    sendNotification(event) {
        let eventCurrentTarget = event.currentTarget;
        eventCurrentTarget.setAttribute("disabled", "");
        let ProfileName = this.template.querySelector('lightning-combobox').value;
        let notificationMessage = this.template.querySelector('lightning-textarea').value;

        if (ProfileName == undefined || notificationMessage == undefined || notificationMessage == '') {
            this.dispatchEvent(new ShowToastEvent({ variant: 'error', message: 'Please fill all the details !' }));
            eventCurrentTarget.removeAttribute("disabled");
        }
        else {
            sendNotificationMethod({ ProfileName: ProfileName, notificationMsg: notificationMessage }).then(result => {
                if (result == 'Success.') {
                    this.dispatchEvent(new ShowToastEvent({ variant: 'success', message: 'Notification Sent !' }));
                    this.template.querySelector('lightning-combobox').value = '';
                    this.template.querySelector('lightning-textarea').value = '';
                    eventCurrentTarget.removeAttribute("disabled");
                }
                else {
                    eventCurrentTarget.removeAttribute("disabled");
                    this.dispatchEvent(new ShowToastEvent({ variant: 'error', message: result }));
                }
            }).catch(error => {
                console.log(error);
                eventCurrentTarget.removeAttribute("disabled");
                this.dispatchEvent(new ShowToastEvent({ variant: 'error', message: error.message }));
            })
        }


    }
}