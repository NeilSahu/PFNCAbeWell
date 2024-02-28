@isTest
public class BWPS_AttendeeEnrollmentController_TEST {
    
    @isTest
    public static void TestenrollUser(){
        
        String scheduleLineItemId = TestDataFactory.getScheduleClassLineItem();
        
        //Schedule_Class_Line_Item__c scLineItem = [SELECT Id, Schedule_Class__c FROM Schedule_Class_Line_Item__c WHERE Id = :scheduleLineItemId LIMIT 1];
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        String resultId = BWPS_AttendeeEnrollmentController.enrollUser(scheduleLineItemId);
        Test.stopTest();
        
        System.assertEquals(18, resultId.length());

    }
    
    @isTest
    public static void TestenrollUserByScheduleClass(){
        String ScheduleClassId = TestDataFactory.getScheduleClass();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        String resultId = BWPS_AttendeeEnrollmentController.enrollUserByScheduleClass(ScheduleClassId);
        Test.stopTest();
        
        System.assertEquals('YOU ENROLLED IN THIS CLASS', resultId);
    }

}