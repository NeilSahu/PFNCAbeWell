public class DNA_GuestUserClass {
    @AuraEnabled(cacheable=true)
    public static List<Attendee__c> getFavClasses(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        //Guest user contact id - james watson
        // String ContactId = '0033C00000bAPBDQA4';
        // System.debug('ContactId : '+ContactId);
        List<ID> scliIds = new List<ID>();
        List<Enrolled_Class__c> scheduleClassList = [Select Id, Name, Attendee__c, Schedule_Class__c, Schedule_Class__r.Id, Schedule_Class__r.Name, Schedule_Class__r.BWPS_StartTime__c, Schedule_Class__r.BWPS_Date__c, Schedule_Class__r.BWPS_instructor__c, Schedule_Class__r.BWPS_EndTime__c, Schedule_Class__r.BWPS_ClassFrequency__c, Schedule_Class__r.Class__c,Schedule_Class__r.Integrity__c , Schedule_Class__r.Schedule_Days__c,Schedule_Class__r.BWPS_Status__c,Schedule_Class__r.BWPS_Description__c FROM Enrolled_Class__c WHERE Attendee__c = : ContactId];
        List<Attendee__c> attendeeList = [Select Id, BWPS_WatchedTimeStamp__c, Class_Status__c, BPWS_Favourite__c, BWPS_Is_Enrolled__c, Is_Present__c, Schedule_Class_Line_Item_del__c, Attendee_Name_del__c, Schedule_Class_Line_Item_del__r.Id, Schedule_Class_Line_Item_del__r.Name, Schedule_Class_Line_Item_del__r.LectureVideoId__c, Schedule_Class_Line_Item_del__r.Video_Duration__c,Schedule_Class_Line_Item_del__r.BWPS_Vimeo_video_Id__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c, Schedule_Class_Line_Item_del__r.BWPS_Class_Day__c, Schedule_Class_Line_Item_del__r.BWPS_EndTime__c, Schedule_Class_Line_Item_del__r.BWPS_Integrity__c, Schedule_Class_Line_Item_del__r.Schedule_Class__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.Integrity__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.ContentVersionId__c, Schedule_Class_Line_Item_del__r.BWPS_StartTime__c, Schedule_Class_Line_Item_del__r.BWPS_Status__c ,Schedule_Class_Line_Item_del__r.LectureId__c , Schedule_Class_Line_Item_del__r.BWPS_Lecture_Link__c,Schedule_Class_Line_Item_del__r.BWPS_TIme__c, Schedule_Class_Line_Item_del__r.Schedule_Class__r.Name ,Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name, Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_Description__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.Schedule_Type__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.LatitudeLongitude__c from Attendee__c where Attendee_Name_del__c = : ContactId AND Schedule_Class_Line_Item_del__r.Schedule_Class__c != null AND Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__c != null ORDER BY CreatedDate DESC];
        //for(Attendee__c a : attendeeList){ scliIds.add(a.Schedule_Class_Line_Item_del__c); }
        //List<Schedule_Class_Line_Item__c> scliList = [Select Id, Name, ]
        System.debug('attendeeList : '+attendeeList);
        return attendeeList;
    }
    @AuraEnabled(cacheable=true)
    public static List<Attendee__c> getAllFavClasses(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        //Guest user contact id - james watson
        // String ContactId = '0033C00000bAPBDQA4';
        // System.debug('ContactId : '+ContactId);
        List<ID> scliIds = new List<ID>();
        List<Enrolled_Class__c> scheduleClassList = [Select Id, Name, Attendee__c, Schedule_Class__c, Schedule_Class__r.Id, Schedule_Class__r.Name, Schedule_Class__r.BWPS_StartTime__c, Schedule_Class__r.BWPS_Date__c, Schedule_Class__r.BWPS_instructor__c, Schedule_Class__r.BWPS_EndTime__c, Schedule_Class__r.BWPS_ClassFrequency__c, Schedule_Class__r.Class__c,Schedule_Class__r.Integrity__c , Schedule_Class__r.Schedule_Days__c,Schedule_Class__r.BWPS_Status__c,Schedule_Class__r.BWPS_Description__c FROM Enrolled_Class__c WHERE Attendee__c = : ContactId];
        List<Attendee__c> attendeeList = [Select Id, BWPS_WatchedTimeStamp__c, Class_Status__c, BPWS_Favourite__c, BWPS_Is_Enrolled__c, Is_Present__c, Schedule_Class_Line_Item_del__c, Attendee_Name_del__c, Schedule_Class_Line_Item_del__r.Id, Schedule_Class_Line_Item_del__r.Name, Schedule_Class_Line_Item_del__r.LectureVideoId__c, Schedule_Class_Line_Item_del__r.Video_Duration__c,Schedule_Class_Line_Item_del__r.BWPS_Vimeo_video_Id__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c, Schedule_Class_Line_Item_del__r.BWPS_Class_Day__c, Schedule_Class_Line_Item_del__r.BWPS_EndTime__c, Schedule_Class_Line_Item_del__r.BWPS_Integrity__c, Schedule_Class_Line_Item_del__r.Schedule_Class__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.Integrity__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.ContentVersionId__c, Schedule_Class_Line_Item_del__r.BWPS_StartTime__c, Schedule_Class_Line_Item_del__r.BWPS_Status__c ,Schedule_Class_Line_Item_del__r.LectureId__c , Schedule_Class_Line_Item_del__r.BWPS_Lecture_Link__c,Schedule_Class_Line_Item_del__r.BWPS_TIme__c, Schedule_Class_Line_Item_del__r.Schedule_Class__r.Name ,Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name, Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_Description__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.Schedule_Type__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.LatitudeLongitude__c from Attendee__c where Schedule_Class_Line_Item_del__r.Schedule_Class__c != null AND Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__c != null ORDER BY CreatedDate DESC];
        //for(Attendee__c a : attendeeList){ scliIds.add(a.Schedule_Class_Line_Item_del__c); }
        //List<Schedule_Class_Line_Item__c> scliList = [Select Id, Name, ]
        System.debug('attendeeList : '+attendeeList);
        return attendeeList;
    }
    @AuraEnabled(cacheable=true)
    public static List<Attendee__c> getAllActivityClasses(String sDate, String eDate){
        Date dateStart = Date.valueOf(sDate);
        Date dateEnd  = Date.valueOf(eDate);
        Time startTime = Time.newInstance(9, 0, 0, 0);
        Time endTime = Time.newInstance(17, 0, 0,0);
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        //Guest user contact id - james watson
        // String ContactId = '0033C00000bAPBDQA4';
        // System.debug('ContactId : '+ContactId);
        List<ID> scliIds = new List<ID>();
        List<Enrolled_Class__c> scheduleClassList = [Select Id, Name, Attendee__c, Schedule_Class__c, Schedule_Class__r.Id, Schedule_Class__r.Name, Schedule_Class__r.BWPS_StartTime__c, Schedule_Class__r.BWPS_Date__c, Schedule_Class__r.BWPS_instructor__c, Schedule_Class__r.BWPS_EndTime__c, Schedule_Class__r.BWPS_ClassFrequency__c, Schedule_Class__r.Class__c,Schedule_Class__r.Integrity__c , Schedule_Class__r.Schedule_Days__c,Schedule_Class__r.BWPS_Status__c,Schedule_Class__r.BWPS_Description__c FROM Enrolled_Class__c WHERE Attendee__c = : ContactId];
        List<Attendee__c> attendeeList = [Select Id, BWPS_WatchedTimeStamp__c, Class_Status__c, BPWS_Favourite__c, BWPS_Is_Enrolled__c, Is_Present__c, Schedule_Class_Line_Item_del__c, Attendee_Name_del__c, Schedule_Class_Line_Item_del__r.Id, Schedule_Class_Line_Item_del__r.Name , Schedule_Class_Line_Item_del__r.LectureVideoId__c, Schedule_Class_Line_Item_del__r.Video_Duration__c,Schedule_Class_Line_Item_del__r.BWPS_Vimeo_video_Id__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c, Schedule_Class_Line_Item_del__r.BWPS_Class_Day__c, Schedule_Class_Line_Item_del__r.BWPS_EndTime__c, Schedule_Class_Line_Item_del__r.BWPS_Integrity__c, Schedule_Class_Line_Item_del__r.Schedule_Class__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.ContentVersionId__c, Schedule_Class_Line_Item_del__r.BWPS_StartTime__c, Schedule_Class_Line_Item_del__r.BWPS_Status__c ,Schedule_Class_Line_Item_del__r.LectureId__c , Schedule_Class_Line_Item_del__r.BWPS_Lecture_Link__c,Schedule_Class_Line_Item_del__r.BWPS_TIme__c, Schedule_Class_Line_Item_del__r.Schedule_Class__r.Name ,Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name , Schedule_Class_Line_Item_del__r.Schedule_Class__r.Integrity__c , Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_Description__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.Schedule_Type__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.LatitudeLongitude__c from Attendee__c where Attendee_Name_del__c = : ContactId AND Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c >= :dateStart AND Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c <= :dateEnd AND ( Class_Status__c = 'RESUME' OR Class_Status__c = 'COMPLETED') ORDER BY CreatedDate ASC];
        //for(Attendee__c a : attendeeList){ scliIds.add(a.Schedule_Class_Line_Item_del__c); }
        //List<Schedule_Class_Line_Item__c> scliList = [Select Id, Name, ]
        System.debug('attendeeList : '+attendeeList);
        return attendeeList;
    }
    @AuraEnabled
    public static String getUserContactId(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        return ContactId;
    }
    @AuraEnabled
    public static String updateFavClass(Id clsId){
        String status = 'Failed';
        try {
            Attendee__c att = [Select Id , BPWS_Favourite__c From Attendee__c Where Id =: clsId Limit 1 ];
            System.debug('Status Before update : '+att.BPWS_Favourite__c);
            att.BPWS_Favourite__c = !att.BPWS_Favourite__c;
            System.debug('Status after update : '+att.BPWS_Favourite__c);
            Database.SaveResult srList = Database.update(att, false);
            if(srList.isSuccess()){
                status = 'Success';
            }
        } catch (Exception e) {
            System.debug('Error : '+e);
        }
        return status;
    }
    @AuraEnabled
    public static Map<String,List<sObject>> getFavRecords(Id clsId){
        List<EntitySubscription> esList = [SELECT id, parentId, subscriberId FROM EntitySubscription];
        Map<String,List<Id>> IdAndObjectMap = new Map<String,List<Id>>();
        List<Id> objList = new List<Id>();
        for (EntitySubscription es : esList) {
            //code_block
            Id recId = es.parentId;
            objList.add(es.parentId);
            String sObjName = recId.getSObjectType().getDescribe().getName();
            List<Id> favIds;   
            if(IdAndObjectMap.keyset().contains(sObjName)){
                favIds = IdAndObjectMap.get(sObjName);
            } else {
                favIds = new List<Id>();
            }
            favIds.add(recId);
            IdAndObjectMap.put(sObjName, favIds);
        }
        System.debug('mmmmmmmmmmmaaaaaaaaaaaaaaaapppppppppppppp'+IdAndObjectMap);
        // EntitySubscription entitysubscription = [SELECT id FROM EntitySubscription WHERE parentId =: recId AND subscriberId =: UserInfo.getUserId()];
        String sObjName = clsId.getSObjectType().getDescribe().getName();
        
        Map<String,List<sObject>> objNameAndRecordsMap = new Map<String,List<sObject>>();
        if(IdAndObjectMap.get('Contact').size() > 0){
            List<Contact> conList = [Select Id, Name From Contact Where Id IN : IdAndObjectMap.get('Contact')];
            objNameAndRecordsMap.put('Contact', conList);
        }
        if(IdAndObjectMap.get('Schedule_Class_Line_Item__c').size() > 0){
            List<Schedule_Class_Line_Item__c> scliList = [Select Id, Name, BWPS_TIme__c, BWPS_Status__c, BWPS_StartTime__c, Schedule_Class__c, BWPS_Integrity__c, BWPS_EndTime__c, BWPS_ClassDay__c, BWPS_ClassDate__c From Schedule_Class_Line_Item__c Where Id IN : IdAndObjectMap.get('Schedule_Class_Line_Item__c')];
            objNameAndRecordsMap.put('Schedule_Class_Line_Item__c', scliList);
        }
        if(IdAndObjectMap.get('Attendee__c').size() > 0){
            List<Attendee__c> attList = [Select Id, Name, Attendee_Name_del__c, Class_Status__c, BPWS_Favourite__c, BWPS_Is_Enrolled__c, Is_Present__c, Schedule_Class_Line_Item_del__c, RecordTypeId FROM Attendee__c Where Id IN : IdAndObjectMap.get('Attendee__c')];
            objNameAndRecordsMap.put('Attendee__c', attList);
        }
        System.debug('resultttttttttttttttttttttttttttttttttt'+objNameAndRecordsMap);
        return objNameAndRecordsMap;
    }
    @AuraEnabled
    public static boolean follow(String recId,boolean isFollowing){
        System.debug('is follow : '+isFollowing);
        if(isFollowing){
            List<EntitySubscription> entitysubscription = [SELECT id FROM EntitySubscription WHERE parentId =: recId AND subscriberId =: UserInfo.getUserId() LIMIT 1000];
            if(!entitysubscription.isEmpty()){
                delete entitysubscription;
            }
            return false;
        }
        else{
            EntitySubscription entitysubscription = new EntitySubscription(parentId=recId, SubscriberId=UserInfo.getUserId(), NetworkId = Network.getNetworkId());
            insert entitysubscription;
            return true;
        }
    }
    @AuraEnabled
    public static List<EntitySubscription> allEntitySubs(){
        List<EntitySubscription> esList = [SELECT Id, parentId, subscriberId FROM EntitySubscription Where subscriberId =: UserInfo.getUserId() LIMIT 1000];
        System.debug('esList == '+esList);
        return esList;
    }
     @AuraEnabled
    public static Map<Id,EntitySubscription> getAllEntitySubsMap(){
        List<EntitySubscription> esList = [SELECT Id, parentId, subscriberId FROM EntitySubscription Where subscriberId =: UserInfo.getUserId() LIMIT 1000];
        System.debug('esList == '+esList);
        Map<Id,EntitySubscription> entityMap = new Map<Id,EntitySubscription>();
        for(EntitySubscription es : esList){
            entityMap.put(es.parentId, es);
        }
        System.debug('entityMap : '+entityMap);
        return entityMap;
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllInstructors(){
        //instructor record type name - BWPS_Instructor_Record_Type
        // instructor record type name - Instructor Record Type
        List<Contact> instructorList = [SELECT Id, Name, RecordTypeId, RecordType.Name, About__c FROM Contact Where RecordType.Name = 'Instructor Record Type'];
        System.debug('Instructor list : '+instructorList);
        return instructorList;
    }
     @AuraEnabled
    public static List<Attendee__c> getAllClasses(Integer limitSize, Integer offset, String currentTab){
        String UserId = UserInfo.getUserId();
         //String nameInput = input + '%' ;
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        //Guest user contact id - james watson
        // String ContactId = '0033C00000bAPBDQA4';
        System.debug('ContactId : '+ContactId);
        //List<Attendee__c> attendeeList = [Select Id, BWPS_WatchedTimeStamp__c, Class_Status__c, BPWS_Favourite__c, BWPS_Is_Enrolled__c, Is_Present__c, Schedule_Class_Line_Item_del__c, Attendee_Name_del__c, Schedule_Class_Line_Item_del__r.Id, Schedule_Class_Line_Item_del__r.Name, Schedule_Class_Line_Item_del__r.LectureVideoId__c, Schedule_Class_Line_Item_del__r.Video_Duration__c,Schedule_Class_Line_Item_del__r.BWPS_Vimeo_video_Id__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c, Schedule_Class_Line_Item_del__r.BWPS_Class_Day__c, Schedule_Class_Line_Item_del__r.BWPS_EndTime__c, Schedule_Class_Line_Item_del__r.BWPS_Integrity__c, Schedule_Class_Line_Item_del__r.Schedule_Class__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.ContentVersionId__c, Schedule_Class_Line_Item_del__r.BWPS_StartTime__c, Schedule_Class_Line_Item_del__r.BWPS_Status__c ,Schedule_Class_Line_Item_del__r.LectureId__c , Schedule_Class_Line_Item_del__r.BWPS_Lecture_Link__c,Schedule_Class_Line_Item_del__r.BWPS_TIme__c, Schedule_Class_Line_Item_del__r.Schedule_Class__r.Name ,Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name, Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_Description__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.Schedule_Type__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.LatitudeLongitude__c from Attendee__c where  Attendee_Name_del__c = : ContactId ORDER BY CreatedDate desc LIMIT :limitSize OFFSET :offset];

        // Get a query locator
        Database.QueryLocator q = Database.getQueryLocator(
            [Select Id, BWPS_WatchedTimeStamp__c, Class_Status__c, BPWS_Favourite__c, BWPS_Is_Enrolled__c, Is_Present__c, Schedule_Class_Line_Item_del__c, Attendee_Name_del__c, 
            Schedule_Class_Line_Item_del__r.Id, Schedule_Class_Line_Item_del__r.Name, Schedule_Class_Line_Item_del__r.LectureVideoId__c, Schedule_Class_Line_Item_del__r.Video_Duration__c,Schedule_Class_Line_Item_del__r.BWPS_Vimeo_video_Id__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c, Schedule_Class_Line_Item_del__r.BWPS_Class_Day__c, Schedule_Class_Line_Item_del__r.BWPS_EndTime__c, Schedule_Class_Line_Item_del__r.BWPS_Integrity__c, 
            Schedule_Class_Line_Item_del__r.Schedule_Class__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.ContentVersionId__c, Schedule_Class_Line_Item_del__r.BWPS_StartTime__c, Schedule_Class_Line_Item_del__r.BWPS_Status__c ,Schedule_Class_Line_Item_del__r.LectureId__c , Schedule_Class_Line_Item_del__r.BWPS_Lecture_Link__c,Schedule_Class_Line_Item_del__r.BWPS_TIme__c, Schedule_Class_Line_Item_del__r.Schedule_Class__r.Name ,
            Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name , Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_Description__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.Schedule_Type__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.LatitudeLongitude__c from Attendee__c where  Attendee_Name_del__c = : ContactId ORDER BY CreatedDate desc]);
        // Get an iterator
        Database.QueryLocatorIterator it =  q.iterator();
        
        // Iterate over the records
        Integer count = 0;
        List<Attendee__c> attendeeList = new List<Attendee__c>();
        System.debug('currentTab : ' +currentTab);
        if(currentTab == 'Recent'){
            while (it.hasNext())
            {
                Attendee__c att = (Attendee__c)it.next();
                if(count >= offset){
                    attendeeList.add(att);
                }
                if(count >= (offset + limitSize) - 1){
                    break;
                }
                count++;
            }
        }else if(currentTab == 'InProg'){
            while (it.hasNext())
            {
                Attendee__c att = (Attendee__c)it.next();
                if(!String.isBlank(att.Class_Status__c) && att.Class_Status__c == 'RESUME'){
                    if(count >= offset){
                        attendeeList.add(att);
                    }
                    if(count >= (offset + limitSize) - 1){
                        break;
                    }
                    count++;
                }
            }  
        }else if(currentTab == 'Complete'){
           while (it.hasNext())
            {
                Attendee__c att = (Attendee__c)it.next();
                if(!String.isBlank(att.Class_Status__c) && att.Class_Status__c == 'COMPLETED'){
                    if(count >= offset){
                        attendeeList.add(att);
                    }
                    if(count >= (offset + limitSize) - 1){
                        break;
                    }
                    count++;
                }
            } 
        }

        return attendeeList;
    }

    @AuraEnabled
    public static String getOppPDFDocId(String oppId){
        System.debug('Opp ID : '+oppId);
        //Attachment attach = [SELECT ParentId,Name,Id,ContentType,Body FROM Attachment WHERE ParentId = : oppId LIMIT 1];
        //System.debug('attachment : '+attach);
        ContentDocumentLink oppRelatedFile =  [SELECT Id, ContentDocumentId, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId = :oppId LIMIT 1];
        System.debug('oppRelatedFile : '+oppRelatedFile);
        ContentVersion conVersion = [Select Id, Title, FileType, FileExtension, ContentDocumentId, ContentBodyId, VersionData From ContentVersion Where ContentDocumentId = : oppRelatedFile.ContentDocumentId LIMIT 1];
        System.debug('conVersion :'+conVersion);
        System.debug('conVersionID :'+conVersion.Id);
        return (string)conVersion.Id;
        //return (string)attach.Id;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<npe01__OppPayment__c> getAllPaymentRecords(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        //Guest user contact id - james watson
        //String ContactId = '0033C00000bAPBDQA4';
        System.debug('ContactId : '+ContactId);
        Opportunity opp = [Select Id, Name, npsp__Primary_Contact__c From Opportunity Where npsp__Primary_Contact__c =: ContactId LIMIT 1];
        System.debug('opp : '+opp);
        //Where Id = : opp.Id
        List<npe01__OppPayment__c> oppPayList = [Select Id, Name, npe01__Paid__c, npe01__Payment_Amount__c, npe01__Payment_Date__c, npe01__Payment_Method__c, npe01__Check_Reference_Number__c, Payment_Status__c,npsp__Card_Last_4__c  From npe01__OppPayment__c Where npe01__Opportunity__c = : opp.Id ORDER BY npe01__Payment_Date__c DESC];
        System.debug('Opp Paylist : '+oppPayList);
        return oppPayList;
    }

    @AuraEnabled
    public static List<Attendee__c> getFavAttendees(List<Id> recIds, Integer limitSize, Integer offset) {
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        return [Select Id, BWPS_WatchedTimeStamp__c, Class_Status__c, BPWS_Favourite__c, BWPS_Is_Enrolled__c, Is_Present__c, Schedule_Class_Line_Item_del__c, Attendee_Name_del__c, 
                    Schedule_Class_Line_Item_del__r.Id, Schedule_Class_Line_Item_del__r.Name, Schedule_Class_Line_Item_del__r.LectureVideoId__c, Schedule_Class_Line_Item_del__r.Video_Duration__c,Schedule_Class_Line_Item_del__r.BWPS_Vimeo_video_Id__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDate__c, Schedule_Class_Line_Item_del__r.BWPS_ClassDay__c, Schedule_Class_Line_Item_del__r.BWPS_Class_Day__c, Schedule_Class_Line_Item_del__r.BWPS_EndTime__c, Schedule_Class_Line_Item_del__r.BWPS_Integrity__c,
                    Schedule_Class_Line_Item_del__r.Schedule_Class__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.ContentVersionId__c, Schedule_Class_Line_Item_del__r.BWPS_StartTime__c, Schedule_Class_Line_Item_del__r.BWPS_Status__c ,Schedule_Class_Line_Item_del__r.LectureId__c , Schedule_Class_Line_Item_del__r.BWPS_Lecture_Link__c,Schedule_Class_Line_Item_del__r.BWPS_TIme__c, Schedule_Class_Line_Item_del__r.Schedule_Class__r.Name ,
                    Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_instructor__r.Name , Schedule_Class_Line_Item_del__r.Schedule_Class__r.BWPS_Description__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.Schedule_Type__c,Schedule_Class_Line_Item_del__r.Schedule_Class__r.LatitudeLongitude__c From Attendee__c Where Schedule_Class_Line_Item_del__r.Id IN :recIds AND Attendee_Name_del__c =: ContactId LIMIT :limitSize OFFSET :offset];
    }
    @AuraEnabled(cacheable=true)
    public static String getWaiverData(){
        WaiverData__mdt waiverData = [Select Id,Label,MasterLabel,WaiverContent__c From WaiverData__mdt Where MasterLabel = 'Waiver23' Limit 1];
        String waiverStr = (String)waiverData.WaiverContent__c;
        return waiverStr;
    }
}