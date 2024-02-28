trigger BWPS_EnrolledTrigger on Enrolled_Class__c (After insert) {
    if(Trigger.isAfter && Trigger.isInsert){
        BWPS_EnrolledClassHelper.CreateAttendeesForEnrolled(Trigger.newMap);
    }

}