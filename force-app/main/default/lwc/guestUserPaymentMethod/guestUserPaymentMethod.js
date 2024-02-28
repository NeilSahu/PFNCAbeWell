import { LightningElement, wire,track } from 'lwc';
import ID_FIELD from '@salesforce/schema/Payment_Method__c.Id';
import VisaLogo from '@salesforce/resourceUrl/VisaLogo';
import BELLICON from '@salesforce/resourceUrl/Bell_Icon';
import EditIcons1 from '@salesforce/resourceUrl/EditIcons1';
import DeteleIcon from '@salesforce/resourceUrl/DeteleIcon';
import { updateRecord } from 'lightning/uiRecordApi';
import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import fetchPaymentDetail from '@salesforce/apex/BWPS_InstructorClassProfile.fetchPaymentDetail';
import fetchCardsDerail from '@salesforce/apex/BWPS_InstructorClassProfile.fetchCardsDerail';
import deletePaymentRecord from '@salesforce/apex/BWPS_InstructorClassProfile.deletePaymentRecord';
import Payment_Method__c from '@salesforce/schema/Payment_Method__c';
import Name__c from '@salesforce/schema/Payment_Method__c.Name__c';
import Card_Number__c from '@salesforce/schema/Payment_Method__c.Card_Number__c';
import Expiration_Date__c from '@salesforce/schema/Payment_Method__c.Expiration_Date__c';
import CVV__c from '@salesforce/schema/Payment_Method__c.CVV__c';
import Country__c from '@salesforce/schema/Payment_Method__c.Country__c';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
export default class GuestUserPaymentMethod extends LightningElement {

  VisaLogo = VisaLogo;
  BELLICON = BELLICON;
  EditIcons1 = EditIcons1;
  DeteleIcon = DeteleIcon;
  Name = '';
  CardNumber = '';
  ExpirationDate = ''
  country = '';
  CVV = '';
  jname = '';
  Id = '';
  @track response1 =[];
  @track response =[];
  searchKey ='';
  searchKey1 ='';
  refreshcmp ='';
    @track  showNotificationFlag = false;
    @track notrecords=[];
    @track notificationVisibel=[];
    @track totalNotifications =0;

      showNotificationMethod(){
       console.log('OUTPUT1 : ');
       this.showNotificationFlag = !this.showNotificationFlag;
     }
    
    // for notification number
        @wire(fetchNotification)
   wiredData({ data, error }) {
    if(data != null && data != '' && data != undefined){
    var notificationData =  JSON.parse(JSON.parse(data));
    var firstLoop = true;
    for(let i= 0;i<notificationData.notifications.length;i++){
      var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
      var todayDate = new Date();
      var timeinMilliSec = todayDate-nottificationdate+'ago';
    if(notificationData.notifications[i].read == false){
      this.totalNotifications+=1;
     }
     var obj = {
       id:notificationData.notifications[i].id,
       Name:'Kirsten Bodensteiner',
       image:notificationData.notifications[i].image,
       Active__c : timeinMilliSec,
       Message__c:notificationData.notifications[i].messageBody,
     }
     this.notrecords.push(obj);
     if(firstLoop){
     this.notificationVisibel.push(obj);
     firstLoop=false;
     }
    
    }
    
    } else {
       console.log('errorfghgg>>> ',JSON.stringify(error));
    }
    }
  // loop for card details
  @wire(fetchCardsDerail)
  Rec({ error, data }) {
    if (data) {
      console.log('data11',data);
      this.refreshcmp = data;
      this.response = JSON.parse(JSON.stringify(data));
      
      for( let i=0 ;i<this.response.length;i++) {

        const num = this.response[i].Card_Number__c;

        const last4Str = String(num).slice(-4); 
        const last4Num = Number(last4Str); 
       this.response[i].Card_Number__c=  last4Num;
       const num1 = this.response[i].Expiration_Date__c;
        var dateStr = num1;
        var dateArray = dateStr.split("-"); 
        var exprirationdate = (dateArray[1]+"/"+dateArray[0]);
        this.response[i].Expiration_Date__c = exprirationdate;
        console.log("num",this.response[i]);
      
      }
       
    }
    else if (error) {
      console.log('error ',error);
    }
  }
  editCardText='Add a New Card';


 // for edit button
  edit(event) {
    this.editCardText = 'Edit your card';
    console.log('dlt1');
    this.searchKey = event.target.dataset.id;
    fetchPaymentDetail({searchKey: this.searchKey})
        .then(result => {
            this.Id = result.Id
            this.Name = result.Name__c;
            this.CardNumber = result.Card_Number__c;
            this.ExpirationDate = result.Expiration_Date__c;

             this.CVV = result.CVV__c;
            this.country = result.Country__c
            this.template.querySelector('[data-id="country"]').value = result.Country__c;
            console.log('res',result)

        })
        .catch(error => {
            this.error = error;
        });
    }
  
    Delete(event) {
      console.log('dlt');
      this.searchKey1 = event.target.dataset.id;
      deletePaymentRecord({searchKey1: this.searchKey1})
          .then(result => {
           console.log("res");
           
         this.template.querySelector('c-toast-message').showToast('success', 'Card Deleted successfully.');
          })
          .catch(error => {
            this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to delete the card. Please try again.');
          });
      }

  handleClickSaveBtn() {

    const fields = {};
    fields[Name__c.fieldApiName] = this.template.querySelector(`[data-id= 'fname']`).value;
    fields[Card_Number__c.fieldApiName] = this.template.querySelector(`[data-id= 'cardNumber']`).value;
    fields[Expiration_Date__c.fieldApiName] = this.template.querySelector(`[data-id= 'ExpirationDate']`).value;
    fields[CVV__c.fieldApiName] = this.template.querySelector(`[data-id= 'CVV']`).value;
    fields[Country__c.fieldApiName] = this.template.querySelector(`[data-id= 'country']`).value;

     if (this.Id == '') {
            const recordInput1 = { apiName: Payment_Method__c.objectApiName, fields };
            createRecord(recordInput1)
            .then(() => {
            
              this.template.querySelector('c-toast-message').showToast('success', 'Card added successfully.');
            })
            .catch(error => {
            this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to save the card. Please try again.');
            })
     }
      else {
      
              fields[Name__c.fieldApiName] = this.template.querySelector(`[data-id= 'fname']`).value;
              fields[Card_Number__c.fieldApiName] = this.template.querySelector(`[data-id= 'cardNumber']`).value;
              fields[Expiration_Date__c.fieldApiName] = this.template.querySelector(`[data-id= 'ExpirationDate']`).value;
              fields[CVV__c.fieldApiName] = this.template.querySelector(`[data-id= 'CVV']`).value;
           //   fields[Country__c.fieldApiName] = this.template.querySelector(`[data-id= 'country']`).value;
              console.log('cont',this.template.querySelector(`[data-id= 'country']`).value);
              fields[ID_FIELD.fieldApiName] = this.Id;
              const recordInput = { fields }; 
              updateRecord(recordInput)
              .then(() => {
             
               
              this.template.querySelector('c-toast-message').showToast('success', 'Card updated successfully.');
              })
              .catch(error => {
                this.error = error;
                console.log('error1',this.error);
              this.template.querySelector('c-toast-message').showToast('error', 'An error occurred while trying to update the card. Please try again.');
              })
              refreshApex(this.refreshcmp);
     }
       
    }

  }