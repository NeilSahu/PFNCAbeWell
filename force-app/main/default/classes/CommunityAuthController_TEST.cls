@istest
public class CommunityAuthController_TEST {
    @istest
    public Static void main(){
        Account a = new Account();
        a.name='testify';
        
        
        insert a;
        contact c =  new contact(LastName='testify con',AccountId=a.Id);
        Insert c;
        
        
        Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator());     
        UserRole ur = [SELECT Id FROM UserRole Where name = 'ParkinsonUser'];
        
        Id systemAdminProfileId = [SELECT Id FROM Profile WHERE Name = 'Partner Community User' LIMIT 1].Id;
        Id systemAdmin = [SELECT Id FROM Profile WHERE Name = 'System Administrator' LIMIT 1].Id;
        // user u=[Select Id from user where ProfileId=:systemAdmin];
        
        User userExample = new User();
        userExample.Username = 'exxcvbnbvcxzmailtest@test.com';
        userExample.FirstName = 'First';
        userExample.LastName = 'Last';
        userExample.Alias = 'Alihgas';
        userExample.Email = 'emailtest@test.com';
        userExample.TimeZoneSidKey = 'America/New_York';
        userExample.LocaleSidKey = 'en_CA';
        userExample.EmailEncodingKey = 'UTF-8';
        userExample.ProfileId = systemAdminProfileId;
        userExample.LanguageLocaleKey = 'en_US';
        userExample.ContactId=c.Id;
        userExample.CommunityNickname='test5576'; 
        //UserExample.UserRoleId=ur.Id;
        //userExample.ownerid =u.Id;
        insert userExample;
        User u1 = [select UserRole.Name from User where Id =: userExample.Id];
        System.debug('U--> '+u1);
        System.runAs(new User(Id=userExample.Id)){
            //List<Account> acc=new List<Account>();
            CommunityAuthController.isEmailExist(userExample.Username, false, false);
            CommunityAuthController.doLogin(userExample.Username,'123456');
            
            if(!Test.isRunningTest()){
                CommunityAuthController.forgotPassword(userExample.Id);
            }   
                     
            CommunityAuthController.registerUser('First','Last',userExample.Username,userExample.Email,userExample.CommunityNickname,'123456');
            CommunityAuthController.registerUser('First','Last',userExample.Username,userExample.Email,userExample.CommunityNickname,null);
            //CommunityAuthController();
        }//CommunityAuthController.sendWelcomeMail(userExample,(String)userExample.Id);   
    }
    @isTest 
    static void CheckPaymentStatus_TEST() {
        CommunityAuthController.CheckPaymentStatus(TestDataFactory.getOpportunity());
    }
    @isTest 
    static void updateUserProfile_TEST() {
        User portalUser=[select UserName from User where Id=:TestDataFactory.getPortalUser()];
        Test.setMock(HttpCallOutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
		String result=CommunityAuthController.updateUserProfile(portalUser.UserName);  
        Test.stopTest();
        System.assertEquals('updated', result);
    }
    
    @isTest 
    static void updateUserProfileViaApi_TEST() {
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        String result=CommunityAuthController.updateUserProfileViaApi('abcd');
        Test.stopTest();
        System.assertEquals('{"ics":"123456"}',result );
    }
    
    @isTest 
    static void sendWelcomeMail_TEST() {
		EmailTemplate e = new EmailTemplate (developerName = 'Welcome_to_community', FolderId = userInfo.getUserId(), TemplateType= 'Text', Name = 'Welcome to community',isActive=true); // plus any other fields that you want to set
insert e;
         
        // Call the method and verify that it sends the email
        Test.startTest();
        String result = CommunityAuthController.sendWelcomeMail(new User(Id=UserInfo.getUserId()), UserInfo.getUserId());
        Test.stopTest();
        // Verify that the email was sent successfully
        System.assertEquals('success', result);
    }
}