@isTest
public class BWPS_GuestUserHistoryClass_TEST {

    
 	/*@testSetup 
    static void setup(){
        TestDataFactory.getContact();
        User us = TestDataFactory.createPortalUser();

        Attendee__c testAttendee=new Attendee__c(
            Attendee_Name_del__c = us.ContactId,
            Class_Status__c='COMPLETED',
            Description__c='Attendee Description',
            BPWS_Favourite__c=True,
            BWPS_Is_Enrolled__c=True,
            Is_Present__c='Not Marked',
            LectureId__c='Lecture Id',
            Schedule_Class_Line_Item_del__c=TestDataFactory.getScheduleClassLineItem(),
            BWPS_WatchedTimeStamp__c='Attendee Watched Time'
        );
        insert testAttendee;

        Date today = Date.today();
       	TestDataFactory.getScheduleClass();
        //TestDataFactory.getAttendee();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
    }*/
    
	@isTest
    static void TestBWPS_GetClassHistory(){
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        User us = [Select Id from User where Username = 'exxcvbnyyyyyyyyyybvcmailtest@test.com'];
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        system.runAs(us){
        Test.startTest();
        List<Attendee__c> results = BWPS_GuestUserHistoryClass.BWPS_GetClassHistory(10,0);
        Test.stopTest();
 
        }
       
    }
    
    @isTest
    static void TestBWPS_GetClassCount(){
        
        Test.startTest();
        List<Attendee__c> results = BWPS_GuestUserHistoryClass.BWPS_GetClassCount();
        Test.stopTest();
        
        
    }
    
    @isTest
    static void TestBWPS_GetUpcomingClasses(){
        Test.startTest();
        List<Schedule_Class_Line_Item__c> results = BWPS_GuestUserHistoryClass.BWPS_GetUpcomingClasses('0:0:0','0:0:0','Test');
        Test.stopTest();
        
        Assert.isNotNull(results);
    }
    
    @isTest
    static void TestBWPS_MyClasses(){
        Test.startTest();
        List<Schedule_Class_Line_Item__c> results = BWPS_GuestUserHistoryClass.BWPS_MyClasses(0,0);
        Test.stopTest();
        
       
    }
    
    @isTest
    static void TestFetchRecordType(){
        Test.startTest();
        list<class__c> results = BWPS_GuestUserHistoryClass.FetchRecordType();
        Test.stopTest();
        
        
    }
    
    @isTest
    static void TestfetchContactDetail(){
        Test.startTest();
        list<class__c> results = BWPS_GuestUserHistoryClass.fetchContactDetail('test');
        Test.stopTest();
        
       
    }
}