@isTest
public class Bwps_PlayOnDemandHendler_TEST {
    
    @isTest
    static void TestcreateGetAttendee(){
        
        Attendee__c resultdata = TestDataFactory.getAttendee();
        System.debug('Id===> '+resultdata);
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        String result = Bwps_PlayOnDemandHendler.createGetAttendee(resultdata.Schedule_Class_Line_Item_del__c);
        Test.stopTest();
        
        System.debug('data==> '+result);
    }

}