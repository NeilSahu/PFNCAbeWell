@isTest
public class BWPS_AttendeeHelperClass_TEST {
    @isTest
    static void testCreateAttendee(){
        Id i=TestDataFactory.getEnrolledClass();
        List<Enrolled_Class__c> lis=[Select Id,Schedule_Class__c,Attendee__c from Enrolled_Class__c where Id=:i];
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        
        BWPS_AttendeeHelperClass.CreateAttendee(lis);
        test.stopTest();
    }
   
}