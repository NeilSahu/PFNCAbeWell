import { LightningElement,track } from 'lwc';
import {ShowToastEvent} from "lightning/platformShowToastEvent";

export default class Callpayment extends LightningElement {
  flowcall = false;
    @track OppId  ='0063C00000JqTWUQA3';
 flowApiName = "PaymentAccept";
     flowInputVariables = [
		{
			name: "recordId",
			type: "String",
			value: '0063C00000JqTWUQA3',
		},
	];
    handleFlowStatusChange(event) {
		// console.logstatus("flow status", event.detail.status);
		// if (event.detail.status === "FINISHED") {
		// 	this.dispatchEvent(
		// 		new ShowToastEvent({
		// 			title: "Success",
		// 			message: "Flow Finished Successfully",
		// 			variant: "success",
		// 		})
		// 	);
		// }
	}
    butnhand(){
        this.flowcall = true;
    }
}