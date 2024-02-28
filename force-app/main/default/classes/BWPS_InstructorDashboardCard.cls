public class BWPS_InstructorDashboardCard {
    @AuraEnabled(cacheable=true)
     public static List<Schedule_Class__c> BWPS_GetInstructorClasses(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
      //   User u = [SELECT Id, ContactId FROM User WHERE Id =: UserId LIMIT 1];
      //   String ContactId = u.ContactId;
      //   System.debug('ContactId : '+ContactId);
         List<Schedule_Class__c> getInstructorClass=[Select Id,Name,Integrity__c,Class__c,BWPS_ClassFrequency__c,BWPS_EndTime__c,BWPS_instructor__r.Name,
                                                         Schedule_Days__c,BWPS_Date__c,BWPS_StartTime__c from Schedule_Class__c 
                                                         WHERE BWPS_instructor__c = '0033C00000akQKlQAM' order by Name , BWPS_StartTime__c desc];
        System.debug('ins'+getInstructorClass);
        return getInstructorClass;
     }
}