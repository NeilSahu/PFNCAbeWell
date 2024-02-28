trigger ScheduleClassTrigger on Schedule_Class__c (After insert,After Update) {
    List<Schedule_Class__c> OneTimeClassRecords = New List<Schedule_Class__c>();
    List<Schedule_Class__c> RecurringClassRecords = NEW lIST<Schedule_Class__c>();
    String objectName = 'Schedule_Class__c';
    String RecordTypeRecurring =  Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get(BWPS_Constants.RecurringDonationRecordType).getRecordTypeId();
    String RecordTypeOneTime =  Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get(BWPS_Constants.OneTimeDonationRecordType).getRecordTypeId();
    System.debug('RecordTypeOneTime '+RecordTypeOneTime);
    System.debug('RecordTypeRecurring '+RecordTypeRecurring);
    If(Trigger.IsInsert && Trigger.isAfter){
        For(Schedule_Class__c SchClass:Trigger.New){
            If( SchClass.RecordTypeId == RecordTypeRecurring){
                RecurringClassRecords.add(SchClass);
            }
            else if(SchClass.RecordTypeId == RecordTypeOneTime){
                OneTimeClassRecords.add(SchClass);
            }
        }
        System.debug('RecurringClassRecords '+RecurringClassRecords);
        If(RecurringClassRecords.size()>0){
            System.debug('RecurringClassRecords '+RecurringClassRecords);
           BWPS_ScheduleClassHelperClass.CreateScheduleClassLineItem(RecurringClassRecords); 
        }
        System.debug('OneTimeClassRecords '+OneTimeClassRecords);
        if(OneTimeClassRecords.size()>0){
            System.debug('OneTimeClassRecords '+OneTimeClassRecords);
            BWPS_ScheduleClassHelperClass.CreateOneTimeScheduleLineItem(OneTimeClassRecords);
        }
    }
    If(Trigger.isUpdate && Trigger.isAfter){
        System.debug('Trigger.NewMap '+Trigger.NewMap);
        System.debug('Trigger.OldMap '+Trigger.OldMap);
        BWPS_ScheduleClassHelperClass.UpdateScheduleLineItems(Trigger.NewMap,Trigger.OldMap);
    }
}