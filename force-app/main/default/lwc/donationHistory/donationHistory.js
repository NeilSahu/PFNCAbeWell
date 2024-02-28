import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import downloadlogo from '@salesforce/resourceUrl/downloadlogo';
import arrowlogo from '@salesforce/resourceUrl/arrowlogo';
import ticklogo from '@salesforce/resourceUrl/ticklogo';
import failedlogo from '@salesforce/resourceUrl/failedlogo';
import dropdownarrow from '@salesforce/resourceUrl/dropdn';
import dropuparrow from '@salesforce/resourceUrl/dropup';
import BWPS_DonationHistoryMethod from '@salesforce/apex/BWPS_DonationHistoryClass.BWPS_DonationHistoryMethod';
import getOppPDFDocId from '@salesforce/apex/BWPS_DonationHistoryClass.getOppPDFDocId';
import downloadAllReceiptPDF from '@salesforce/apex/BWPS_DonationHistoryClass.downloadAllReceiptPDF';
import ImageURL from '@salesforce/resourceUrl/WebsiteGeneralFiles';
import basePath from '@salesforce/community/basePath';
import { CurrentPageReference } from 'lightning/navigation';
export default class DonationHistory extends LightningElement {

  LastDonationAmt = Number(0).toFixed(2);
  LastDonationDate = '';
  LastDonationName = '';
  LastDonationURL;
  honorView = false;
  honoreeName = '';

  // donationhandlogo = `${ImageURL}/WebsiteGeneralFiles/DedicationLogo.png`;
  donationhandlogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='125.531' height='74.947' viewBox='0 0 125.531 74.947'%3E%3Cpath id='Dedication_Icon' d='M93.127,23.133c-8.281,0-15.043,7-15.043,15.642,0,13.479,21.6,28.081,24.082,29.682a3.905,3.905,0,0,0,4.277,0c2.484-1.6,24.088-16.2,24.088-29.682,0-8.641-6.761-15.642-15.043-15.642a14.7,14.7,0,0,0-11.158,5.16,14.861,14.861,0,0,0-11.2-5.16ZM43.068,52.478a20.429,20.429,0,0,0-3.122.234c-5.677.872-10.542,3.8-19.424,8.935L5,70.609l5.35,9.262,4.713,8.167,3.983,6.9L20.86,98.08l7.464-4.31c7.464-4.31,7.464-4.31,15.4-2.179L59.6,95.841c7.938,2.125,7.938,2.125,19.973-.768l12.035-2.893,18.852-4.533c3.095-.746,3.394-4.108,1.9-6.712a6.1,6.1,0,0,0-5.279-3.2l-12.182.033-9.028.027c-9.028.027-9.028.027-20.018-3.34L54.857,71.083l-.7-.212-.005.011a2.355,2.355,0,1,1,1.335-4.517,2.174,2.174,0,0,1,.539.24l13.713,4.468A5.349,5.349,0,1,0,73.054,60.9L57.809,55.932c-6.026-1.961-10.3-3.438-14.743-3.454Z' transform='translate(-5 -23.133)' fill='%23ff9f37' fill-rule='evenodd'/%3E%3C/svg%3E";
  test = [1, 2, 3];
  // ticklogo = ticklogo;
  ticklogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26.709' height='26.709' viewBox='0 0 26.709 26.709'%3E%3Cpath id='Success_Icon' d='M26.482,14.635a.953.953,0,0,1,0,1.355L17.9,24.574a.953.953,0,0,1-.677.277h-.057a.956.956,0,0,1-.687-.362L12.66,19.719a.954.954,0,1,1,1.488-1.183l3.148,3.93,7.831-7.831a.953.953,0,0,1,1.355,0Zm6.477,4.97a13.352,13.352,0,1,1-3.911-9.444A13.36,13.36,0,0,1,32.959,19.6Zm-1.908,0A11.447,11.447,0,1,0,27.7,27.7,11.444,11.444,0,0,0,31.051,19.6Z' transform='translate(-6.25 -6.25)' fill='%237e964e'/%3E%3C/svg%3E";
  failedlogo = failedlogo;
  // downloadlogo = downloadlogo;
  downloadlogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Download' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='16' height='16' fill='none'/%3E%3Cg id='Download_Icon' data-name='Download Icon' transform='translate(-562 -2324.999)'%3E%3Cg id='noun_Download_file_598283' data-name='noun_Download file_598283' transform='translate(565 2325)'%3E%3Cpath id='Path_10926' data-name='Path 10926' d='M12.931,19.317a.385.385,0,0,1-.273-.113l-1.545-1.545a.386.386,0,0,1,.546-.546l1.272,1.272L14.2,17.113a.386.386,0,0,1,.546.546L13.2,19.2A.385.385,0,0,1,12.931,19.317Z' transform='translate(-7.098 -9.127)' fill='%23008ba7'/%3E%3Cpath id='Path_10927' data-name='Path 10927' d='M15.386,15.634A.386.386,0,0,1,15,15.248V11.386a.386.386,0,0,1,.772,0v3.862A.386.386,0,0,1,15.386,15.634Z' transform='translate(-9.553 -5.652)' fill='%23008ba7'/%3E%3Cpath id='Path_10928' data-name='Path 10928' d='M15.529,25.772H9.5A.4.4,0,1,1,9.5,25h6.027a.4.4,0,1,1,0,.772Z' transform='translate(-6.683 -13.679)' fill='%23008ba7'/%3E%3Cpath id='Path_10929' data-name='Path 10929' d='M13.515,14.357H4.152A1.139,1.139,0,0,1,3,13.234V4.017A1.494,1.494,0,0,1,3.434,2.97L5.969.434A1.471,1.471,0,0,1,7.017,0h6.5a1.138,1.138,0,0,1,1.151,1.122V13.235A1.138,1.138,0,0,1,13.515,14.357ZM7.017.9a.58.58,0,0,0-.413.171L4.068,3.6a.589.589,0,0,0-.171.413v9.217a.242.242,0,0,0,.255.226h9.362a.241.241,0,0,0,.254-.225V1.122A.241.241,0,0,0,13.514.9Z' transform='translate(-3 0)' fill='%23008ba7'/%3E%3Cpath id='Path_10930' data-name='Path 10930' d='M7.738,5.7H6.386a.386.386,0,1,1,0-.772H7.738a.193.193,0,0,0,.193-.193V3.386a.386.386,0,0,1,.772,0V4.738A.967.967,0,0,1,7.738,5.7Z' transform='translate(-4.841 -1.841)' fill='%23008ba7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  arrowlogo = arrowlogo;
  dropdownarrow = dropdownarrow;
  dropuparrow = dropuparrow;
  date;
  @track donationHistory;
  result1;
  wireddonationhistory;
  DonarDashboardDetailsURL = '/PFNCADNA/s/donordashboarddetails';
  @track JSONArray = [];
  @track tempArr = [];
  @track showDropdown = false;
  @track isEmpty = true;
  @wire(CurrentPageReference)
  getStateParameters(currentPageReference) {
    if (currentPageReference) {
      console.log('currentPageReference>>> ', JSON.stringify(currentPageReference));
      console.log('Stata>. ', currentPageReference.attributes.name);
      this.pageName = currentPageReference.attributes.name;
    }
  }

  @wire(BWPS_DonationHistoryMethod)
  wireddonationhistory({ data, error }) {
    if (data) {
      try {
        console.log('data. ==== Neha check ', JSON.stringify(data));
        console.log('size ', data.length);
        var arr = [];
        var obj = {};

        for (let i = 0; i < data.length; i++) {
          var oppoId;
          var oppoEmail;
          var oppoName;
          var OppoHonoree;
          if (data[i].hasOwnProperty('Opportunities__r')) {
            oppoId = data[i].Opportunities__r[0].Id;
            oppoName = data[i].Opportunities__r[0].Name;
            OppoHonoree = data[i].Opportunities__r[0].npsp__Honoree_Name__c;
            oppoEmail = data[i].ChargentOrders__Billing_Email__c;
          }
          if (data[i].hasOwnProperty('ChargentOrders__Transactions__r')) {
            for (let j = 0; j < data[i].ChargentOrders__Transactions__r.length; j++) {
              obj = {
                "Id": data[i].ChargentOrders__Transactions__r[j].Id,
                "Name": data[i].ChargentOrders__Transactions__r[j].Name,
                "LastModifiedById": data[i].ChargentOrders__Transactions__r[j].LastModifiedById,
                "LastModifiedDate": data[i].ChargentOrders__Transactions__r[j].LastModifiedDate,
                "ChargentOrders__Amount__c": data[i].ChargentOrders__Transactions__r[j].ChargentOrders__Amount__c,
                "ChargentOrders__Response_Status__c": data[i].ChargentOrders__Transactions__r[j].ChargentOrders__Response_Status__c,
                "ChargentOrders__Bank_Account_Status__c": data[i].ChargentOrders__Transactions__r[j].ChargentOrders__Bank_Account_Status__c,
                "ChargentOrders__Payment_Method__c": data[i].ChargentOrders__Transactions__r[j].ChargentOrders__Payment_Method__c,
                "ChargentOrders__Credit_Card_Type__c": data[i].ChargentOrders__Transactions__r[j].ChargentOrders__Credit_Card_Type__c,
                "ChargentOrders__Type__c": data[i].ChargentOrders__Transactions__r[j].ChargentOrders__Type__c,
                "CreatedDate": data[i].ChargentOrders__Transactions__r[j].CreatedDate,
                "oppoId": oppoId,
                "oppoName": oppoName,
                "oppoEmail":oppoEmail,
                "npsp__Honoree_Name__c": OppoHonoree,
              }
              arr.push(obj);
            }
          }

        }
        console.log('JSON arr ', JSON.stringify(arr));
        this.donationHistory = arr;
        for (let i = 0; i < this.donationHistory.length; i++) {
          this.result1 = window.btoa(JSON.stringify(this.donationHistory[i]));
          // let finalUrl = '/PFNCADNA/s/donordashboarddetails' + '?ap=' + this.result1;
          let finalUrl = '/PFNCADNA/s/guestuserdonationdetails' + '?ap=' + this.result1;
          var createddate = this.donationHistory[i].CreatedDate;
          var date = new Date(createddate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
          var obj = {
            Id: this.donationHistory[i].Id,
            oppoId: this.donationHistory[i].oppoId,
            oppoName: this.donationHistory[i].oppoName,
            Amount: Number(this.donationHistory[i].ChargentOrders__Amount__c).toFixed(2),
            CreatedDate: date,
            PaymentMethod: this.donationHistory[i].ChargentOrders__Payment_Method__c,
            Status: this.donationHistory[i].ChargentOrders__Response_Status__c,
            showURL: finalUrl
          }
          this.JSONArray.push(obj);
          console.log('JSON arr ', JSON.stringify(this.JSONArray));
        }
        this.LastDonationAmt = Number(this.donationHistory[0].ChargentOrders__Amount__c).toFixed(2);
        // const originalDate = new Date(date);
        const originalDate = new Date(this.donationHistory[0].CreatedDate);
        this.LastDonationDate = 'on ' + originalDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        this.LastDonationURL = this.JSONArray[0].showURL;
        this.honoreeName = (this.donationHistory[0].npsp__Honoree_Name__c == undefined || this.donationHistory[0].npsp__Honoree_Name__c == null) ? '' : this.donationHistory[0].npsp__Honoree_Name__c;
        if (this.honoreeName != '') {
          this.honorView = true;
        }
        this.tempArr.push(this.JSONArray[0]);
        if (this.JSONArray.length >= 2) {
          this.tempArr.push(this.JSONArray[1]);
        }

        if(this.tempArr.length > 0){
          this.isEmpty = false;
        }else{
          this.isEmpty = true;
        }

        console.log('JSON temarr ', JSON.stringify(this.tempArr));
      }
      catch (error) {
        console.log('errorrrr : ', error, error.message, JSON.stringify(error));
      }
    }
    else if (error) {
      this.error = error;
      console.log('errorr : ', error, error.message, JSON.stringify(error));

    }
  }
  dropDown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown == true) {
      this.tempArr = this.JSONArray;
    }
    else {
      this.tempArr = [];
      this.tempArr.push(this.JSONArray[0]);
      if (this.JSONArray.length >= 2) {
        this.tempArr.push(this.JSONArray[1]);
      }
    }
  }
  async downloadReceiptPDFMethod(event) {
    var oppId = event.target.dataset.id;
    var oppName = event.target.dataset.name;
    console.log('oppName ', oppName);
    console.log('oppId ', oppId);
    let contentID;
    await getOppPDFDocId({ oppId: oppId })
      .then((result) => {
        if (result) {
          console.log('result inner1 : ', result);
          contentID = result;
        }
      })
    // var url = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.lightning.force.com/sfc/servlet.shepherd/version/download/' + contentID + '?operationContext=S1'
    // var url = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.my.salesforce.com/PFNCADNA/sfc/servlet.shepherd/version/download/' + contentID + '?operationContext=S1';
    var url = '/PFNCADNA/sfc/servlet.shepherd/version/download/' + contentID + '?operationContext=S1';
    let downloadElement = document.createElement('a');
    downloadElement.href = url;
    downloadElement.target = '_self';
    downloadElement.download = oppName + '.pdf';
    document.body.appendChild(downloadElement);
    downloadElement.click();
  }
  async downloadAllReceiptMethod() {

    if (this.JSONArray == undefined || this.JSONArray.length == 0 || this.JSONArray == null) {
      this.dispatchEvent(new ShowToastEvent({ title: "You Don't Have Any Donation Record." }));
      return
    }

    console.log('ALL Receipts');
    let contentID;
    await downloadAllReceiptPDF({})
      .then((result) => {
        if (result) {
          console.log('result inner : ', result);
          contentID = result;
        }
      })
      .catch(err => {
        console.log(err);
      })


    console.log('contentID : ', contentID);
    var url = '/PFNCADNA/sfc/servlet.shepherd/version/download/' + contentID + '?operationContext=S1'
    let downloadElement = document.createElement('a');
    downloadElement.href = url;
    downloadElement.target = '_self';
    downloadElement.download = 'All Receipts' + '.pdf';
    document.body.appendChild(downloadElement);
    downloadElement.click();
  }
  handleClickDonationForm() {
    const paymentComp = this.template.querySelector('c-bwps_-Donor-Dashboard-Donate-Form');
    paymentComp.donateClickHandler();
  }

  handleNoDonationDetailClick() {
    this.dispatchEvent(new ShowToastEvent({
      title: "You Don't Have Any Donation Record.",

    }));
  }
}