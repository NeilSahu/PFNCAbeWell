@isTest
public class BWPS_ScheduleClassHelperClassTest {
	@istest
    static void testCreateOneTimeScheduleLineItem(){
        Id i=TestDataFactory.getScheduleClass();
        List<Schedule_Class__c> lis=[Select Id,RecordTypeId,Schedule_Days__c,Vimeo_External_Key__c,BWPS_Date__c,BWPS_ClassFrequency__c,Name,Schedule_Type__c,Integrity__c,BWPS_EndTime__c,BWPS_StartTime__c,BWPS_Status__c from Schedule_Class__c where Id =:i];
        System.debug('testCreateOneTimeScheduleLineItem--'+lis);
         Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator());
        Test.startTest();
       
        BWPS_ScheduleClassHelperClass.CreateOneTimeScheduleLineItem(lis);
        Test.stopTest();
    }
    @istest
    static void testCreateScheduleClassLineItem(){
		Id i=TestDataFactory.getScheduleClass();
       List<Schedule_Class__c>newList=[Select Id,BWPS_Date__c,BWPS_ClassFrequency__c,Schedule_Days__c,Name,Schedule_Type__c,BWPS_StartTime__c,BWPS_EndTime__c,Integrity__c,Vimeo_External_Key__c from Schedule_Class__c where Id=:i];
        
        Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator());   
        BWPS_ScheduleClassHelperClass.CreateScheduleClassLineItem(newList);
        
              
    }
    
    
    static testMethod void testUpdateScheduleLineItems() {
        Id i=TestDataFactory.getScheduleClass();
        List<Schedule_Class__c> lis=[Select Id,RecordTypeId,Schedule_Days__c,Vimeo_External_Key__c,BWPS_Date__c,BWPS_ClassFrequency__c,Name,Schedule_Type__c,Integrity__c,BWPS_EndTime__c,BWPS_StartTime__c,BWPS_Status__c from Schedule_Class__c where Id =:i];
        
        System.debug('lis---'+lis);
       Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator());   
        Map<Id,Schedule_Class__c> updateMap = new Map<Id,Schedule_Class__c>();
        updateMap.put(lis[0].Id, lis[0]);
         
        List<Schedule_Class__c> lis1 = new List<Schedule_Class__c>();
        lis1.add(lis[0].clone());
        lis1[0].Schedule_Days__c = 'Sunday;Saturday';
        Map<Id,Schedule_Class__c> oldUpdateMap = new Map<Id,Schedule_Class__c>();
        oldUpdateMap.put(lis[0].Id, lis1[0]);
        BWPS_ScheduleClassHelperClass.UpdateScheduleLineItems(updateMap, oldUpdateMap);
        
        
      
    
    }
}