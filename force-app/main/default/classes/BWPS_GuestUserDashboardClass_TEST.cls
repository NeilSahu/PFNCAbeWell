@isTest
public class BWPS_GuestUserDashboardClass_TEST {

    @isTest
    static void TestBWPS_GuestUserDashboardMethod(){
        
       TestDataFactory.getScheduleClassLineItem(); 
       test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
       Test.startTest();
       List<Schedule_Class_Line_Item__c > ListOfSchClassLineItem =  BWPS_GuestUserDashboardClass.BWPS_GuestUserDashboardMethod();
	   Test.stopTest();
    }
}