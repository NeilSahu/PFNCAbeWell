@isTest
public class ZoomWebhookController_TEST {

    @isTest
    static void TestdoPost(){
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();
        
        req.addHeader('httpMethod', 'POST');
        req.requestUri = '/services/apexrest/takeAttendence/*';
        String postData = '{"payload":{"plainToken":"qgg8vlvZRS6UYooatFL8Aw"},"event_ts":1654503849680,"event":"endpoint.url_validation"}';
        req.requestBody = Blob.valueof(postData);
        RestContext.request = req; 
        RestContext.response= res;
        Test.startTest();
        ZoomWebhookController.doPost();
        Test.stopTest();
    }
    
    @isTest
    static void TestdoPostForElseCondition(){
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();
        
        req.addHeader('httpMethod', 'POST');
        req.requestUri = '/services/apexrest/takeAttendence/*';
        String postData = '{"payload":{"account_id":"QtYS6-UJTqSoFmxi7vkvog","object":{"uuid":"hUhrvZurT8GCugXa/4LSRg==","participant":{"user_id":"16789504","user_name":"Harvey Herscovitch","registrant_id":"oT3w1TqrSUO-DffStLAwgg","id":"oT3w1TqrSUO-DffStLAwgg","join_time":"2023-02-26T16:55:31Z","email":"harveyhers@optonline.net","participant_uuid":"aTG1zU0uSMaNE9LV2DNvDw"},"id":"88645908550","type":8,"topic":"Sunday - PFNCA Exercise for Parkinsons - Malca","host_id":"RlmV6mreRjiahBefFj16BQ","duration":60,"start_time":"2023-02-26T15:51:44Z","timezone":"America/New_York"}},"event_ts":1677430533954,"event":"meeting.participant_joined"}';
        req.requestBody = Blob.valueof(postData);
        RestContext.request = req; 
        RestContext.response= res;
        Test.startTest();
        ZoomWebhookController.doPost();
        Test.stopTest();
    }
    
    @isTest
    static void TestdoGet(){
        Test.startTest();
        String result = ZoomWebhookController.doGet();
        Test.stopTest();
        
        System.assertEquals('Zoom working in get', result);
    }
    
}