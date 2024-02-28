@isTest
public class BWPS_InstructorDashboardCard_TEST {


    @isTest
    static void TestBWPS_GetInstructorClasses(){
        
        TestDataFactory.getScheduleClassForBWPS_instructor();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        List<Schedule_Class__c> getInstructorClass = BWPS_InstructorDashboardCard.BWPS_GetInstructorClasses();
        Test.stopTest();
        
    }
}