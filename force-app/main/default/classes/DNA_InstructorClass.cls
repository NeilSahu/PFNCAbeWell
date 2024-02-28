public class DNA_InstructorClass {
    @AuraEnabled(cacheable=true)
    public static List<Schedule_Class__c> getScheduleClasses(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        // String ContactId = '0033C00000Za9uzQAB';
        System.debug('ContactId : '+ContactId);
        //List<Schedule_Class__c> scheduleClassList = [Select Id, Name, BWPS_StartTime__c, BWPS_Date__c, BWPS_instructor__c, BWPS_ClassDuration__c, BWPS_EndTime__c, BWPS_ClassFrequency__c, Class__c FROM Schedule_Class__c WHERE BWPS_instructor__c = : ContactId];  
        List<Schedule_Class__c> scheduleClassList = [Select Id,ContentVersionId__c,ContentImageUrl__c, Name, BWPS_StartTime__c, BWPS_Date__c, BWPS_instructor__c, BWPS_EndTime__c, BWPS_ClassFrequency__c, Class__c,Integrity__c , Schedule_Days__c,BWPS_Status__c,BWPS_Description__c,BWPS_instructor__r.Name, ( SELECT Id,Name,Schedule_Class__c,BWPS_TIme__c,BWPS_Status__c,BWPS_ClassDay__c, BWPS_ClassDate__c,BWPS_Integrity__c,BWPS_StartTime__c,BWPS_EndTime__c , LectureId__c  FROM Schedule_Class_Line_Items__r WHERE BWPS_Status__c='Active') FROM Schedule_Class__c WHERE BWPS_instructor__c = : ContactId AND BWPS_Status__c='Active'];
        System.debug('ScheduleList : '+scheduleClassList);
        // Map<Id , Schedule_Class__c> scIdandRecordMap = new Map<Id , Schedule_Class__c>();
        // List<ID> scIdList = new List<ID>();
        // for (Schedule_Class__c sc : scheduleClassList) {
        //     scIdList.add(sc.Id);
        //     scIdandRecordMap.add(sc.Id , sc);
        // }
        // List<ContentDocumentLink> scRelatedFileIdList =  [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN : scIdList];
        // List<ID> cdIdList = new List<ID>();
        // Map<Id , Schedule_Class__c> scIdandRecordMap = new Map<Id , Schedule_Class__c>();

        // for(ContentDocumentLink cd : scRelatedFileIdList){
        //     cdIdList.add(cd.Id);
        //     scIdandRecordMap.add(cd.ContentDocumentId, cd);
        // }
        // List<ContentVersion> contentList = [Select Id, Title, FileType, FileExtension, ContentDocumentId, ContentBodyId, VersionData From ContentVersion Where ContentDocumentId IN : cdIdList];
        // System.debug(contentList);
        // Map<Id , Schedule_Class__c> cvIdandSCRecordMap = new Map<Id , Schedule_Class__c>();
        // for(ContentVersion cv : contentList){
        //     ContentDocumentLink cdv = scIdandRecordMap.get(cv.ContentDocumentId);
        //     Schedule_Class__c sc = scIdandRecordMap.get(cdv.LinkedEntityId);
        //     cvIdandSCRecordMap.add(cv.Id,sc);
        // }

        return scheduleClassList;
    }
    @AuraEnabled
    public static List<Class__c> getClasses(){
        List<Class__c> classList = [SELECT Id, Name, BWPS_Type__c FROM Class__c];
        System.debug(''+classList);
        return classList;
    }
    @AuraEnabled(cacheable=true)
    public static Map<Id,Schedule_Class__c> getContentVersionAndScheduleClasses(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        // String ContactId = '0033C00000Za9uzQAB';
        System.debug('ContactId : '+ContactId);
        //List<Schedule_Class__c> scheduleClassList = [Select Id, Name, BWPS_StartTime__c, BWPS_Date__c, BWPS_instructor__c, BWPS_ClassDuration__c, BWPS_EndTime__c, BWPS_ClassFrequency__c, Class__c FROM Schedule_Class__c WHERE BWPS_instructor__c = : ContactId];  
        List<Schedule_Class__c> scheduleClassList = [Select Id,ContentVersionId__c, Name, BWPS_StartTime__c, BWPS_Date__c, BWPS_instructor__c, BWPS_ClassDuration__c, BWPS_EndTime__c, BWPS_ClassFrequency__c, Class__c , ( SELECT Id,Name,Schedule_Class__c,BWPS_TIme__c,BWPS_Status__c,BWPS_ClassDay__c, BWPS_ClassDate__c,BWPS_Integrity__c,BWPS_StartTime__c,BWPS_EndTime__c  FROM Schedule_Class_Line_Items__r ) FROM Schedule_Class__c WHERE BWPS_instructor__c = : ContactId];
        System.debug('ScheduleList : '+scheduleClassList);
        Map<Id , Schedule_Class__c> scIdandRecordMap = new Map<Id , Schedule_Class__c>();
        List<ID> scIdList = new List<ID>();
        for (Schedule_Class__c sc : scheduleClassList) {
            scIdList.add(sc.Id);
            scIdandRecordMap.put(sc.Id , sc);
        }
        List<ContentDocumentLink> scRelatedFileIdList =  [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN : scIdList];
        List<ID> cdIdList = new List<ID>();
        Map<Id , ContentDocumentLink> cdvIdandRecordMap = new Map<Id , ContentDocumentLink>();

        for(ContentDocumentLink cd : scRelatedFileIdList){
            cdIdList.add(cd.ContentDocumentId);
            cdvIdandRecordMap.put(cd.ContentDocumentId, cd);
        }
        List<ContentVersion> contentList = [Select Id, Title, FileType, FileExtension, ContentDocumentId, ContentBodyId, VersionData From ContentVersion Where ContentDocumentId IN : cdIdList];
        System.debug(contentList);
        Map<Id , Schedule_Class__c> cvIdandSCRecordMap = new Map<Id , Schedule_Class__c>();
        for(ContentVersion cv : contentList){
            ContentDocumentLink cdv = cdvIdandRecordMap.get(cv.ContentDocumentId);
            Schedule_Class__c sc = scIdandRecordMap.get(cdv.LinkedEntityId);
            cvIdandSCRecordMap.put(cv.Id,sc);
        }
        System.debug('cvIdandSCRecordMap : '+cvIdandSCRecordMap);
        return cvIdandSCRecordMap;
    }   
    @AuraEnabled
    public static Schedule_Class__c insertScheduleClass(Map<String, String> scObj ){
        Schedule_Class__c s = new Schedule_Class__c();
        try{
            System.debug(scObj);
            User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
            String ContactId = u.ContactId;
            // String ContactId = '0033C00000Za9uzQAB';
            String Name = scObj.get('scheduleClassName');
            String integrity = scObj.get('integrity');
            String className = scObj.get('className');
            System.debug('startDate is : '+scObj.get('startDate'));
            Date startDate = null;
            String endTime = null;
            String startTime = null;
            if(scObj.get('startDate') != null && scObj.get('startDate').length() > 0 ){
                startDate = date.valueOf(scObj.get('startDate'));
                System.debug('StartDate : '+startDate);
            }
            if(scObj.get('endTime') != null && scObj.get('endTime').length() > 0){
                endTime = scObj.get('endTime');
                System.debug('endTime : '+endTime);
            }
            if(scObj.get('startTime') != null && scObj.get('startTime').length() > 0){
                startTime = scObj.get('startTime');
                System.debug('startTime : '+startTime);
            }
            //Date startDate = date.valueOf(scObj.get('startDate'));
            //String endTime = scObj.get('endTime');
            //String startTime = scObj.get('startTime');
            //String description = scObj.get('description');
            System.debug('startTime : '+startTime);
            System.debug('endTime : '+endTime);
            System.debug('classType : '+scObj.get('classType'));
            String[] StartTimeSplit;
            if(startTime != null){
                StartTimeSplit = startTime.split(':');
            }
            String[] EndTimeSplit;
            if(endTime != null){
                EndTimeSplit = endTime.split(':');
            }
            Time StartTimeChange = null;
            if(endTime != null){
                StartTimeChange = Time.newInstance( Integer.valueOf(StartTimeSplit[0]),Integer.valueOf(StartTimeSplit[1]),0 ,0);
            }
            Time EndTimeChange = null;
            if(endTime != null){
                EndTimeChange = Time.newInstance( Integer.valueOf(EndTimeSplit[0]),Integer.valueOf(EndTimeSplit[1]),0 ,0);
            }
            String recurringRecordType = Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get('Recurring Class').getRecordTypeId();
            String OneTimeRecordType = Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get('One Time Class').getRecordTypeId();
            If(scObj.get('recordType') == 'Recurring'){
                System.debug('Days : '+scObj.get('classDays'));
                String days = null;
                s.BWPS_ClassFrequency__c = Integer.valueOf(scObj.get('classFrequency'));
                if(scObj.get('classDays') != null && scObj.get('classDays').length() > 0 ){
                    days = scObj.get('classDays');
                }
                String[] dayArray = scObj.get('classDays').split(',');
                List<String> dayList = new List<String>();
                for(integer i = 0 ; i < dayArray.size() ; i++){
                    dayList.add(dayArray[i]);
                }
                s.Schedule_Days__c = days;
                s.RecordTypeId = recurringRecordType;
            }
            If(scObj.get('recordType') == 'OneTime'){
                s.RecordTypeId = OneTimeRecordType;
            }
            s.Class__c = className;
            s.Integrity__c = integrity;
            s.Name = Name;
            s.BWPS_StartTime__c = StartTimeChange;
            s.BWPS_EndTime__c = EndTimeChange;
            //s.BWPS_Description__c = description;
            s.BWPS_Date__c = startDate;
            s.BWPS_instructor__c = contactId;
            System.debug('Sc inserting : '+s);
            database.insert (s,true);
        }
        catch(Exception e){
            System.debug(' error message line ' +e.getLineNumber());
            System.debug(' error message ' +e.getMessage());
        }
        return s;
    }

    @AuraEnabled(cacheable=true)
    public static void getAllRelatedLineItem(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        //String ContactId = '0033C00000Za9uzQAB';
        System.debug('ContactId : '+ContactId);
        List<Schedule_Class_Line_Item__c> lineItemList = new List<Schedule_Class_Line_Item__c>();
        List<Enrolled_Class__c> scheduleClassList = [Select Id, Name, Attendee__c, Schedule_Class__c, Schedule_Class__r.Id, Schedule_Class__r.Name, Schedule_Class__r.BWPS_StartTime__c, Schedule_Class__r.BWPS_Date__c, Schedule_Class__r.BWPS_instructor__c, Schedule_Class__r.BWPS_EndTime__c, Schedule_Class__r.BWPS_ClassFrequency__c, Schedule_Class__r.Class__c,Schedule_Class__r.Integrity__c , Schedule_Class__r.Schedule_Days__c,Schedule_Class__r.BWPS_Status__c,Schedule_Class__r.BWPS_Description__c FROM Enrolled_Class__c WHERE Attendee__c = : ContactId];
    }
    @AuraEnabled
    public static String downloadWaiverPdf(){
        String htmlBody = '';
        htmlBody += '<html><body><div style="height:800px;">'+
                        '<div style="display:flex;justify-content:space-evenly;">'+
                            '<span style="padding-right:20px;">'+'Date'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - Parkinson </span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Amount'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - Be well </span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Payment Method'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - ParkinSon</span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Status'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - WaiverRules</span>'+
                        '</div><br><br>	'+
                    '</div>'+
                '</body></html>';

        //Created ContentVersion of attachment file
        ContentVersion ContVerFile = new ContentVersion();
        ContVerFile.VersionData = Blob.toPdf(htmlBody);
        ContVerFile.Title = 'WaiverAndRules'+'.pdf';   
        ContVerFile.ContentLocation= 's';
        ContVerFile.PathOnClient= 'WaiverAndRules' +'.pdf';
        insert ContVerFile;
        
        //insert ContentDocumentLink file 
        
        System.debug('conVersionID :'+ContVerFile.Id);
        return (string)ContVerFile.Id;
    }
    @AuraEnabled
    public static String getBaseUrl(){
        String BaseURL = URL.getSalesforceBaseUrl().toExternalForm();
        return BaseURL;
    }
    @AuraEnabled( cacheable=true)
    public static List<BWPS_Announcements__c> getAnnouncements(){
        date d = system.today().addDays(-1);
        date dt = system.today();
        System.debug(d);
        List<BWPS_Announcements__c> announcementRec = [SELECT Detail__c,CreatedDate, Owner.Name , Announcement_for__c FROM BWPS_Announcements__c WHERE CreatedDate >: d ];
        return announcementRec;
    }
    @AuraEnabled( cacheable=true)
    public static Map<String,Object> getClassCount(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id,Name,Email, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
      //  String ContactId = '0033C00000Za9uzQAB';
        System.debug('ContactId : '+ContactId);
        //List<Schedule_Class__c> scheduleClassList = [Select Id, Name, BWPS_StartTime__c, BWPS_Date__c, BWPS_instructor__c, BWPS_ClassDuration__c, BWPS_EndTime__c, BWPS_ClassFrequency__c, Class__c FROM Schedule_Class__c WHERE BWPS_instructor__c = : ContactId];  
       // List<enrolled_class__c> scheduleClassList = [select attendee__c,Schedule_Class__c,Schedule_Class__r.bwps_instructor__r.Name,Schedule_Class__r.bwps_instructor__r.Email from enrolled_class__c where Schedule_Class__r.bwps_instructor__c=: ContactId];
        List<Schedule_Class__c> scheduleClasses = [SELECT Id,bwps_instructor__c,(SELECT Id,Name FROM Enrolled_Classes__r ) FROM Schedule_Class__c
                                                     WHERE bwps_instructor__c =:ContactId];
        Map<String,Object> countRec = new Map<String,Object>();
      //  Set<String> attendeeCount = new Set<String>();
      //  Set<String> classCount = new Set<String>();
        Integer attendeesCount = 0;
        for(Schedule_Class__c classRec: scheduleClasses){
            // attendeeCount.add(e.attendee__c);
            // classCount.add(e.Schedule_Class__c);
            attendeesCount = attendeesCount + classRec.Enrolled_Classes__r.size();
        }
        countRec.put('Attendee',attendeesCount);
        countRec.put('Class',scheduleClasses.size());
        countRec.put('Name',u.Name);
        countRec.put('Email',u.Email);
        return countRec;
    }
    @AuraEnabled(cacheable=true)
    public static List<BWPS_Resource__c> getResources(){
         List<BWPS_Resource__c> resourcesRec = [SELECT Id,Name,Description__c,BWPS_Link__c,CreatedDate FROM BWPS_Resource__c WHERE Dashboard__c ='Instructor' ORDER BY  CreatedDate DESC];
         return resourcesRec;
    }

    @AuraEnabled(cacheable=true)
    public static List<BWPS_Resource__c> getWibResources(){
         List<BWPS_Resource__c> resourcesRec = [SELECT Id,Name,Description__c,BWPS_Link__c,CreatedDate,ResourceSection__c FROM BWPS_Resource__c WHERE Dashboard__c ='Website General' ORDER BY  CreatedDate DESC];
         return resourcesRec;
    }
  //============================================ this method return all instructor schedule classes between week======================
    @AuraEnabled( cacheable=true)
    public static List<Schedule_Class_Line_Item__c> getInstructorEvent(String satrtDate ,String endDate){
        Date dateStart = Date.valueOf(satrtDate);
        Date dateEnd  = Date.valueOf(endDate);
        Time startTime = Time.newInstance(9, 0, 0, 0);
        Time endTime = Time.newInstance(17, 0, 0,0);
        String contactId = [SELECT Id,ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
        Map<String,Schedule_Class__c> scheduleClasses = New Map<String,Schedule_Class__c>([SELECT Id,Name FROM Schedule_Class__c WHERE BWPS_instructor__c =: contactId]);
        List<Schedule_Class_Line_Item__c> eventList = [SELECT Id,Name,BWPS_EndTime__c,BWPS_Integrity__c,Schedule_Class__c,BWPS_StartTime__c,BWPS_Status__c,Schedule_Class__r.BWPS_Description__c,
                                                       Schedule_Class__r.BWPS_instructor__r.Name,BWPS_ClassDate__c,BWPS_ClassDay__c FROM Schedule_Class_Line_Item__c
                                                       WHERE Schedule_Class__c IN: scheduleClasses.keySet() AND BWPS_ClassDate__c >= :dateStart AND BWPS_ClassDate__c <= :dateEnd AND BWPS_StartTime__c >= :startTime AND
                                                   BWPS_StartTime__c <= :endTime  order by BWPS_ClassDate__c desc];
        return eventList;
    }
    
   //=========================================== instructor month events ======================================
   @AuraEnabled
    public static List<Schedule_Class_Line_Item__c> instructorMonthData(Integer monthOfData , Integer yearOfData){
        String ContactId = [SELECT Id,ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
        Time startTime = Time.newInstance(9, 0, 0, 0);
        Time endTime = Time.newInstance(17, 0, 0,0);
         Map<String,Schedule_Class__c> scheduleClasses = New Map<String,Schedule_Class__c>([SELECT Id,Name FROM Schedule_Class__c WHERE BWPS_instructor__c =: contactId]);
         List<Schedule_Class_Line_Item__c> eventList = [SELECT Id,Name,BWPS_EndTime__c,BWPS_Integrity__c,Schedule_Class__c,BWPS_StartTime__c,BWPS_Status__c,Schedule_Class__r.BWPS_Description__c,
                                                   Schedule_Class__r.BWPS_instructor__r.Name,BWPS_ClassDate__c,BWPS_ClassDay__c FROM Schedule_Class_Line_Item__c
                                                   WHERE Schedule_Class__c IN: scheduleClasses.keySet() AND CALENDAR_YEAR(BWPS_ClassDate__c)=:yearOfData AND CALENDAR_MONTH(BWPS_ClassDate__c)=:monthOfData AND
                                                    BWPS_StartTime__c >= :startTime AND BWPS_StartTime__c <= :endTime ];
        return eventList;
    }
    @AuraEnabled(cacheable=true)
    public static List<FAQ__c> getAllFaqRecords(){
        List<FAQ__c> faqList = [Select Id, Name, Answer__c From FAQ__c];
        return faqList; 
    }
    
    @AuraEnabled(cacheable=true)
    public static List<FAQ__c> getAllFaqRecords1(string faqsType){
        
        system.debug('faqsType'+faqsType);
        List<FAQ__c> faqList = [Select Id, Name, Answer__c,Type__c From FAQ__c where Type__c =:faqsType];
        
        system.debug('faqsType'+faqList);
        return faqList; 
    }
    
 
}