import { LightningElement,track,api } from 'lwc';
import LeadData from '@salesforce/apex/BWPS_ShareScheduleClass.CreateLeadforScheduleClassshared';
export default class Bwps_ShareBlueTheamUI extends LightningElement {

    @api sendemailui;
    @track CaseRecords;
    @track temp;
    Subject ='';
    Body ='';
    Email ='';
    sendMailMethod(){
        console.log('ind');
        this.Subject = this.template.querySelector(`[data-id= 'Subject']`).value;
        this.Body = this.template.querySelector(`[data-id= 'Description']`).value;
        this.Email = this.template.querySelector(`[data-id= 'Email']`).value;
        if(this.Email != null && this.Email != '' && this.Body !=null && this.Body != ''){
            this.temp={
                "LeadDetails":{
                    "Subject":this.Subject,
                "Body":this.Body,
                "Email": this.Email
                }
            }
           console.log("body  "+this.Body);
           console.log("temp : ",JSON.stringify(this.temp));
           LeadData({LeadDetails:this.temp})
           .then(result => {
               this.CaseRecords = result;
               console.log("output");
               console.log(this.CaseRecords);
           })
           .catch(error => {
               this.error = error;
               console.log('error',this.error)
           });
           console.log("fire");
           const custEvent = new CustomEvent(
           'callpasstoparent', {
               detail: 'false'
           });
           this.dispatchEvent(custEvent);
           this.template.querySelector('c-toast-message').showToast('success', 'Mail sent successfully.');
           this.hideSendModalBox();
        } else {
            this.template.querySelector('c-toast-message').showToast('Error', 'Email and body should not be blank.');
        }
    }
    hideSendModalBox(){
       this.sendemailui = false; 
    }
}