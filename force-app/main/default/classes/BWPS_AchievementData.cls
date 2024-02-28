public without sharing class BWPS_AchievementData {
    @AuraEnabled
    public static List<Attendee__c> getAllAchievements(){
        List<Attendee__c> AllAttendees = new List<Attendee__c>();
        String userId = UserInfo.getUserId(); 
        user userDetail = New user();
        String contId = '';
        if(userId !='' && userId !=null){
            userDetail = [SELECT ID,ContactId FROM User WHERE Id =:userId];
            contId = userDetail.ContactId;
        }      
        try {
            //AllAchievements = [SEELCT Id,OwnerId,Points__c,Contact__c,Name,BWPS_Type_c__c FROM Achievement__c WHERE ];
            AllAttendees = [SELECT Id,Attendee_Name_del__c,Is_Present__c,Schedule_Class_Line_Item_del__c,Name,BWPS_WatchedTimeStamp__c 
                            FROM Attendee__c 
                            WHERE (Is_Present__c ='Present' AND Attendee_Name_del__c =:contId) OR (BWPS_WatchedTimeStamp__c != null  AND Attendee_Name_del__c =:contId)];
            return AllAttendees;
        } catch (Exception e) {
            Return AllAttendees;
        }
    }
}