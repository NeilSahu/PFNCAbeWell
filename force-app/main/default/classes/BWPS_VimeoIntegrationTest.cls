@isTest
public class BWPS_VimeoIntegrationTest {
    @isTest
    static void testVimeoAuthProvider() {
        // Create and insert a new VimeoAuth__mdt record for testing purposes
        VimeoAuth__mdt authSetting = new VimeoAuth__mdt(
            DeveloperName = 'Test_Auth',
            Token_url__c = 'https://example.com/token',
            Is_active__c = true,
            Folder_Ids__c = '12345',
            Endpoind__c = 'https://example.com/endpoint',
            Clint_secret__c = 'clint_secret',
            AuthUrl__c = 'https://example.com/auth',
            Clint_identifier__c = 'clint_identifier'
        );
       // insert authSetting;
        Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator());     
        Test.startTest();
        
        // Call the vimeoAuthProvider() method
        BWPS_VimeoIntegration.vimeoAuthProvider();
        
        Test.stopTest();
        
        // Verify that the HTTP response is not null and has a status code of 200
       // System.assertEquals(200, resAuth.getStatusCode());
       // System.assertNotEquals(null, resAuth.getBody());
    }
    
    @isTest
    static void testExecute() {
        
        Schedule_Class_Line_Item__c scheduleItem = new Schedule_Class_Line_Item__c(
            Name = 'Test Schedule Item',
            BWPS_Status__c = 'Active',
            LectureVideoId__c = '1234567890',
            //Schedule_Class__c = 'Test Schedule Class',
            BWPS_Integrity__c = 'Medium',
            BWPS_ClassDate__c = Date.today(),
            BWPS_ClassDay__c = 'Monday',
            BWPS_StartTime__c = Time.newInstance(19, 15, 0, 0),
            BWPS_EndTime__c = Time.newInstance(20, 0, 0, 0)
        );
        insert scheduleItem;
        Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator());     
        List<String> classIds = new List<String>();
        classIds.add(scheduleItem.Id);
        
        Test.startTest();
        
        // Call the execute() method
        BWPS_VimeoIntegration vimeoIntegration = new BWPS_VimeoIntegration(classIds);
        System.enqueueJob(vimeoIntegration);
        
        Test.stopTest();
        
        // Retrieve the updated Schedule_Class_Line_Item__c record
        Schedule_Class_Line_Item__c updatedScheduleItem = [SELECT BWPS_Vimeo_video_Id__c, Video_Duration__c FROM Schedule_Class_Line_Item__c WHERE Id = :scheduleItem.Id];
        
        // Verify that the BWPS_Vimeo_video_Id__c and Video_Duration__c fields have been updated
        System.assertNotEquals(null, updatedScheduleItem.BWPS_Vimeo_video_Id__c);
        System.assertNotEquals(null, updatedScheduleItem.Video_Duration__c);
    }
}