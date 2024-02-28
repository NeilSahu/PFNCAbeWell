@isTest
private class BWPS_AchievementData_TEST {
    @istest
    static void getAllAchievements_TEST() {
        Attendee__c testAttendee=TestDataFactory.getAttendee();
        Id contactId =testAttendee.Attendee_Name_del__c;
        Test.setMock(HttpCalloutMock.class,new  MockHttpResponseGenerator());
        System.runAs(new User(Id=TestDataFactory.getPortalUser())){
            List<Attendee__c> attendees = BWPS_AchievementData.getAllAchievements();
            //System.assertEquals(testAttendee.Id, attendees[0].Id);
        }
    }
}