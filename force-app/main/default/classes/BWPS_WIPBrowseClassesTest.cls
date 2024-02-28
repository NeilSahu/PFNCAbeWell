@isTest
public class BWPS_WIPBrowseClassesTest {
	
    @isTest
    static void testGetAllInstructors() {
        // Create a test record type for contact object
        /*RecordType rt = new RecordType();
        rt.Name = 'Instructor Record Type';
        rt.SObjectType = 'Contact';
        insert rt;*/
        //RecordType rt = [Select Name, Id From RecordType where sObjectType='Contact'];
        
        /*String contactId = TestDataFactory.getContact();
        Contact c = [SELECT Id, Name, BWPS_Type__c FROM Contact WHERE Id=:contactId];*/
        TestDataFactory.getContact();
        
        Test.startTest();
        List<Contact> result = BWPS_WIPBrowseClasses.getAllInstructors();
        Test.stopTest();
        
        System.assertEquals(1, result.size());
        /*System.assertEquals(1, result.size());
        System.assertEquals(c.Id, result[0].Id);
        System.assertEquals(c.Name, result[0].Name);
        System.assertEquals(c.BWPS_Type__c, result[0].BWPS_Type__c);*/
    }
    
    @isTest
    static void testGetAllClasses() {
       
        String classId = TestDataFactory.getClass();
        Class__c testClass = [SELECT Id, Name, Description__c FROM Class__c WHERE Id =:classId];
        
        Test.startTest();
        List<Class__c> result = BWPS_WIPBrowseClasses.getAllClasses();
		Test.stopTest();
        // Verify results
        System.assertEquals(1, result.size());
        System.assertEquals('Test Class', result[0].Name);
        System.assertEquals('Test description', result[0].Description__c);
    }
    
    @isTest
    static void getScheduleClassRecords(){
        List<Schedule_Class__c> scheduleClasses = new List<Schedule_Class__c>();
        
        /*String ScheduleId = TestDataFactory.getScheduleClass();
        Schedule_Class__c scheduleClass = [SELECT Id,Name,Schedule_Type__c,Integrity__c,BWPS_instructor__c,BWPS_EndTime__c,BWPS_StartTime__c,BWPS_Date__c,BWPS_Description__c,Class__r.Id,Class__r.Name,BWPS_instructor__r.Id,BWPS_instructor__r.Name,BWPS_instructor__r.npe01__WorkEmail__c FROM Schedule_Class__c WHERE Id =:ScheduleId];
        scheduleClasses.add(scheduleClass);*/
        TestDataFactory.getScheduleClass();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        List<Schedule_Class__c> results = BWPS_WIPBrowseClasses.getScheduleClassRecords();
		Test.stopTest();
                
        System.assertEquals(1, results.size());
    }
    
    @isTest
    static void TestgetAllLineItems(){
        
        TestDataFactory.getScheduleClassLineItem();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        List<Schedule_Class_Line_Item__c> lineItemList = BWPS_WIPBrowseClasses.getAllLineItems();
        Test.stopTest();
        System.debug('lineItemList869 '+lineItemList);
        System.assertEquals(1, lineItemList.size());
    }
    
    @isTest
    static void TestgetAllFavLineItems(){
        
        TestDataFactory.getScheduleClassLineItem();
        TestDataFactory.getEntitySubscriptionEsContact();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        List<Schedule_Class_Line_Item__c> lineItemList = BWPS_WIPBrowseClasses.getAllFavLineItems();
        Test.stopTest();
        
        System.assertEquals(0, lineItemList.size());
    }
    
    @isTest
    static void TestgetScheduleLiveClassRecords(){
        
        TestDataFactory.getScheduleClass();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        List<Schedule_Class__c> results = BWPS_WIPBrowseClasses.getScheduleLiveClassRecords();
        Test.stopTest();
        
        System.assertEquals(1, results.size());
    }
    
    @isTest
    static void TestgetWibResources(){
        
        TestDataFactory.getBWPSResource();
        
        Test.startTest();
        List<BWPS_Resource__c> results = BWPS_WIPBrowseClasses.getWibResources();
        Test.stopTest();
        
        System.assertEquals(1, results.size());
    }
    
}