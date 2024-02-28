@istest
public class CommunitiesSelfRegControllerGuestTest {
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
       	userExample.CommunityNickname='tester'; 
        //UserExample.UserRoleId=ur.Id;
       //userExample.ownerid =u.Id;
        insert userExample;
       User u1 = [select UserRole.Name from User where Id =: userExample.Id];
       System.debug('U--> '+u1);
        System.runAs(new User(Id=userExample.Id)){
          //List<Account> acc=new List<Account>();
          //CommunitiesSelfRegControllerGuest.isValidPassword('password','password');
     	CommunitiesSelfRegControllerGuest.registerUser(userExample.FirstName, userExample.LastName, userExample.Email, null, null, 'Member');
            CommunitiesSelfRegControllerGuest.registerUser(userExample.FirstName, userExample.LastName, userExample.Email, null, null, 'Guest');
        }//CommunityAuthController.sendWelcomeMail(userExample,(String)userExample.Id);
        
        
        
    }
}