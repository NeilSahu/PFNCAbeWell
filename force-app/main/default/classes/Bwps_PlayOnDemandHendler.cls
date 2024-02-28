public class Bwps_PlayOnDemandHendler {
    @AuraEnabled
    public static String createGetAttendee(String lineItemId){
        try{
        string contactId = [SELECT Id,ContactId FROM User Where Id=:UserInfo.getUserId() Limit 1].ContactId;
        //check alredy enroled or not 
           List<Attendee__c> attendeeRec = [SELECT Id FROM Attendee__c WHERE Attendee_Name_del__c =:contactId AND Schedule_Class_Line_Item_del__c =:lineItemId];
            if(attendeeRec.size() > 0){
              return   attendeeRec[0].Id;
            } else {
                 Attendee__c attendee = new Attendee__c();
                 attendee.Attendee_Name_del__c =contactId;
                 attendee.Schedule_Class_Line_Item_del__c =lineItemId;
                 attendee.Is_Present__c ='Present';
                 attendee.Class_Status__c = 'PLAY ON-DEMAND';
                 Insert attendee;
                 return   attendee.Id;
            }
        } catch( Exception e){
            System.debug('Error>>> '+ e.getMessage()+ ' line>>'+ e.getLineNumber() + ' '+ e.getStackTraceString());
            return e.getMessage();
        }
    }
}