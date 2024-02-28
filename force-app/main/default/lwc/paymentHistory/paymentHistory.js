import { LightningElement, track, wire, api } from 'lwc';
import myResource from '@salesforce/resourceUrl/Bell_Icon';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOppPDFDocId from '@salesforce/apex/DNA_GuestUserClass.getOppPDFDocId';
import getAllPaymentRecords from '@salesforce/apex/DNA_GuestUserClass.getAllPaymentRecords';
import BWPS_DonationHistoryMethod from '@salesforce/apex/BWPS_DonationHistoryClass.BWPS_DonationHistoryMethod';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import createTransactionReceipt from '@salesforce/apex/transactionReceiptController.createTransactionReceipt';
export default class PaymentHistory extends LightningElement {
    @track bellIcon = myResource;
    number = 3;
    json = [];
    @track paymentTotalRecordsArray = [];
    @track visiblePaymentRecords = [];
    @track notrecords = [];
    @track notificationVisibel = [];
    @track totalNotifications = 0;
    @track donationHistory = [];
    @track JSONArray = [];
    @track tempArr = [];
    @track isEmpty = true;
    @track loading = false;

    downloadIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='Download' width='16' height='16' viewBox='0 0 16 16'%3E%3Crect id='Bounding_Box' data-name='Bounding Box' width='16' height='16' fill='none'/%3E%3Cg id='Download_Icon' data-name='Download Icon' transform='translate(-562 -2324.999)'%3E%3Cg id='noun_Download_file_598283' data-name='noun_Download file_598283' transform='translate(565 2325)'%3E%3Cpath id='Path_10926' data-name='Path 10926' d='M12.931,19.317a.385.385,0,0,1-.273-.113l-1.545-1.545a.386.386,0,0,1,.546-.546l1.272,1.272L14.2,17.113a.386.386,0,0,1,.546.546L13.2,19.2A.385.385,0,0,1,12.931,19.317Z' transform='translate(-7.098 -9.127)' fill='%23008ba7'/%3E%3Cpath id='Path_10927' data-name='Path 10927' d='M15.386,15.634A.386.386,0,0,1,15,15.248V11.386a.386.386,0,0,1,.772,0v3.862A.386.386,0,0,1,15.386,15.634Z' transform='translate(-9.553 -5.652)' fill='%23008ba7'/%3E%3Cpath id='Path_10928' data-name='Path 10928' d='M15.529,25.772H9.5A.4.4,0,1,1,9.5,25h6.027a.4.4,0,1,1,0,.772Z' transform='translate(-6.683 -13.679)' fill='%23008ba7'/%3E%3Cpath id='Path_10929' data-name='Path 10929' d='M13.515,14.357H4.152A1.139,1.139,0,0,1,3,13.234V4.017A1.494,1.494,0,0,1,3.434,2.97L5.969.434A1.471,1.471,0,0,1,7.017,0h6.5a1.138,1.138,0,0,1,1.151,1.122V13.235A1.138,1.138,0,0,1,13.515,14.357ZM7.017.9a.58.58,0,0,0-.413.171L4.068,3.6a.589.589,0,0,0-.171.413v9.217a.242.242,0,0,0,.255.226h9.362a.241.241,0,0,0,.254-.225V1.122A.241.241,0,0,0,13.514.9Z' transform='translate(-3 0)' fill='%23008ba7'/%3E%3Cpath id='Path_10930' data-name='Path 10930' d='M7.738,5.7H6.386a.386.386,0,1,1,0-.772H7.738a.193.193,0,0,0,.193-.193V3.386a.386.386,0,0,1,.772,0V4.738A.967.967,0,0,1,7.738,5.7Z' transform='translate(-4.841 -1.841)' fill='%23008ba7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

    @wire(fetchNotification)
    wiredData({ data, error }) {
        if (data != null && data != '' && data != undefined) {
            var notificationData = JSON.parse(JSON.parse(data));
            var firstLoop = true;
            for (let i = 0; i < notificationData.notifications.length; i++) {
                var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
                var todayDate = new Date();
                var timeinMilliSec = todayDate - nottificationdate + 'ago';
                if (notificationData.notifications[i].read == false) {
                    this.totalNotifications += 1;
                }
                var obj = {
                    id: notificationData.notifications[i].id,
                    Name: 'Kirsten Bodensteiner',
                    image: notificationData.notifications[i].image,
                    Active__c: timeinMilliSec,
                    Message__c: notificationData.notifications[i].messageBody,
                }
                this.notrecords.push(obj);
                if (firstLoop) {
                    this.notificationVisibel.push(obj);
                    firstLoop = false;
                }
            }
        } else {
            console.log('errorfghgg>>> ', JSON.stringify(error));
        }
    }
    selItem;
    @track showNotificationFlag = false;
    showNotificationMethod() {
        this.showNotificationFlag = !this.showNotificationFlag;
    }
    @wire(BWPS_DonationHistoryMethod)
    wireddonationhistory({ data, error }) {
        if (data) {
            console.log('data. ==== Neha check ', JSON.stringify(data));
            console.log('size ', data.length);
            var arr = [];
            var obj = {};

            for (let i = 0; i < data.length; i++) {
                var oppoId;
                var oppoName;
                var OppoHonoree;
                if (data[i].hasOwnProperty('Opportunities__r')) {
                    oppoId = data[i].Opportunities__r[0].Id;
                    oppoName = data[i].Opportunities__r[0].Name;
                    OppoHonoree = data[i].Opportunities__r[0].npsp__Honoree_Name__c;

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
                            "CardLastDigits": "Visa ending in " + data[i].ChargentOrders__Transactions__r[j].ChargentOrders__Card_Last_4__c,
                            "oppoId": oppoId,
                            "oppoName": oppoName,
                            "npsp__Honoree_Name__c": OppoHonoree,
                        }
                        arr.push(obj);
                    }
                }

            }
            this.donationHistory = arr;
            for (let i = 0; i < this.donationHistory.length; i++) {
                var createddate = this.donationHistory[i].CreatedDate;
                var date = new Date(createddate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                var obj = {
                    Id: this.donationHistory[i].Id,
                    Name: this.donationHistory[i].Name,
                    oppoId: this.donationHistory[i].oppoId,
                    oppoName: this.donationHistory[i].oppoName,
                    Amount: Number(this.donationHistory[i].ChargentOrders__Amount__c).toFixed(2),
                    Date: date,
                    CardLastDigits: this.donationHistory[i].CardLastDigits,
                    PaymentMethod: this.donationHistory[i].ChargentOrders__Payment_Method__c,
                    Status: this.donationHistory[i].ChargentOrders__Response_Status__c,
                }
                this.JSONArray.push(obj);
            }
            this.tempArr = this.JSONArray;
            if (this.tempArr.length > 0) {
                this.isEmpty = false;
            }
        }
        else if (error) {
            this.error = error;

        }
    }

    updateVisiblePaymentRecordArray(event) {
        let curSearchValue = event.target.value;
        this.tempArr = [];
        if (curSearchValue != '' && curSearchValue != undefined && curSearchValue != null) {
            this.JSONArray.forEach(i => {

                if (i.Status.toLowerCase().includes(curSearchValue.toLowerCase()) || i.PaymentMethod.toLowerCase().includes(curSearchValue.toLowerCase()) || i.Amount.toLowerCase().includes(curSearchValue.toLowerCase()) || i.Date.toLowerCase().includes(curSearchValue.toLowerCase())) {
                    this.tempArr.push(i);
                }
            });
        } else {
            this.tempArr = this.JSONArray;
        }
    }
    fetchError;

    downloadWavierPdfMethod(event) {
        console.log(event.target.dataset.id);
        let receiptId = event.target.dataset.name;
        createTransactionReceipt({ transactionId: event.target.dataset.id, receiptId: event.target.dataset.name, amountPaid: event.target.dataset.amount, paidDate: event.target.dataset.date, paymentMethod: event.target.dataset.paymentmethod, paymentStatus: event.target.dataset.status }).then(result => {
            console.log(result);
            let contentURL = result;
            let downloadElement = document.createElement('a');
            downloadElement.href = contentURL;
            downloadElement.target = '_self';
            downloadElement.download = 'Receipt-' + receiptId + '.pdf';
            document.body.appendChild(downloadElement);
            downloadElement.click();
        }).catch(error => {
            console.log(error);
        })
    }

    // async downloadWavierPdfMethod(event) {
    //     // this.loading = true;
    //     console.log('@downloadWaiverPdfMethod : ');
    //     let oppId = event.target.dataset.id;
    //     let contentID = '';

    //     await getOppPDFDocId({ oppId: oppId })
    //         .then((result) => {
    //             if (result) {
    //                 // console.log('result inner : ',result);
    //                 contentID = result;
    //             }
    //         })
    //         .catch(error => {
    //             // console.log('error : ',error);
    //             this.fetchError = error;
    //         })
    //     // console.log('error : ',this.fetchError);
    //     //contentID = '0683C000001fdkaQAA';
    //     if (contentID != '') {
    //         console.log('contentID : ', contentID);
    //         // var url = 'https://parkinsonfoundationofthenationalca--pfncadna.sandbox.my.salesforce.com/sfc/servlet.shepherd/version/download/'+contentID+'?operationContext=S1'
    //         //var url = 'https://https://parkinsonfoundationofthenationalca--pfncadna.sandbox.lightning.force.com/sfc/servlet.shepherd/document/download/'+contentID
    //         //var element = 'data:text/csv;charset=utf-8,%EF%BB%BF,' + encodeURIComponent(StringCSV);

    //         var url = '/PFNCADNA/sfc/servlet.shepherd/version/download/' + contentID + '?operationContext=S1';

    //         let downloadElement = document.createElement('a');
    //         downloadElement.href = url;
    //         downloadElement.target = '_self';
    //         downloadElement.download = 'WaiverAndRules.pdf';
    //         document.body.appendChild(downloadElement);
    //         downloadElement.click();
    //     }
    //     else if (this.fetchError) {
    //         // console.log("errorerrorerrorerror");
    //         const evt = new ShowToastEvent({
    //             title: "An error occured",
    //             message: this.fetchError.body.message,
    //             variant: 'error',
    //         });
    //         this.dispatchEvent(evt);

    //         this.fetchError = undefined;
    //     }
    // }
}