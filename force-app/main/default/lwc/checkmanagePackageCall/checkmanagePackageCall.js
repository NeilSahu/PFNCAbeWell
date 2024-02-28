import { LightningElement,track } from 'lwc';

export default class CheckmanagePackageCall extends LightningElement {

    showComponent = false ;
   @track OppRecordId ='0063C00000Jqq6RQAR';
   @track AmountField = 'Amount';
   @track chargentOrderField = 'BWPS_Chargent_Order__c';
   @track chargentContactIdField = 'npsp__Primary_Contact__c';
   @track gatewayId  = 'a173C000002vIIvQAM';

    buttonClickhandle(){
        this.showComponent = true; 
    }
}