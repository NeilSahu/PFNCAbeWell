public without sharing class BWPS_GuestUserHistoryClass {
    @AuraEnabled(cacheable=true)
    public static List<Attendee__c> BWPS_GetClassHistory(Integer limitSize, Integer offset) {
        // try{
            String UserId = UserInfo.getUserId();
            List<User> users = [SELECT Id, ContactId, Username FROM User WHERE Id=: UserId];
            System.debug(users[0].ContactId);
            String ContactId = users[0].ContactId;
            List<Attendee__c> BWPS_attendRec = [SELECT Id , Attendee_Name_del__r.Name, Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c,
                                        Schedule_Class_Line_Item_del__r.Name, Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name, 
                                        Is_Present__c FROM Attendee__c WHERE Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c <= TODAY AND Attendee_Name_del__c=: ContactId
                                        AND Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name != NULL 
                                        ORDER BY Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c desc LIMIT :limitSize
                                     OFFSET :offset ];
        System.debug(BWPS_attendRec);
            return BWPS_attendRec;
        // }
        // catch(Exception e){
        //     system.debug('EEEE>>'+e.getMessage());
            
        // }
    }
    @AuraEnabled(cacheable=true)
    public static List<Attendee__c> BWPS_GetClassCount() {
        // try{
            String UserId = UserInfo.getUserId();
            List<User> users = [SELECT Id, ContactId, Username FROM User WHERE Id=: UserId];
            System.debug(users[0].ContactId);
            String ContactId = users[0].ContactId;
            List<Attendee__c> BWPS_getCount = [SELECT Id FROM Attendee__c WHERE Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c <= TODAY AND Attendee_Name_del__c=: ContactId
                                        AND Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name != NULL  ];
        System.debug(BWPS_getCount);
            return BWPS_getCount;
    }
    @AuraEnabled(cacheable=true)
    public static List<Schedule_Class_Line_Item__c> BWPS_GetUpcomingClasses(String time1 , String time2,String ClassType) {
        //String UserId = UserInfo.getUserId();

            // List<User> users = [SELECT Id, ContactId, Username FROM User WHERE Id=: UserId];
            // System.debug(users[0].ContactId);
            String[] strTimeSplit1 = time1.split(':');
            Time timeChange1 = Time.newInstance( Integer.valueOf(strTimeSplit1[0]) //hour
                                     ,Integer.valueOf(strTimeSplit1[1]) //min
                                     ,0                                //sec
                                     ,0); 
            String[] strTimeSplit2 = time2.split(':');
            Time timeChange2 = Time.newInstance( Integer.valueOf(strTimeSplit2[0]) //hour
                                    ,Integer.valueOf(strTimeSplit2[1]) //min
                                    ,0                                //sec
                                    ,0);                       
            System.debug('time1'+timeChange1);
            System.debug('time2'+timeChange2);
            //List<Schedule_Class_Line_Item__c> BWPS_schLineItemRec = [SELECT Id ,BWPS_ClassDay__c,BWPS_Lecture_Link__c, BWPS_Vimeo_video_Id__c, LectureId__c, BWPS_Integrity__c, BWPS_ClassDate__c,
             //                           BWPS_StartTime__c, Name,Schedule_Class__r.LatitudeLongitude__c, Schedule_Class__r.BWPS_instructor__r.Name,Schedule_Class__r.BWPS_Description__c,Schedule_Class__r.RecordType.Name,Schedule_Class__r.Schedule_Type__c
             //                           FROM Schedule_Class_Line_Item__c WHERE BWPS_ClassDate__c >= TODAY 
             //                           AND  Schedule_Class__r.BWPS_instructor__r.Name != NULL AND (Schedule_Class__r.Schedule_Type__c=:ClassType OR Schedule_Class__r.Schedule_Type__c='Hybrid') AND (BWPS_StartTime__c>=: timeChange1 AND BWPS_StartTime__c <: timeChange2)
             //                           ORDER BY BWPS_ClassDate__c ];
            List<Schedule_Class_Line_Item__c> BWPS_schLineItemRec = [SELECT Id,Name,BWPS_ClassDay__c,BWPS_ClassDate__c,BWPS_StartTime__c,BWPS_EndTime__c,BWPS_Vimeo_video_Id__c,Video_Duration__c,BWPS_Class_Day__c,LectureVideoId__c,BWPS_Lecture_Link__c,LectureId__c,
                                        Schedule_Class__r.Name,Schedule_Class__r.Schedule_Type__c ,Schedule_Class__r.Integrity__c, Schedule_Class__r.BWPS_Description__c,Schedule_Class__r.RecordType.Name,
                                        Schedule_Class__r.Class__c, Schedule_Class__r.Class__r.Name,Schedule_Class__r.BWPS_instructor__c,Schedule_Class__r.BWPS_instructor__r.Name,Schedule_Class__r.BWPS_instructor__r.npe01__WorkEmail__c
                                        FROM Schedule_Class_Line_Item__c WHERE BWPS_ClassDate__c >= TODAY 
                                        AND  Schedule_Class__r.BWPS_instructor__r.Name != NULL AND (Schedule_Class__r.Schedule_Type__c=:ClassType OR Schedule_Class__r.Schedule_Type__c='Hybrid') AND (BWPS_StartTime__c>=: timeChange1 AND BWPS_StartTime__c <: timeChange2)
                                        ORDER BY BWPS_ClassDate__c ];
        System.debug(BWPS_schLineItemRec);
        return BWPS_schLineItemRec;
       
    }
    @AuraEnabled(cacheable=true)
    public static List<Schedule_Class_Line_Item__c> BWPS_MyClasses(Integer limitSize, Integer offset) {
       List<Schedule_Class_Line_Item__c> BWPS_getMyClass = [SELECT Id ,BWPS_ClassDay__c,BWPS_Lecture_Link__c, BWPS_Integrity__c, BWPS_ClassDate__c,
                                            BWPS_StartTime__c, Name, Schedule_Class__r.BWPS_instructor__r.Name,Schedule_Class__r.BWPS_Description__c
                                            FROM Schedule_Class_Line_Item__c WHERE Schedule_Class__r.BWPS_instructor__r.Name != NULL 
                                            ORDER BY BWPS_ClassDate__c  LIMIT :limitSize
                                            OFFSET :offset ];
       return BWPS_getMyClass;
    }
    @AuraEnabled(cacheable=true)
    public  static list<class__c> FetchRecordType(){
        	List<class__c> classRecType =  [select recordtype.name, ClassImageUrl__c, name,(select name,Schedule_Type__c from Schedule_Classes__r ) from class__c  ];
        	return classRecType ; 
    }
   
   @AuraEnabled(cacheable=true)
    public  static list<class__c> fetchContactDetail(String recType){
        	List<class__c> classRec =  [select name, ClassImageUrl__c, (select name,Schedule_Type__c from Schedule_Classes__r ) from class__c where RecordType.Name=:recType order by name ];
        	//BWPS_InstructorClassProfile ProfileClass = new BWPS_InstructorClassProfile();
        	//ProfileClass.fetchImage();
    		return classRec ; 
    }
}