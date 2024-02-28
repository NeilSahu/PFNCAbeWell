public class BWPS_GuestUserDashboardClass {
 @AuraEnabled
    public static List<Schedule_Class_Line_Item__c> BWPS_GuestUserDashboardMethod(){
        List<Map<String,List<Schedule_Class_Line_Item__c>>> events= new List<Map<String,List<Schedule_Class_Line_Item__c>>>();
        
        List<Schedule_Class_Line_Item__c >ListOfSchClassLineItem = [ Select id,Name,BWPS_ClassDate__c,BWPS_ClassDay__c,BWPS_Status__c, Schedule_Class__r.BWPS_Date__c,Schedule_Class__r.BWPS_StartTime__c from Schedule_Class_Line_Item__c ];
        return ListOfSchClassLineItem;
    }
}