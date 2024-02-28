@isTest
public class Bwps_getuserNotification_TEST {
	@isTest
    public static void getUserNotification_TEST(){
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        Bwps_getuserNotification.getUserNotification();
        Test.stopTest();
    }
    @isTest
    public static void markAsRead_TEST(){
        Bwps_getuserNotification.markAsRead('{"Deposit":{"Id":"depositId"}}');
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        Bwps_getuserNotification.markAsRead('{"Deposit":{"Id":"depositId"}}');
        Test.stopTest();
    }
}