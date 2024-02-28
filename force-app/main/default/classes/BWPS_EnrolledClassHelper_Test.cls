@isTest
private class BWPS_EnrolledClassHelper_Test {
    @isTest static void testCreateAttendeesForEnrolled() {
        
              test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());

       TestDataFactory.getScheduleClassLineItem();
      TestDataFactory.getEnrolledClass();
              Schedule_Class_Line_Item__c testScheduleLineItem =[select id,LectureId__c, Schedule_Class__c from Schedule_Class_Line_Item__c limit 1 ];
        Enrolled_Class__c testEnrolledClass=[select id ,Attendee__c,Schedule_Class__c from Enrolled_Class__c limit 1];
         testEnrolledClass.Schedule_Class__c=testScheduleLineItem.Schedule_Class__c;
        update testEnrolledClass;
      
      
        Map<Id, Enrolled_Class__c> enrolledClassMap = new Map<Id, Enrolled_Class__c>{testEnrolledClass.Id => testEnrolledClass};
        BWPS_EnrolledClassHelper.CreateAttendeesForEnrolled(enrolledClassMap);
        
        // Verify the results
        Attendee__c[] attendees = [SELECT Attendee_Name_del__c, Schedule_Class_Line_Item_del__c, BWPS_Is_Enrolled__c, LectureId__c, Class_Status__c FROM Attendee__c];
        System.assertEquals(13, attendees.size());
        System.assertEquals(testEnrolledClass.Attendee__c, attendees[0].Attendee_Name_del__c);
        System.assertEquals(true, attendees[0].BWPS_Is_Enrolled__c);
        System.assertEquals(testScheduleLineItem.LectureId__c, attendees[0].LectureId__c);
        System.assertEquals('JOIN', attendees[0].Class_Status__c);
    }
}