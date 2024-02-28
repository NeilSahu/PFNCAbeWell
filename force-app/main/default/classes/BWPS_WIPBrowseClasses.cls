public without sharing class BWPS_WIPBrowseClasses {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllInstructors(){
        List<contact> AllInstructorRecords = new List<contact>();
        try {
         Id recordtypeInstructor =  Schema.SObjectType.contact.getRecordTypeInfosByName().get('Instructor Record Type').getRecordTypeId();
         System.debug('RecordtypeInstructor '+recordtypeInstructor);
            AllInstructorRecords = [select Id,Name,BWPS_Type__c from contact WHERE RecordTypeId=:recordtypeInstructor];

            return AllInstructorRecords;
        } catch (Exception e) {
           Return AllInstructorRecords;
        }
    }
    @AuraEnabled
    public static List<Class__c> getAllClasses(){
        List<Class__c> AllClassRecords = new List<Class__c>();
        try {
            
        // AllClassRecords = [SELECT Id,Name, (Select ContentDocumentId, ContentDocument.LatestPublishedVersionId  from contentdocumentlinks where contentdocument.title = 'logo' AND (contentdocument.fileextension='jpg' OR contentdocument.fileextension='jpeg' OR contentdocument.fileextension='png') limit 1),Description__c FROM Class__c];
        AllClassRecords = [SELECT Id, Name, BWPS_Image_Base64code__c,BWPS_Class_Image__c, Description__c FROM Class__c];
             return AllClassRecords;
        } catch (Exception e) {
           Return AllClassRecords;
        }
    }
    @AuraEnabled
    public static List<Schedule_Class__c> getScheduleClassRecords(){
        List<Schedule_Class__c> SchedulableClassRecords = new List<Schedule_Class__c>();
        try {
             SchedulableClassRecords = [SELECT Id,Name,Schedule_Type__c,Integrity__c,BWPS_instructor__c,BWPS_EndTime__c,BWPS_StartTime__c,BWPS_Date__c,Header_Img_URL__c,BWPS_Description__c,Class__r.Id,Class__r.Name,BWPS_instructor__r.Id,BWPS_instructor__r.Name,BWPS_instructor__r.npe01__WorkEmail__c FROM Schedule_Class__c WHERE BWPS_Status__c !='Deactive' Order By BWPS_StartTime__c ASC];
            System.debug('SchedulableClassRecords '+SchedulableClassRecords);
             return SchedulableClassRecords;
        } catch (Exception e) {
           Return SchedulableClassRecords;
        }
    }
    @AuraEnabled
    public static List<Schedule_Class_Line_Item__c> getAllLineItems(){
        List<Schedule_Class_Line_Item__c> lineItemList = new List<Schedule_Class_Line_Item__c>();
        String ConId = [SELECT Id,ContactId FROM User WHERE Id =:UserInfo.getUserId() LIMIT 1].ContactId;
        try {
            lineItemList = [SELECT Id,Name,BWPS_ClassDate__c,Class_Image__c,BWPS_StartTime__c,BWPS_EndTime__c,BWPS_Vimeo_video_Id__c,Video_Duration__c,BWPS_Class_Day__c,LectureVideoId__c,BWPS_Lecture_Link__c,LectureId__c,
                            Schedule_Class__r.Name,Schedule_Class__r.Schedule_Type__c ,Schedule_Class__r.Integrity__c, Schedule_Class__r.BWPS_Description__c, 
                            Schedule_Class__r.Class__c, Schedule_Class__r.Class__r.Name,Schedule_Class__r.BWPS_instructor__c,Schedule_Class__r.BWPS_instructor__r.Name,Schedule_Class__r.BWPS_instructor__r.npe01__WorkEmail__c,
                           (SELECT Id,Name,BWPS_WatchedTimeStamp__c,Class_Status__c,Attendee_Name_del__r.Name FROM Attendees_del__r WHERE Attendee_Name_del__c =:ConId ) 
                            FROM Schedule_Class_Line_Item__c WHERE BWPS_Status__c !='Deactive' AND Schedule_Class__c != null AND BWPS_Vimeo_video_Id__c != null Order By BWPS_StartTime__c ASC];
            System.debug('lineItemList12 : '+lineItemList);
            return lineItemList;
        } catch (Exception e) {
           return lineItemList;
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Schedule_Class_Line_Item__c> getAllFavLineItems(){
        List<Schedule_Class_Line_Item__c> lineItemList = new List<Schedule_Class_Line_Item__c>();
        String ConId = [SELECT Id,ContactId FROM User WHERE Id =:UserInfo.getUserId() LIMIT 1].ContactId;
        List<EntitySubscription> esList = [SELECT Id, parentId, subscriberId FROM EntitySubscription Where subscriberId =: UserInfo.getUserId() LIMIT 1000];
       
        Map<Id,EntitySubscription> entityMap = new Map<Id,EntitySubscription>();
        for(EntitySubscription es : esList){
            entityMap.put(es.parentId, es);
        }
        try {
            lineItemList = [SELECT Id,Name,BWPS_ClassDate__c,Class_Image__c	,BWPS_StartTime__c,BWPS_EndTime__c,BWPS_Vimeo_video_Id__c,Video_Duration__c,BWPS_Class_Day__c,LectureVideoId__c,BWPS_Lecture_Link__c,LectureId__c,
                            Schedule_Class__r.Name,Schedule_Class__r.Schedule_Type__c ,Schedule_Class__r.Integrity__c, Schedule_Class__r.BWPS_Description__c, 
                            Schedule_Class__r.Class__c, Schedule_Class__r.Class__r.Name,Schedule_Class__r.BWPS_instructor__c,Schedule_Class__r.BWPS_instructor__r.Name,Schedule_Class__r.BWPS_instructor__r.npe01__WorkEmail__c,
                           (SELECT Id,Name,BWPS_WatchedTimeStamp__c,Class_Status__c,Attendee_Name_del__r.Name FROM Attendees_del__r WHERE Attendee_Name_del__c =:ConId ) 
                            FROM Schedule_Class_Line_Item__c WHERE BWPS_Status__c !='Deactive' AND Schedule_Class__c != null AND Id IN:entityMap.keySet() Order By BWPS_StartTime__c ASC];
            System.debug('lineItemList888 : '+lineItemList);
            return lineItemList;
        } catch (Exception e) {
           return lineItemList;
        }
    }
     @AuraEnabled
    public static List<Schedule_Class__c> getScheduleLiveClassRecords(){
        List<Schedule_Class__c> SchedulableClassRecords = new List<Schedule_Class__c>();
        try {
             SchedulableClassRecords = [SELECT Id,Name,Header_Img_URL__c,Schedule_Type__c,Integrity__c,BWPS_instructor__c,BWPS_EndTime__c,BWPS_StartTime__c,BWPS_Date__c,BWPS_Description__c,Class__r.Id,Class__r.Name,BWPS_instructor__r.Id,BWPS_instructor__r.Name,BWPS_instructor__r.npe01__WorkEmail__c,(SELECT Id FROM Enrolled_Classes__r) FROM Schedule_Class__c WHERE BWPS_Status__c !='Deactive' AND  (Schedule_Type__c = 'Live' OR Schedule_Type__c = 'Hybrid') Order By BWPS_StartTime__c ASC];
           
             return SchedulableClassRecords;
        } catch (Exception e) {
           Return SchedulableClassRecords;
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<BWPS_Resource__c> getWibResources(){
         List<BWPS_Resource__c> resourcesRec = [SELECT Id,Name,Description__c,BWPS_Link__c,CreatedDate,ResourceSection__c FROM BWPS_Resource__c WHERE Dashboard__c ='Website General' ORDER BY  CreatedDate DESC];
         return resourcesRec;
    }

}