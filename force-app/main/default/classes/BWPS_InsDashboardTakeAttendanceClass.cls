public class BWPS_InsDashboardTakeAttendanceClass {
     public static String GuestUserId =  Schema.SObjectType.Contact.getRecordTypeInfosByName().get(BWPS_Constants.BWPS_guestUserRecordType).getRecordTypeId();
    public static String ClientId =  Schema.SObjectType.Contact.getRecordTypeInfosByName().get(BWPS_Constants.BWPS_clientRecordType).getRecordTypeId();

    @AuraEnabled(cacheable=true)
    public static List<sObject> BWPS_GetUser(String schlnId,String schdate ){
       List<Schedule_Class_Line_Item__c> schLineItem= [SELECT Schedule_Class__c,Schedule_Class__r.Name FROM Schedule_Class_Line_Item__c
                                                         WHERE Id=:schlnId];
            Id schId =  schLineItem[0].Schedule_Class__c; 
            System.debug('SchId'+schId);
            System.debug('schdate'+schdate);
            System.debug('mydate'+date.valueOf(schdate));
           
            List<Schedule_Class_Line_Item__c> schClassRec=[SELECT Id,Name,BWPS_ClassDate__c,BWPS_StartTime__c FROM Schedule_Class_Line_Item__c 
                                                       WHERE Schedule_Class__c=:schId AND BWPS_ClassDate__c=:date.valueOf(schdate)  ];
                                                       
            String scheduleLineItemId =schClassRec[0].Id;
            System.debug('schlnId'+scheduleLineItemId);
         List<Attendee__c> AttendRec= [SELECT Id, Attendee_Name_del__r.Name, Is_Present__c FROM Attendee__c WHERE  Schedule_Class_Line_Item_del__c=:scheduleLineItemId AND BWPS_Is_Enrolled__c = true ORDER BY Attendee_Name_del__r.Name];      
         return AttendRec;      
    }
    @AuraEnabled
    public static String  BWPS_GetAttendance(String attendeeData ){
        try{
            //System.debug('AttendeeData>>>>>>'+AttendeeData);
            List<String> attendiesId = new List<String>();
            BWPS_attendeeRequest requestData = BWPS_attendeeRequest.parse(AttendeeData);
            System.debug(AttendeeData);
            System.debug(requestData);
            for(BWPS_attendeeRequest.Attendee req:requestData.request){
                attendiesId.add(req.Attendeeid);
            }System.debug('attendiesId Id>>>'+attendiesId);
           Map<String,Attendee__c> attendeeAttendance=new  Map<String,Attendee__c> ([SELECT Id,Attendee_Name_del__c,Schedule_Class_Line_Item_del__c,Is_Present__c
                                                                             FROM Attendee__c WHERE Id IN:attendiesId  ]); 
            for(BWPS_attendeeRequest.Attendee req:requestData.request){
                attendeeAttendance.get(req.Attendeeid).Is_Present__c = req.attendance;
            }       
            update attendeeAttendance.values();
            return 'success';
        } catch(Exception e){
            system.debug('EEEE>>'+e.getMessage());
            return 'fail'+ e.getMessage();
        }
    }
     @AuraEnabled
    public static List<Contact> BWPS_GetFilterUsers(String input , List<String> availableIds){
        System.debug('availableIds'+ availableIds);
        String nameInput = input + '%' ;
         List<Contact> getFilterUsers= [SELECT Id,Name FROM Contact WHERE  Id NOT IN:availableIds AND Name LIKE: nameInput AND (RecordTypeId=:GuestUserId OR RecordTypeId=:ClientId) ORDER by Name];
         System.debug('Filter' + getFilterUsers);
        return getFilterUsers;
    }
   @AuraEnabled
    public static List<Attendee__c> BWPS_GetAttendeeFromCon(String schlnId,String schdate,String JSONConId ){
         List<Schedule_Class_Line_Item__c> schLineItem= [SELECT Schedule_Class__c FROM Schedule_Class_Line_Item__c
                                                         WHERE Id=:schlnId];
            Id schId =  schLineItem[0].Schedule_Class__c; 
            System.debug('SchId'+schId);
            System.debug('schdate'+schdate);
            System.debug('mydate'+date.valueOf(schdate));
           set<Id> attendeeids = new set<Id>();
           List<Object> fieldList = (List<Object>)JSON.deserializeUntyped(JSONConId);
        
            for(Object fld : fieldList){    
                Map<String,Object> data = (Map<String,Object>)fld;
                system.debug(data.get('field'));
                attendeeids.add(String.valueOf(data.get('Id')));
            }
           System.debug('msg '+attendeeids);
            List<Schedule_Class_Line_Item__c> schClassRec=[SELECT Id FROM Schedule_Class_Line_Item__c 
                                                        WHERE Schedule_Class__c=:schId AND BWPS_ClassDate__c=:date.valueOf(schdate) ];
            String scheduleLineItemId =schClassRec[0].Id;
            System.debug('schlnId'+scheduleLineItemId);
            List<Attendee__c> getConAttendee= new List<Attendee__c>();
            for(Id conId : attendeeids){
                Attendee__c a = new Attendee__c();
                a.Attendee_Name_del__c = conId;
                a.Schedule_Class_Line_Item_del__c = schClassRec[0].Id;
                getConAttendee.add(a);
            }
        upsert getConAttendee;
        return getConAttendee;
    }
     @AuraEnabled
    public static List<Attendee__c> BWPS_GetAttendeeName( String[] submitIdArr){
        Set<String> sStrings = new Set<String>(submitIdArr);
        List<Attendee__c> getAllUsers= [SELECT Id, Attendee_Name_del__r.Name, Is_Present__c FROM Attendee__c WHERE Id IN: sStrings];
        return getAllUsers;
    }
}