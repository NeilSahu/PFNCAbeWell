public without sharing class BWPS_getInstructorsData {

    @AuraEnabled(cacheable=true)
    public static List<user> getAllInstructorsData(){
        List<user> scheduleclassInstructors = New List<user>();
        try {
            scheduleclassInstructors =[SELECT Id, Name, IsActive, SmallPhotoUrl,FullPhotoUrl ,MediumPhotoUrl,ContactId,Contact.Name, Contact.BWPS_Type__c, Contact.BWPS_publicProfileLink__c,profile.name FROM User WHERE Profile.name ='Instructor' and IsPortalEnabled = true AND IsActive  = true]; 
            return scheduleclassInstructors;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Schedule_Class__c> getIsntructorandClasses(Id InstructorId){
        list<Schedule_Class__c> ScheduleClassDetails = new list<Schedule_Class__c>();
        try {
            ScheduleClassDetails = [SELECT Id,Name,Schedule_Type__c,BWPS_Status__c,BWPS_StartTime__c, BWPS_EndTime__c , BWPS_Date__c,RecordTypeId ,Integrity__c,BWPS_instructor__c,BWPS_Description__c,(SELECT Id,Name From Enrolled_Classes__r) FROM Schedule_Class__c WHERE BWPS_Status__c ='Active' AND BWPS_instructor__c =:InstructorId];
            return ScheduleClassDetails;
        } catch (Exception e) { return ScheduleClassDetails; }
    }

    @AuraEnabled
    public static user GetuserProfile(Id InstructorId){
        user getProfilePhoto = New user(); 
        try {
            getProfilePhoto = [SELECT ID, ContactId, Contact.Firstname, ProfileId, SmallPhotoUrl,FullPhotoUrl,MediumPhotoUrl,Profile.Name FROM User WHERE ContactID = :InstructorId ];
            return getProfilePhoto;
        } catch (Exception e) {
            return getProfilePhoto;
        }
    }
}