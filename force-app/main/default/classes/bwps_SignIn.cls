public class bwps_SignIn {
	  @AuraEnabled
    	public static string doLogin(String username, String password){
        try {
                String startUrl = '';               
                PageReference pageRef = Site.login(username, password, startUrl);
                return string.valueof(pageRef.getUrl());
        } catch (Exception e) {
     		return string.valueof(e.getMessage());
        }
    }

}