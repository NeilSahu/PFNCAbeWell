@isTest
public class scheduleLineItemHelperTest {
    @isTest
    static void testupdatePlayondemanddureation(){
        Id i=TestDataFactory.getScheduleClassLineItem();
        List<Schedule_Class_Line_Item__c> lis=[Select Id,LectureVideoId__c from Schedule_Class_Line_Item__c where Id=:i];
         List<Schedule_Class_Line_Item__c> lis1=new List<Schedule_Class_Line_Item__c>();
        lis1.add(lis[0].clone());
        lis1[0].LectureVideoId__c='LV002';
        Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator()); 
        Map<Id,Schedule_Class_Line_Item__c> newMap=new Map<Id,Schedule_Class_Line_Item__c>();
        newMap.put(lis[0].Id, lis[0]);
         Map<Id,Schedule_Class_Line_Item__c> oldMap=new Map<Id,Schedule_Class_Line_Item__c>();
        oldMap.put(lis[0].Id, lis1[0]);
        scheduleLineItemHelper.updatePlayondemanddureation(newMap,oldMap);
    }

}