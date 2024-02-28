@isTest
public class BWPS_GuestMemberEvents_TEST {

    @isTest
    static void TestguestEvents(){
        
        //String resultId = TestDataFactory.getPortalUser();
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        System.runAs(u){
        	test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Test.startTest();
        	List<Schedule_Class_Line_Item__c> eventList = BWPS_GuestMemberEvents.guestEvents(1, 2);
        	Test.stopTest();
            
            System.assertEquals(0, eventList.size());
        }
        
    }
    
    @isTest
    static void TestguestEventsDateBetween(){
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        
        String startDate = string.valueOf(date.today());
        String endDate = string.valueOf(date.today());
        System.runAs(u){
            test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Test.startTest();
            List<Schedule_Class_Line_Item__c> results = BWPS_GuestMemberEvents.guestEventsDateBetween(startDate, endDate);
            Test.stopTest();
            
            System.assertEquals(1, results.size());
        }
    }
    
    @isTest
    static void TestguestEventsDateBetweenForElseCondition(){
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        
        String startDate = string.valueOf(Date.today());
        String endDate = string.valueOf(Date.today().addDays(5));
        System.runAs(u){
            test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Test.startTest();
            List<Schedule_Class_Line_Item__c> results = BWPS_GuestMemberEvents.guestEventsDateBetween(startDate, endDate);
            Test.stopTest();
            
            System.assertEquals(1, results.size());
        }
    }
    
    @isTest
    static void TestremoveClassFromCalendar(){
        
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        Attendee__c testAttendee=TestDataFactory.getAttendeeByContact(userContact);
        List<String> attendee = new List<String>();
        attendee.add(testAttendee.Schedule_Class_Line_Item_del__c);
        System.runAs(u){
            test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Test.startTest();
            String result = BWPS_GuestMemberEvents.removeClassFromCalendar(attendee);
            Test.stopTest();
        }
    }
    
    @isTest
    static void TestgetScheduleClass(){
        String resultId = TestDataFactory.getScheduleClass();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        Schedule_Class__c resultRecord = BWPS_GuestMemberEvents.getScheduleClass(resultId);
        Test.stopTest();
        
        System.assertEquals('30 Min', resultRecord.BWPS_ClassDuration__c);
    }
    
    @isTest
    static void TestenrolledA_Class(){
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        Schedule_Class__c result = TestDataFactory.getEnrolledClassByContactForScheduleClass(userContact);
        String resultId = result.Id;
        System.runAs(u){
            test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Test.startTest();
            String resultString = BWPS_GuestMemberEvents.enrolledA_Class(resultId);
            Test.stopTest();
            
            System.assertEquals('Already enroled in this class.', resultString);
        }
       
    }
    
    @isTest
    static void TestenrolledA_ClassForElseCondition(){
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        String result = TestDataFactory.getScheduleClassId();
        //String resultId = '';
        System.runAs(u){
            test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
            Test.startTest();
            String resultString = BWPS_GuestMemberEvents.enrolledA_Class(result);
            Test.stopTest();
            
            System.assertEquals('Success', resultString);
        }
       
    }
}