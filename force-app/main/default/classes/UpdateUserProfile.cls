@RestResource(urlMapping='/bwps_update_user_profile/*')
global class UpdateUserProfile {
    @HttpPost
    global static string updateUser(){
        String requestBody = RestContext.request.requestBody.toString();
        
        Map<string, object> userMap = (Map<string, object>)Json.deserializeUntyped(requestBody);
        try{
            List<User> users = [SELECT Id , ProfileId FROM User WHERE UserName =:(String)userMap.get('Username') Limit 1 ];
            List<Profile> profiles = [SELECT Id,Name FROM Profile WHERE Name='Member User' LIMIT 1];
            If(users.size()>0){
                update new user(Id=users[0].Id , ProfileId=profiles[0].Id);
                return 'Profile Updated Successfully';
            }
            else
                return 'User Not Found';
        } catch(Exception e){
            
            return e.getMessage();
        }
        
    }
    
}