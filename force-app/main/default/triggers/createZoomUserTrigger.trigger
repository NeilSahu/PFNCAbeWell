trigger createZoomUserTrigger on User (after update, after insert, before update) {
	List<Id> userIdList = new List<Id>();
    for(User u : Trigger.new){
        userIdList.add(u.Id);
    }
    if(Trigger.isAfter){
        if(Trigger.isUpdate){
            UserTriggerController.userUpdation(Trigger.new , Trigger.oldMap);
        }
        if(Trigger.isInsert){
            UserTriggerController.userCreateDateHandler(userIdList);
            ZoomIntegrationClass.createZoomUser(userIdList);
        }
    }
    if(Trigger.isBefore){
        if(Trigger.isUpdate){
            //UserTriggerController.userUpdation(Trigger.new , Trigger.oldMap);
            //ZoomIntegrationClass.createZoomUser(userIdList);
        }
        if(Trigger.isInsert){
            //ZoomIntegrationClass.createZoomUser(userIdList);
        }
    }
    
}