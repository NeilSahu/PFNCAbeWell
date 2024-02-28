public with sharing class BWPS_InstructorNotes {
    @AuraEnabled
    public static list<Contact> InstructorNotes(){
               List<Contact> contactNotes = new List<Contact>();
            Id recordtypeInstructor =  Schema.SObjectType.contact.getRecordTypeInfosByName().get('Instructor Record Type').getRecordTypeId();
        if(recordtypeInstructor != null){
            System.debug('RecordtypeInstructor '+recordtypeInstructor);
               contactNotes = [SELECT Id ,Name FROM Contact WHERE  RecordTypeId=:recordtypeInstructor];
               System.debug('contactNotes ' +contactNotes);
               return contactNotes;
        }else{
            return contactNotes;
        }
    }
    
}