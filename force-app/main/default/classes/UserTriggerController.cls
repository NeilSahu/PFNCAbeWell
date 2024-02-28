public class UserTriggerController {
	public static void userUpdation(List<User> userNewList, Map<Id,User> userOldMap){
        System.debug('userNewList-> >>>>>>>>>>'+userNewList[0].ProfileId);
        System.debug('userNewList-> >>>>>>>>>>'+userNewList[0].Profile.Name);
        System.debug('userOldMap-> >>>>>>>>>>'+userOldMap.get(userNewList[0].Id).ProfileId);
        System.debug('userOldMap-> >>>>>>>>>>'+userOldMap.get(userNewList[0].Id).Profile.Name);
        for(User newUser : userNewList){
            User oldUser = userOldMap.get(newUser.Id);
            if(oldUser != null){
                if(oldUser.Profile.Name != newUser.Profile.Name && newUser.Profile.Name == 'Member User'){
                    newUser.isMember__c = true;
                    newUser.MemberPassDate__c = Date.ValueOf(System.today());
                }
            }
        }
    }
    
    @future
    public static void userCreateDateHandler(List<Id> userIdList){
        List<User> userList = [Select Id, Name, FirstName, LastName, Email, isMember__c, MemberPassDate__c,Profile.Name From User where Id IN :userIdList ];
        for(User u : userList){
            if(u.Profile.Name == 'Member User'){
                u.isMember__c = true;
            }
            u.MemberPassDate__c = Date.ValueOf(System.today());
        }
        update userList;
    }

}