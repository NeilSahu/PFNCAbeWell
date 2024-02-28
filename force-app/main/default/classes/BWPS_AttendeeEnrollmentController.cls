public class BWPS_AttendeeEnrollmentController {
    
    
    /*
enrollUser()
this method will be used for enrolling user to scheduleClass 
*/
    @AuraEnabled
    public static String enrollUser (String scheduleLineItemId){
        
        Schedule_Class_Line_Item__c scLineItem = [SELECT Id, Schedule_Class__c FROM Schedule_Class_Line_Item__c WHERE Id = :scheduleLineItemId LIMIT 1];
        
        Id schedule_class_id = scLineItem.Schedule_Class__c;
        
        User currentUser = [SELECT Id, ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        
        Id contactId = currentUser.ContactId;
        
        List<Enrolled_Class__c> enrolled_class = [SELECT Id, Attendee__c, Schedule_Class__c FROM Enrolled_Class__c WHERE Attendee__c = :contactId AND Schedule_Class__c = :schedule_class_id LIMIT 1];
        
        if( enrolled_class.size() == 1 ){
            return 'USER IS ALREADY ENROLLED IN THIS CLASS';
        }
        
        Enrolled_Class__c newEnrolled_class = new Enrolled_Class__c();
        
        newEnrolled_class.Attendee__c = contactId;
        
        newEnrolled_class.Schedule_Class__c = schedule_class_id;
        
        try{
            insert newEnrolled_class;
            
            return newEnrolled_class.Id;
            
        }
        catch(exception e){
            
            return null;
        }
        
        
    }

    @AuraEnabled
    public static String enrollUserByScheduleClass (String schedulClassId){
        
        // Schedule_Class_Line_Item__c scLineItem = [SELECT Id, Schedule_Class__c FROM Schedule_Class_Line_Item__c WHERE Id = :scheduleLineItemId LIMIT 1];
        
        // Id schedule_class_id = scLineItem.Schedule_Class__c;

        Id schedule_class_id = schedulClassId;
        
        User currentUser = [SELECT Id, ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        
        Id contactId = currentUser.ContactId;
        
        List<Enrolled_Class__c> enrolled_class = [SELECT Id FROM Enrolled_Class__c WHERE Attendee__c = :contactId AND Schedule_Class__c = :schedule_class_id LIMIT 1];
        
        if( enrolled_class.size() == 1 ){
            return 'USER IS ALREADY ENROLLED IN THIS CLASS';
        }
        
        Enrolled_Class__c newEnrolled_class = new Enrolled_Class__c();
        
        newEnrolled_class.Attendee__c = contactId;
        
        newEnrolled_class.Schedule_Class__c = schedule_class_id;
        
        try{
            insert newEnrolled_class;
            
            //return newEnrolled_class.Id;
            String message = '';
            if(newEnrolled_class.Id != null){
                message = 'YOU ENROLLED IN THIS CLASS';
            }
            return message;

            
        }
        catch(exception e){
            
            return null;
        }
        
        
    }
}