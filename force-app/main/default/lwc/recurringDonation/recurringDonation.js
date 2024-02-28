import { LightningElement, track ,api } from 'lwc';
import BELLICON  from '@salesforce/resourceUrl/Bell_Icon';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent'
export default class RecurringDonation extends LightningElement {


//     BELLICON=BELLICON;   
//     Name;
//     Amount;
//     EstablishedDate;
//     InstallmentPeriod;

//     @track DonationRecords ;
//     @track temp;
    
//      showModal = false;

 

//     handleClick(){
        
//         event. preventDefault();
//         this.Name = this.template.querySelector(`[data-id= 'Fname']`).value;
//         this.Amount = this.template.querySelector(`[data-id= 'Amount']`).value;
//         this.EstablishedDate = this.template.querySelector(`[data-id= 'EstablishedDate']`).value;
//         this.InstallmentPeriod = this.template.querySelector(`[data-id= 'InstallmentPeriod']`).value;
    
//         //  let mapData=new Map();
//         //  mapData.set("Name",this.Name);
//         //  mapData.set("Amount",this.Amount);
//          this.temp={
//              "RecurringData":{
//                  "Name":this.Name,
//              "Amount":this.Amount,
//              "InstallmentPeriod": this.InstallmentPeriod,
//              "EstablishedDate":this.EstablishedDate
//              }
             
//          }

//         console.log("MapData11 "+ this.temp);
//         console.log("DonationMap 11111",JSON.stringify(this.temp));

//         RecurringDonationRec({DonationMap:this.temp}) //DonationMap:this.temp
						
// 		.then(result => {
//                 this.DonationRecords = result;
//                 console.log("output");
//                 console.log(this.DonationRecords);
//             })
//             .catch(error => {
//                 this.error = error;
//                 console.log('error',this.error)
//             });


//             const custEvent = new CustomEvent(
//             'callpasstoparent', {
//                 detail: 'false'
//             });
//             this.dispatchEvent(custEvent);
      
//     }

// }


    @track type;
    @track message;
    @track showToastBar = false;
    @api autoCloseTime = 5000;
 
    @api
    showToast(type, message) {
        this.type = type;
        this.message = message;
        this.showToastBar = true;
        setTimeout(() => {
            this.closeModel();
        }, this.autoCloseTime);
    }
 
    closeModel() {
        this.showToastBar = false;
        this.type = '';
        this.message = '';
 }
 
    get getIconName() {
        return 'utility:' + this.type;
    }
 
    get innerClass() {
        return 'slds-icon_container slds-icon-utility-' + this.type + ' slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top';
    }
 
    get outerClass() {
        return 'slds-notify slds-notify_toast slds-theme_' + this.type;
    }
}