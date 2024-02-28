trigger PyamentHistoryPdfTrigger on npe01__OppPayment__c (after insert) {
	if (Trigger.isAfter && Trigger.isInsert) {
        for(npe01__OppPayment__c op : Trigger.new){
			//GeneratePDFController.PaymentHistoryPdf(op.Id);
        }
    }
}