import { api, LightningElement, track } from 'lwc';
import CaseData from '@salesforce/apex/BWPS_NeedHelpcaseCreate.CreateCaseForSupport';
import BUTTER_FLY from '@salesforce/resourceUrl/Butterfly';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class InstructorSupportContactUs extends LightningElement {
    @track CaseRecords;
    @track temp;
    Subject = 'Subject data';
    Body = 'Body Data';
    Email = 'LWC@gmail.com';
    butterFlyIcon = BUTTER_FLY;
    @api textHeading;
    @track loader = false;

    handleClick(event) {
        event.preventDefault();
        let subjectFieldElement = this.template.querySelector(`[data-id= 'Subject']`);
        let bodyFieldElement = this.template.querySelector(`[data-id= 'Description']`);
        this.Subject = this.template.querySelector(`[data-id= 'Subject']`).value = this.template.querySelector(`[data-id= 'Subject']`).value.trim();
        this.Body = this.template.querySelector(`[data-id= 'Description']`).value = this.template.querySelector(`[data-id= 'Description']`).value.trim();
        //this.Email = this.template.querySelector(`[data-id= 'Email']`).value;
        // let sub = this.template.querySelector(`[data-id= 'Subject']`).reportValidity();
        // let body = this.template.querySelector(`[data-id= 'Description']`).reportValidity();
        // let email = this.template.querySelector(`[data-id= 'Email']`).reportValidity();

        this.temp = {
            "CaseData": {
                "Subject": this.Subject,
                "Body": this.Body,

            }
        }
        //  console.log('tempObj : ',JSON.stringify(this.temp));
        if (this.Subject == '') {
            subjectFieldElement.setCustomValidity('Please Enter Subject');
            subjectFieldElement.reportValidity();
        } else if (this.Body == '') {
            bodyFieldElement.setCustomValidity('Please Enter Message');
            bodyFieldElement.reportValidity();
        } else {
            console.log("notnull");
            this.loader = true;
            CaseData({ CaseMap: this.temp })
                .then(result => {
                    if (result) {
                        this.CaseRecords = result;
                        console.log(this.CaseRecords);
                        this.loader = false;
                        const custEvent = new CustomEvent(
                            'callpasstoparent', {
                            detail: 'false'
                        });
                        this.dispatchEvent(custEvent);
                        this.showToast('Sent successfully', 'success');
                    }
                })
                .catch(error => {
                    this.error = error;
                    this.loader = false;
                    let errorVariant = 'error';
                    console.log('error', error);
                    console.log('error', errorVariant);
                    //let errorBody = this.error.Body.message;
                    //console.log(errorBody);
                    console.log('1');
                    this.showToast('Something went wrong', 'error');
                });
            this.template.querySelector(`[data-id= 'Subject']`).value = this.template.querySelector(`[data-id= 'Description']`).value = '';
        }
    }

    showToast(titleValue, variantValue) {
        console.log('title= ', titleValue);
        console.log('variant= ', variantValue);

        const event = new ShowToastEvent({
            title: titleValue,
            // message: 'Toast Message',
            variant: variantValue,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);

    }
}