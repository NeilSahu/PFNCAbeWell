/****
Author @cyntexa
Name : BWPS_GuestMemberEvents
Decsription : This class manage all events and events activities on my schedule component that is use to display/add/delete events 
               for Guest member user.
Created by: Himanshu Yadav 
***/

public class BWPS_GuestMemberEvents {
/*********This method use to return all current end user events ********/
    @AuraEnabled(cacheable=true)
    public static List<Schedule_Class_Line_Item__c> guestEvents(Integer monthOfData , Integer yearOfData){
        String ContactId = [SELECT Id,ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
        System.debug('monthOfData>>>>'+monthOfData);
        System.debug('yearOfData>>> '+yearOfData);
        Time startTime = Time.newInstance(7, 0, 0, 0);
        Time endTime = Time.newInstance(20, 0, 0,0);
        List<Attendee__c>  enroledEvents = [SELECT Id, Name, Attendee_Name_del__c ,Class_Status__c,Is_Present__c,Schedule_Class_Line_Item_del__c
                                            FROM Attendee__c WHERE BWPS_Is_Enrolled__c = true AND Attendee_Name_del__c =:ContactId];
        List<String> events = new List<String>();
        for(Attendee__c attendanceRec :enroledEvents){
            events.add(attendanceRec.Schedule_Class_Line_Item_del__c);
        }
        List<Schedule_Class_Line_Item__c> eventList = [SELECT Id,Name,BWPS_EndTime__c,BWPS_Vimeo_video_Id__c,LectureId__c,BWPS_Integrity__c,Schedule_Class__c,BWPS_StartTime__c,BWPS_Status__c,Schedule_Class__r.BWPS_Description__c,
                                                     Schedule_Class__r.BWPS_instructor__r.Name,BWPS_ClassDate__c,BWPS_ClassDay__c,(SELECT Id,Name,BWPS_WatchedTimeStamp__c,Class_Status__c,Attendee_Name_del__r.Name FROM Attendees_del__r WHERE Attendee_Name_del__c =:ContactId ) 
                                                     FROM Schedule_Class_Line_Item__c WHERE Id IN: events AND CALENDAR_YEAR(BWPS_ClassDate__c)=:yearOfData AND CALENDAR_MONTH(BWPS_ClassDate__c)=:monthOfData AND
                                                     BWPS_StartTime__c >= :startTime AND BWPS_StartTime__c <= :endTime ];
        return eventList;
    }
 /*************************** This method use to return event between perticular date of current guest member user ******************************/
    @AuraEnabled(cacheable=true)
    public static List<Schedule_Class_Line_Item__c> guestEventsDateBetween(String satrtDate ,String endDate){
        String ContactId = [SELECT Id,ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
        System.debug('satrtDate>>>>'+satrtDate);
        System.debug('endDate>>> '+endDate);
        Date dateStart = Date.valueOf(satrtDate);
        Date dateEnd  = Date.valueOf(endDate);
        Time startTime = Time.newInstance(7, 0, 0, 0);
        Time endTime = Time.newInstance(20, 0, 0,0);
        List<Attendee__c>  enroledEvents = [SELECT Id, Name, Attendee_Name_del__c ,Class_Status__c,Is_Present__c,Schedule_Class_Line_Item_del__c
                                            FROM Attendee__c WHERE BWPS_Is_Enrolled__c = true AND Attendee_Name_del__c =:ContactId];
        List<String> events = new List<String>();
        for(Attendee__c attendanceRec :enroledEvents){
            events.add(attendanceRec.Schedule_Class_Line_Item_del__c);
        }
        if(dateStart == dateEnd){
        List<Schedule_Class_Line_Item__c> eventList = [SELECT Id,Name,BWPS_EndTime__c,BWPS_Vimeo_video_Id__c,LectureId__c,BWPS_Integrity__c,Schedule_Class__c,BWPS_StartTime__c,BWPS_Status__c,Schedule_Class__r.BWPS_Description__c,
                                                   Schedule_Class__r.BWPS_instructor__r.Name,BWPS_ClassDate__c,BWPS_ClassDay__c,(SELECT Id,Name,BWPS_WatchedTimeStamp__c,Class_Status__c,Attendee_Name_del__r.Name FROM Attendees_del__r WHERE Attendee_Name_del__c =:ContactId ) 
                                                   FROM Schedule_Class_Line_Item__c WHERE Id IN: events AND BWPS_ClassDate__c >= :dateStart AND BWPS_ClassDate__c <= :dateEnd AND BWPS_StartTime__c >= :startTime AND
                                                   BWPS_StartTime__c <= :endTime  order by BWPS_StartTime__c ASC];
        return eventList;
        } else {
              List<Schedule_Class_Line_Item__c> eventList = [SELECT Id,Name,BWPS_EndTime__c,BWPS_Vimeo_video_Id__c,LectureId__c,BWPS_Integrity__c,Schedule_Class__c,BWPS_StartTime__c,BWPS_Status__c,Schedule_Class__r.BWPS_Description__c,
                                                   Schedule_Class__r.BWPS_instructor__r.Name,BWPS_ClassDate__c,BWPS_ClassDay__c,(SELECT Id,Name,BWPS_WatchedTimeStamp__c,Class_Status__c,Attendee_Name_del__r.Name FROM Attendees_del__r WHERE Attendee_Name_del__c =:ContactId ) 
                                                   FROM Schedule_Class_Line_Item__c WHERE Id IN: events AND BWPS_ClassDate__c >= :dateStart AND BWPS_ClassDate__c <= :dateEnd AND BWPS_StartTime__c >= :startTime AND
                                                   BWPS_StartTime__c <= :endTime  order by BWPS_ClassDate__c ASC];
        return eventList;
        }
    }
    
    /****************************************This method remove class from user calendar************************************************/
    @AuraEnabled
    public static String removeClassFromCalendar(List<String> clsIds){
        try{
            System.debug('RemoveClassIDS >> '+clsIds);
            String ContactId = [SELECT Id,ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
            // attendee record for perticular schedule line item 
            List<Attendee__c> attendingRecords = [SELECT Id,Schedule_Class_Line_Item_del__c,BWPS_Is_Enrolled__c FROM Attendee__c WHERE Schedule_Class_Line_Item_del__c IN:clsIds
                                                 AND Attendee_Name_del__c =:ContactId];
            System.debug('attendingRecords >> '+attendingRecords);
            for(Attendee__c attendanceRec :attendingRecords){
                attendanceRec.BWPS_Is_Enrolled__c = false;
            }
            DataBase.update(attendingRecords,true);
            return 'Success';
        }catch(Exception e){
            return String.valueOf(e.getMessage());
        }
       
   }
   /*************************************This methode use to return Schedule class Data****************************************/
    @AuraEnabled
    public static Schedule_Class__c getScheduleClass(String recordId){
        try{
            return [Select Id,Name,BWPS_ClassDuration__c,BWPS_ClassFrequency__c,BWPS_instructor__r.Name,Schedule_Days__c,BWPS_Date__c,
                    BWPS_StartTime__c,BWPS_Status__c,BWPS_EndTime__c FROM Schedule_Class__c WHERE Id =: recordId Limit 1];
        } catch (Exception e){
            return null;
        }
    }
      @AuraEnabled
    public static String enrolledA_Class(String recordId){
        String returnString='';
        try{
             String contactId = [SELECT Id,ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
           List<Enrolled_Class__c> alredyEnroled = [ SELECT Id From Enrolled_Class__c WHERE Attendee__c =:contactId AND 
                                               Schedule_Class__c =:recordId Limit 1];
            if(alredyEnroled.size() > 0){
                returnString = 'Already enroled in this class.';
            } else if(recordId != null && recordId != ''){
              Enrolled_Class__c enrolledClass = new Enrolled_Class__c();
              enrolledClass.Schedule_Class__c =recordId;
              enrolledClass.Attendee__c =ContactId;
              Database.insert(enrolledClass,true);
              returnString = 'Success';
          }
        } catch(Exception e){
         returnString = 'Failed'+String.valueOf(e.getMessage());  
        }
        return returnString;
    }
}