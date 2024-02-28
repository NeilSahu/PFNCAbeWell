@isTest
public class BWPS_InsDashTakeAttendanceClass_TEST {

    @isTest
    static void TestBWPS_GetUser(){
        
        //String resultId = TestDataFactory.getScheduleClassLineItem();
        Attendee__c result = TestDataFactory.getAttendee();
        System.debug('result==> '+result);
        Schedule_Class_Line_Item__c schln = [SELECT Id, BWPS_ClassDate__c FROM Schedule_Class_Line_Item__c WHERE Id =:result.Schedule_Class_Line_Item_del__c];
        System.debug('["Attendee":{"scheduleId":"","attendance":"","Attendeeid":"+"}] ==> '+schln);
        String schlnDate = string.valueof(schln.BWPS_ClassDate__c);
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        List<Attendee__c> AttendRec = BWPS_InsDashboardTakeAttendanceClass.BWPS_GetUser(schln.Id, schlnDate);
        Test.stopTest();
    }
    
    @isTest
    static void TestBWPS_GetAttendance(){
        
        Attendee__c result = TestDataFactory.getAttendee();
        
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        String resultData = JSON.serialize(result);
        String attendeeData = '{"request":[{"Attendeeid":"' + result.Id + '","attendance":true}, {"Attendeeid":"' + result.Id + '","attendance":false}]}';
        Test.startTest();
        String resultString = BWPS_InsDashboardTakeAttendanceClass.BWPS_GetAttendance(attendeeData);
        Test.stopTest();
    }
    
    
    @isTest
    static void TestBWPS_GetFilterUsers(){
        
        //RecordType guestUserRecordType = [SELECT Id FROM RecordType WHERE SObjectType = 'Contact' AND DeveloperName = 'Guest_User'];
        //RecordType clientRecordType = [SELECT Id FROM RecordType WHERE SObjectType = 'Contact' AND DeveloperName = 'Client'];
        Contact contact1 = new Contact(FirstName = 'John', LastName = 'Doe');
        Contact contact2 = new Contact(FirstName = 'Jane', LastName = 'Smith');
        insert new List<Contact>{contact1, contact2};
        List<String> availableIds = new List<String>{contact1.Id};

        Test.startTest();
        List<Contact> result = BWPS_InsDashboardTakeAttendanceClass.BWPS_GetFilterUsers('J', availableIds);
        Test.stopTest();
        
    }
    
    
    @isTest
    static void TestBWPS_GetAttendeeFromCon(){
        
        Attendee__c result = TestDataFactory.getAttendee();
        System.debug('result===> '+result);
        Schedule_Class_Line_Item__c schln = [SELECT Id, BWPS_ClassDate__c FROM Schedule_Class_Line_Item__c WHERE Id =:result.Schedule_Class_Line_Item_del__c];
        String schlnDate = string.valueof(schln.BWPS_ClassDate__c);
        Contact con = [SELECT Id, Name FROM Contact WHERE Id =: result.Attendee_Name_del__c];
        String JSONConId = '[{"Id": "'+result.Attendee_Name_del__c+'", "field": "Test Field"}]';
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        List<Attendee__c> resultData = BWPS_InsDashboardTakeAttendanceClass.BWPS_GetAttendeeFromCon(schln.Id,schlnDate, JSONConId);
        Test.stopTest();
        
    }
    
    @isTest
    static void TestBWPS_GetAttendeeName(){
        
        Attendee__c result = TestDataFactory.getAttendee();
        List<String> Ids = new List<String>();
        Ids.add(result.Id);
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        List<Attendee__c> results = BWPS_InsDashboardTakeAttendanceClass.BWPS_GetAttendeeName(Ids);
        Test.stopTest();
    }
}