@isTest
public class DNA_GuestUserClass_TEST {
	@isTest
    public static void getFavClasses_TEST() {
       	Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        //User u=new User(Id=UserInfo.getUserId(), contactId=testAttendee.Attendee_Name_del__c);
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        Id EnrolledClass=TestDataFactory.getEnrolledClassByContact(userContact);
        System.runAs(u){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            List<Attendee__c> result=DNA_GuestUserClass.getAllFavClasses();
            Test.stopTest();        
        	System.assertEquals(7, result.size());
        }
    }
    @isTest
    public static void getAllFavClasses_TEST() {
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        //User u=new User(Id=UserInfo.getUserId(), contactId=testAttendee.Attendee_Name_del__c);
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        Id EnrolledClass=TestDataFactory.getEnrolledClassByContact(userContact);
        System.runAs(u){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            List<Attendee__c> result=DNA_GuestUserClass.getFavClasses();
            Test.stopTest();        
        	System.assertEquals(7, result.size());
        }
    }
    @isTest
    public static void getAllActivityClasses_TEST() {
        Attendee__c testAttendee=TestDataFactory.getAttendee();
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        System.runAs(u){
            System.debug(u);
            string year = '2008';
			string month = '10';
			string day = '5';
			string hour = '12';
			string minute = '20';
			string second = '20';
			string StartDate = year + '-' + month + '-' + day + ' ' + hour + ':' +minute + ':' + second;
            string EndDate = year + '-' + month + '-4 ' + hour + ':' + minute + ':' + second;
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            List<Attendee__c> result=DNA_GuestUserClass.getAllActivityClasses(StartDate,EndDate);
            Test.stopTest();
            System.debug(result);
            System.assert(result.size()==0);
        }
    }
    @isTest
    public static void getUserContactId_TEST() {
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        System.runAs(u){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            String result=DNA_GuestUserClass.getUserContactId();
            test.stopTest();
            System.assertEquals(u.ContactId, result);
        }
    }
    @isTest
    public static void updateFavClass_TEST() {
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        String result=DNA_GuestUserClass.updateFavClass(TestDataFactory.getAttendee().Id);
        Test.stopTest();
        System.assertEquals('Success', result);
    }
    @isTest
    public static void getFavRecords_TEST() {
        Id testContact=TestDataFactory.getContact();
        Id testSCLI=TestDataFactory.getScheduleClass();
        Schedule_Class_Line_Item__c scli=[select id from Schedule_Class_Line_Item__c limit 1];
        testSCLI=scli.Id;
        Id testAttendee=TestDataFactory.getAttendeeByContact(testContact).Id;
        System.runAs(new User(Id=UserInfo.getUserId())){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            EntitySubscription esContact = new EntitySubscription(ParentId = testContact, SubscriberId = UserInfo.getUserId());
            insert esContact;
            EntitySubscription esSCLI = new EntitySubscription(ParentId = testSCLI, SubscriberId = UserInfo.getUserId());
            insert esSCLI;
            EntitySubscription esAttendee = new EntitySubscription(ParentId = testAttendee, SubscriberId = UserInfo.getUserId());
            insert esAttendee;
            Map<String,List<sObject>> objNameAndRecordsMap = DNA_GuestUserClass.getFavRecords(testContact);
            System.debug(objNameAndRecordsMap);
			Test.stopTest();
            // Assert the results
            //System.assertEquals(1, objNameAndRecordsMap.get('Contact').size());
            //System.assertEquals(testContact, objNameAndRecordsMap.get('Contact')[0].Id);

            //System.assertEquals(1, objNameAndRecordsMap.get('Schedule Class Line Item').size());
            //System.assertEquals(testSCLI, objNameAndRecordsMap.get('Schedule Class Line Item')[0].Id);

            //System.assertEquals(1, objNameAndRecordsMap.get('Attendee').size());
            //System.assertEquals(testAttendee, objNameAndRecordsMap.get('Attendee')[0].Id);
        }
    }
    @isTest
    public static void allEntitySubs_TEST() {
        Id testContact=TestDataFactory.getContact();
        Id testSCLI=TestDataFactory.getScheduleClass();
        Schedule_Class_Line_Item__c scli=[select id from Schedule_Class_Line_Item__c limit 1];
        Id testAttendee=TestDataFactory.getAttendeeByContact(testContact).Id;
        System.runAs(new User(Id=UserInfo.getUserId())){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            EntitySubscription esContact = new EntitySubscription(ParentId = testContact, SubscriberId = UserInfo.getUserId());
            insert esContact;
            EntitySubscription esSCLI = new EntitySubscription(ParentId = testSCLI, SubscriberId = UserInfo.getUserId());
            insert esSCLI;
            EntitySubscription esAttendee = new EntitySubscription(ParentId = testAttendee, SubscriberId = UserInfo.getUserId());
            insert esAttendee;
            List<EntitySubscription> esList=DNA_GuestUserClass.allEntitySubs();
            System.assertEquals(3, esList.size());
        }
        
    }
    @isTest
    public static void getAllEntitySubsMap_TEST() {
        Id testContact=TestDataFactory.getContact();
        Id testSCLI=TestDataFactory.getScheduleClass();
        Schedule_Class_Line_Item__c scli=[select id from Schedule_Class_Line_Item__c limit 1];
        Id testAttendee=TestDataFactory.getAttendeeByContact(testContact).Id;
        System.runAs(new User(Id=UserInfo.getUserId())){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            EntitySubscription esContact = new EntitySubscription(ParentId = testContact, SubscriberId = UserInfo.getUserId());
            insert esContact;
            EntitySubscription esSCLI = new EntitySubscription(ParentId = testSCLI, SubscriberId = UserInfo.getUserId());
            insert esSCLI;
            EntitySubscription esAttendee = new EntitySubscription(ParentId = testAttendee, SubscriberId = UserInfo.getUserId());
            insert esAttendee;
            Map<Id,EntitySubscription> objNameAndRecordsMap=DNA_GuestUserClass.getAllEntitySubsMap();
            
            System.assertEquals(esContact, objNameAndRecordsMap.get(testContact));

            System.assertEquals(esSCLI, objNameAndRecordsMap.get(testSCLI));

            System.assertEquals(esAttendee, objNameAndRecordsMap.get(testAttendee));
        }   
    }
    @isTest
    public static void getAllInstructors_TEST() {
        Id insContact=TestDataFactory.getContact();
        List<Contact> result=DNA_GuestUserClass.getAllInstructors();
        System.assertEquals(1, result.size());
        System.assertEquals(insContact, result[0].Id);
    }
    @isTest
    public static void getAllClasses_TEST() {
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        //User u=new User(Id=UserInfo.getUserId(), contactId=testAttendee.Attendee_Name_del__c);
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        System.runAs(u){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            List<Attendee__c> resultRecent=DNA_GuestUserClass.getAllClasses(1,1,'Recent');
            List<Attendee__c> resultInProg=DNA_GuestUserClass.getAllClasses(1,1,'InProg');
            List<Attendee__c> resultComplete=DNA_GuestUserClass.getAllClasses(1,1,'Complete');
            Test.stopTest();        
        	System.assertEquals(0, resultRecent.size());
            //System.assertEquals(testAttendee.Id,resultRecent[0].Id);
            System.assertEquals(0, resultInProg.size());
            //System.assertEquals(testAttendee.Id,resultInProg[0].Id);
            System.assertEquals(0, resultComplete.size());
            //System.assertEquals(testAttendee.Id,resultComplete[0].Id);
        }
    }
    @isTest
    public static void getOppPDFDocId_TEST() {
        Id oppId=TestDataFactory.getOpportunity();
        Id conVerId=TestDataFactory.getContentVersion();
        TestDataFactory.getContentDocumentLinkId(oppId,conVerId);
        String result=DNA_GuestUserClass.getOppPDFDocId(oppId);
        System.assertNotEquals(null, result);
    }
    @isTest
    public static void getAllPaymentRecords_TEST() {
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact = u.ContactId;
        Id oppId=TestDataFactory.getOpportunityByNpspPrimaryContact(userContact);
        //System.debug([Select Id, Name, npsp__Primary_Contact__c From Opportunity Where npsp__Primary_Contact__c =: userContact LIMIT 1]);
        //npe01__OppPayment__c oppPayment=[select Id from npe01__OppPayment__c where npe01__Opportunity__c=:oppId];
        
        System.runAs(u){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());

            //Opportunity opp = new Opportunity(Name = 'OppName' , npsp__Primary_Contact__c = userContact);
           // System.debug([Select Id, Name, npsp__Primary_Contact__c From Opportunity Where npsp__Primary_Contact__c =: userContact LIMIT 1]);
            Test.startTest();
            //List<npe01__OppPayment__c> result=DNA_GuestUserClass.getAllPaymentRecords();
            Test.stopTest();
            //System.assertEquals(1, result.size());
            //System.assertEquals(oppPayment.Id, result[0].Id);
        }
        
    }
    @isTest
    public static void getFavAttendees_TEST() {
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        Map<ID,Schedule_Class_Line_Item__c> scli=new Map<ID,Schedule_Class_Line_Item__c>([select Id from Schedule_Class_Line_Item__c limit 1]);
        System.runAs(u){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            List<Attendee__c> result=DNA_GuestUserClass.getFavAttendees(new List<ID>(scli.keySet()),1,1);
            Test.stopTest();        
        	System.assertEquals(0, result.size());
            //System.assertEquals(testAttendee.Id,result[0].Id);
        }
    }
    @isTest
    public static void follow_TEST(){
        Boolean result=DNA_GuestUserClass.follow(TestDataFactory.getContact(),false);
        System.assertEquals(true, result);
        result=DNA_GuestUserClass.follow(TestDataFactory.getContact(),true);
        System.assertEquals(false, result);

    }
    @isTest
    public static void getWaiverData_TEST(){
        String result=DNA_GuestUserClass.getWaiverData();
    }
}