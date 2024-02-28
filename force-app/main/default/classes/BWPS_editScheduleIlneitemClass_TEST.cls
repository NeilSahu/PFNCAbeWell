@isTest
public class BWPS_editScheduleIlneitemClass_TEST {

    @isTest
    static void TestScheduleLineItemClassDetails(){
        
        String resultId = TestDataFactory.getScheduleClassLineItem();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        Schedule_Class_Line_Item__c ScheduleLineItemClass = BWPS_editScheduleIlneitemClass.ScheduleLineItemClassDetails(resultId);
        Test.stopTest();
        System.debug(ScheduleLineItemClass);
    }
    
    @isTest
    static void TestScheduleClassEdit(){
        
        String ScheduleClassData = '{"StartDate": "2022-01-01", "StartTime": "11:00", "EndTime": "12:00"}';
        
        String ScheduleClassId = TestDataFactory.getScheduleClassLineItem();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
     
        Test.startTest();
        String message = BWPS_editScheduleIlneitemClass.ScheduleClassEdit(ScheduleClassData, ScheduleClassId);
        Test.stopTest();
    }
}