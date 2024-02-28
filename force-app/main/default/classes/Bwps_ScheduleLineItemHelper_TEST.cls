@isTest
private class Bwps_ScheduleLineItemHelper_TEST{
    static testMethod void testSendNotificationToguestUser() {
        test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());

        // Create test data
     TestDataFactory.InstructorsUser();


     /*   Schedule_Class_Line_Item__c testScheduleLineClass = new Schedule_Class_Line_Item__c(
            Name = 'Test Class',
            BWPS_Status__c = 'Deactive'
        );
        insert testScheduleLineClass;*/
        TestDataFactory.getScheduleClassLineItem();
         Schedule_Class_Line_Item__c testScheduleLineClass=[select id,Name, BWPS_Status__c from  Schedule_Class_Line_Item__c limit 1];
        testScheduleLineClass.BWPS_Status__c='Deactive';
        update testScheduleLineClass;

        // Call the helper method
        Test.startTest();
        Bwps_ScheduleLineItemHelper.sendNotificationToguestUser(new List<Schedule_Class_Line_Item__c>{testScheduleLineClass});
        Test.stopTest();

       
   


        
    }
}