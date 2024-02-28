@isTest
public class DNA_InstructorClassTest {
 
    @isTest
    static void testGetScheduleClasses() {
        
       	TestDataFactory.getScheduleClassForBWPS_instructorPortalUserContactId();
		test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();
        List<Schedule_Class__c> scheduleClasses = DNA_InstructorClass.getScheduleClasses();
        Test.stopTest();

        // verify that the test class is in the list
        /*Boolean testClassFound = false;
        for (Schedule_Class__c scheduleClass : scheduleClasses) {
            if (scheduleClass.Id == sc) {
                testClassFound = true;
                break;
            }
        }
        System.assertEquals(true, testClassFound);*/
    }



    @isTest
    static void testGetClasses() {
        // create some test classes
        Class__c testClass1 = new Class__c(Name = 'Test Class 1', BWPS_Type__c = 'Type A');
        insert testClass1;
        Class__c testClass2 = new Class__c(Name = 'Test Class 2', BWPS_Type__c = 'Type B');
        insert testClass2;

        // test the getClasses method
        Test.startTest();
        List<Class__c> classes = DNA_InstructorClass.getClasses();
        Test.stopTest();

        // verify that the test classes are in the list
        Boolean testClass1Found = false;
        Boolean testClass2Found = false;
        for (Class__c classItem : classes) {
            if (classItem.Id == testClass1.Id) {
                testClass1Found = true;
            }
            if (classItem.Id == testClass2.Id) {
                testClass2Found = true;
            }
        }
        System.assertEquals(true, testClass1Found);
        System.assertEquals(true, testClass2Found);
    }

    @isTest
    static void testGetContentVersionAndScheduleClasses() {
        User u=TestDataFactory.getScheduleClassForBWPS_instructorPortalUserContactId();
        System.runAs(u){
            //List<Schedule_Class__c> scheduleClassList = [Select Id,ContentVersionId__c, Name, BWPS_StartTime__c, BWPS_Date__c, BWPS_instructor__c, BWPS_ClassDuration__c, BWPS_EndTime__c, BWPS_ClassFrequency__c, Class__c , ( SELECT Id,Name,Schedule_Class__c,BWPS_TIme__c,BWPS_Status__c,BWPS_ClassDay__c, BWPS_ClassDate__c,BWPS_Integrity__c,BWPS_StartTime__c,BWPS_EndTime__c  FROM Schedule_Class_Line_Items__r ) FROM Schedule_Class__c WHERE BWPS_instructor__c = : ContactId];
            
            //System.debug('scheduleClassList==> ',scheduleClassList);
            test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Test.startTest();
            DNA_InstructorClass.getContentVersionAndScheduleClasses();
            Test.stopTest();
        }
        
    }

    
    @isTest
    static void testInsertScheduleClass() {
        Map<String, String> scObj = new Map<String, String>();
        scObj.put('scheduleClassName', 'Test Schedule Class');
        scObj.put('integrity', 'Test Integrity');
        scObj.put('className', 'Test Class');
        scObj.put('startDate', '2023-03-15');
        scObj.put('endTime', '12:00');
        scObj.put('startTime', '11:00');
        scObj.put('recordType', 'Recurring');
        scObj.put('classDays', 'Monday,Wednesday,Friday');
        scObj.put('classFrequency', '3');
        Test.startTest();
        Schedule_Class__c s = DNA_InstructorClass.insertScheduleClass(scObj);
       	Test.stopTest();
       
        
    }

  

    @IsTest
    static void testGetAllRelatedLineItem() {
        // create test user and contact
        Contact testContact = new Contact(FirstName = 'Test', LastName = 'Contact');
        insert testContact;
        User u=TestDataFactory.createPortalUser();
        // create test schedule class
        id testScheduleClass = TestDataFactory.getScheduleClass();

        // create test enrolled class
        Enrolled_Class__c testEnrolledClass = new Enrolled_Class__c(Attendee__c = testContact.Id, Schedule_Class__c = testScheduleClass);
        insert testEnrolledClass;
		test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        // call the method to test
        DNA_InstructorClass.getAllRelatedLineItem();
        Test.stopTest();

        // assert expected results
        List<Enrolled_Class__c> expectedScheduleClassList = [SELECT Id, Name, Attendee__c, Schedule_Class__c, Schedule_Class__r.Id, Schedule_Class__r.Name, Schedule_Class__r.BWPS_StartTime__c, Schedule_Class__r.BWPS_Date__c, Schedule_Class__r.BWPS_instructor__c, Schedule_Class__r.BWPS_EndTime__c, Schedule_Class__r.BWPS_ClassFrequency__c, Schedule_Class__r.Class__c,Schedule_Class__r.Integrity__c , Schedule_Class__r.Schedule_Days__c,Schedule_Class__r.BWPS_Status__c,Schedule_Class__r.BWPS_Description__c FROM Enrolled_Class__c WHERE Attendee__c = :testContact.Id];
        //List<Schedule_Class_Line_Item__c> expectedLineItemList = new List<Schedule_Class_Line_Item__c>();
		//List<Enrolled_Class__c> scheduleClassList=DNA_InstructorClass.getAllRelatedLineItem();
        //System.assertEquals(expectedScheduleClassList,scheduleClassList );
       
    }

    @IsTest
    static void testDownloadWaiverPdf() {
        
       

        String contentVersionId = DNA_InstructorClass.downloadWaiverPdf();

        // Verify that a ContentVersion record was created
        List<ContentVersion> contentVersions = [SELECT Id, Title FROM ContentVersion WHERE Id = :contentVersionId];
        System.assertEquals(1, contentVersions.size());
        System.assertEquals('WaiverAndRules.pdf', contentVersions[0].Title);

       
        List<ContentDocumentLink> contentDocumentLinks = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :contentVersionId];
        System.assertEquals(0, contentDocumentLinks.size());

        
        //delete contentVersions;
        delete contentDocumentLinks;
    }


    @IsTest
    static void testGetBaseUrl() {
        
        
        
        
        String baseUrl = DNA_InstructorClass.getBaseUrl();
        
        
        //System.assertEquals('https://test.salesforce.com', baseUrl);
    }
    @isTest
    static void testgetAnnouncements(){
        Test.startTest();
        
        DNA_InstructorClass.getAnnouncements();
        Test.stopTest();
    }
   
    
    @isTest
    static void testGetClassCount() {
        
        // create test data
       user u= TestDataFactory.createPortalUser();
         Id i3=TestDataFactory.getContact();
        Id i2=TestDataFactory.getEnrolledClassByContact(i3);
       
        
        
           
       
        Test.startTest();
        System.runAs(u) {
            
            test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Map<String,Object> result = DNA_InstructorClass.getClassCount();
            
           
            System.assertEquals(0, (Integer)result.get('Attendee'));
            System.assertEquals(0, (Integer)result.get('Class'));
            //System.assertEquals(u.Name, (String)result.get('Name'));
            //System.assertEquals(u.Email, (String)result.get('Email'));
        }
        Test.stopTest();
    }
    @isTest
    static void testgetResources(){
        Test.startTest();
        
        DNA_InstructorClass.getResources();
        Test.stopTest();
    }
    @isTest
    static void testgetWibResources(){
         Test.startTest();
        
        DNA_InstructorClass.getWibResources();
        Test.stopTest();
    }
    
 
    @isTest static void testGetInstructorEvent() {
        
        
        User testUser = TestDataFactory.createPortalUser();
        
       
       	Id i=TestDataFactory.getEnrolledClassByContact(testUser.ContactId);
        
        Id i2=TestDataFactory.getScheduleClassLineItem();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
       
        List<Schedule_Class_Line_Item__c> result = DNA_InstructorClass.getInstructorEvent(String.valueOf(Date.today()), String.valueOf(Date.today()));
        
    }
   @isTest
    static void testinstructorMonthData() {
        
        TestDataFactory.getScheduleClassForBWPS_instructorPortalUserContactId();
        	test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Test.startTest();
            List<Schedule_Class_Line_Item__c> results = DNA_InstructorClass.instructorMonthData(3, 2);
            Test.stopTest();
            
    }
	@istest
    static void testgetAllFaqRecords(){
         Test.startTest();
        
        DNA_InstructorClass.getAllFaqRecords();
        Test.stopTest();
    }
    
   @istest
    static void testgetAllFaqRecords1(){
        TestDataFactory.getFAQTypeLogin();
        
        Test.startTest();
        List<FAQ__c> faqList = DNA_InstructorClass.getAllFaqRecords1('Login');
        Test.stopTest();
        
        System.assertEquals(1, faqList.size());
}

}