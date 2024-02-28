trigger ChargentOrderRecurring on ChargentOrders__ChargentOrder__c (After insert) {
    /*if(Trigger.isAfter && Trigger.isInsert){
         System.debug('inside trigger before ');
        BWPS_ChargentOrderUpdate.ChargentRecurringUpdate(Trigger.newMap);
         System.debug('inside trigger after ');
    }*/
}