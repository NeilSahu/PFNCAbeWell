public with sharing class sendNotificationController {
    
    @AuraEnabled
    public static List<Profile> getProfileList() {
        return [SELECT Id, Name FROM Profile];
    }

    @AuraEnabled
    public static String sendNotification(String ProfileName , String notificationMsg) {
       try {
        String userName ='';
        Set<String> userIds = new Set<String>();
        List<user> userList  = [SELECT Id , Name from user WHERE (Id =: userinfo.getuserid() OR Profile.Name =:ProfileName) AND isActive = true];
        for(User u:userList){
            if(u.Id == userinfo.getuserid()){
                userName = u.name;
            } else {
                userIds.add(u.Id);
            }
        }
        Id typeId = [SELECT Id FROM CUstomNotificationType WHERE MasterLabel = 'User Class Notification'].Id;
        Messaging.CustomNotification notification = new Messaging.CustomNotification();
        notification.setBody(notificationMsg);
        notification.setTitle(userName);
        notification.setSenderId(Userinfo.getUserId());
        notification.setNotificationTypeId(typeId );
        notification.setTargetId(userinfo.getuserid()); // target object id
        notification.send(userIds); // target user id.
        return 'Success.';
    }
   catch(Exception e){
        System.debug('EEEE>> '+e.getMessage()+' >>>> '+e.getLineNumber());
        return e.getMessage();
    }
  }
}