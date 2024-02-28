@isTest
public class ZoomIntegrationClass_TEST {

    @isTest
    static void TestrefreshAccessToken(){
        
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();
        ZoomIntegrationClass.refreshAccessToken();
        Test.stopTest();
        
    }
    
    @isTest
    static void TestcreateClassroomMeetingOnZoom(){
        
        String getScheduleClassLineItemId = TestDataFactory.getScheduleClassLineItem();
        
        List<Id> scliIds = new List<Id>();
        scliIds.add(getScheduleClassLineItemId);
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        ZoomIntegrationClass.createClassroomMeetingOnZoom(scliIds);
        Test.stopTest();
    }
    
    @isTest
    static void TestcustomMetadataMethod(){
        
        Test.startTest();
        ZoomIntegrationClass.customMetadataMethod();
        Test.stopTest();
    }
    
    @isTest
    static void TestgetClassroomLink(){
        String getScheduleClassLineItemId = TestDataFactory.getScheduleClassLineItem();
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        List<Schedule_Class_Line_Item__c> results = [SELECT Id, Name FROM Schedule_Class_Line_Item__c WHERE Id =: getScheduleClassLineItemId];
        
        Test.startTest();
        ZoomIntegrationClass.getClassroomLink(results);
        Test.stopTest();
        
    }
    
    @isTest
    static void TestupdateClassroomMeetingOnZoom(){
        
        List<Id> scliIds = new List<Id>();
        String getScheduleClassLineItemId = TestDataFactory.getScheduleClassLineItem();
        scliIds.add(getScheduleClassLineItemId);
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        //ZoomIntegrationClass.firstcall = true;
        Test.startTest();
        ZoomIntegrationClass.updateClassroomMeetingOnZoom(scliIds);
        Test.stopTest();
        
    }
    
    @isTest
    static void TestcreateZoomUser(){
        
        List<Id> getUser = new List<Id>();
        
        String getUserId = TestDataFactory.getUser();
        getUser.add(getUserId);
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        ZoomIntegrationClass.createZoomUser(getUser);
        Test.stopTest();
    }
    
    @isTest
    static void TestgetSignature(){
        Test.startTest();
        String result = ZoomIntegrationClass.getSignature('abc123', 'abc123');
        Test.stopTest();
        
        System.assertEquals(44, result.length());
    }
}