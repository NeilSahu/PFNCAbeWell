trigger GeneratePDFTrigger on Opportunity (After insert,After Update) {
    if (Trigger.isAfter && Trigger.isInsert) {
        for(Opportunity op : Trigger.new){
			//GeneratePDFController.Save(op.Id);
            GeneratePDFController.Save(op.Id);
        }
        //GeneratePDFController.Save(Trigger.new);
    }
    if(Trigger.isAfter && Trigger.isUpdate){
        System.debug('inside trigger before ');
        BWPS_ChargentOrderUpdate.ChargentRecurringUpdate(Trigger.newMap);
         System.debug('inside trigger after ');
    }
}