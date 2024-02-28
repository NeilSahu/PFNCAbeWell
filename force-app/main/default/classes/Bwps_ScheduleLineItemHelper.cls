public class Bwps_ScheduleLineItemHelper {
    public static void sendNotificationToguestUser(List<Schedule_Class_Line_Item__c> scheduleLineClasses){
      //  SET< Messaging.CustomNotification> customNotifications = new SET< Messaging.CustomNotification>();
      	String userName = [select Id , Name from user where Id =: userinfo.getuserid() limit 1].Name;
        Id typeId = [SELECT Id FROM CUstomNotificationType WHERE MasterLabel = 'User Class Notification'].Id;
        for(Schedule_Class_Line_Item__c sclineclass :scheduleLineClasses){
            if(sclineclass.BWPS_Status__c == 'Deactive'){
            Messaging.CustomNotification notification = new Messaging.CustomNotification();
            notification.setBody('Your Class '+sclineclass.Name + ' is cancelled !');
            notification.setTitle(userName);
            notification.setSenderId(Userinfo.getUserId());
            notification.setNotificationTypeId(typeId );
            notification.setTargetId('a0u3C000001eJMjQAM'); // target object id
            notification.send(new Set<String> {'0053C00000589phQAA'}); // target user id.
            }
        }
      
    }
    
}