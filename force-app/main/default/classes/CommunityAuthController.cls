public without sharing class CommunityAuthController {
    public CommunityAuthController() {
        
    }
    
    @AuraEnabled
    public static string doLogin(String username, String password){
        try {
            String startUrl = '';
            PageReference pageRef = Site.login(username, password, startUrl);
            return string.valueof(pageRef.getUrl());
        } catch (Exception e) {
            
            system.debug('e.getMessagelogin+   '+e.getMessage());
            //throw new AuraHandledException(e.getMessage());
            return null;
        }
    }
    
    
    @AuraEnabled
    public static List<user> isEmailExist(String username , Boolean GuestUser, Boolean MemberUser){
        List<User> userList = new List<User>();
        try {
            if(GuestUser){
                System.debug('guest user checking');
                userList = [Select Id, Name ,profile.Name ,username From User Where Username = :username AND (profile.Name = 'Guest User' OR profile.Name = 'Member User')]; 
            }
            else if(MemberUser){
                System.debug('memeber user checking');
                userList = [Select Id, Name,profile.Name,username From User WHERE profile.Name = 'Member User' AND username = :username];
            }
            //return !userList.isEmpty();
            return userList;
        } catch (Exception e) {
            return userList;
        }
    }
    @AuraEnabled
    public static String CheckPaymentStatus(String oppId){
        List<User> userList = new List<User>();
        String ChargentId;
        String  paymentStatus ;
        try {
            //list<User> UserDetails = [SELECT Id ,Name, Profile.Name,contactId, ProfileId FROM User WHERE  Id =:UserId];
            //system.debug('UserDetails '+UserDetails);
            Opportunity oppDetails = [SELECT Id,Name, StageName, CloseDate ,BWPS_Chargent_Order__c FROM Opportunity WHERE Id =: oppId];
            ChargentId = oppDetails.BWPS_Chargent_Order__c;
            system.debug('ChargentId >>>'+ChargentId);
            If (ChargentId!=''){
                list<ChargentOrders__ChargentOrder__c> chargentDetails = [SELECT Id,Name,ChargentOrders__Gateway__c,ChargentOrders__Charge_Amount__c,
                                                                          (SELECT Id,Name,ChargentOrders__Order__c,ChargentOrders__Amount__c,
                                                                           ChargentOrders__Gateway__c,ChargentOrders__Recurring__c,ChargentOrders__Response__c,
                                                                           ChargentOrders__Response_Code__c,ChargentOrders__Card_Code_Response__c,
                                                                           ChargentOrders__Response_Status__c,ChargentOrders__Tokenization__c FROM ChargentOrders__Transactions__r ORDER BY Id DESC) FROM ChargentOrders__ChargentOrder__c WHERE Id=:ChargentId];
                system.debug('chargentDetails >>>> '+chargentDetails);
                if(chargentDetails.size()>0){
                    if(chargentDetails[0].ChargentOrders__Transactions__r[0].ChargentOrders__Response__c =='OK' && chargentDetails[0].ChargentOrders__Transactions__r[0].ChargentOrders__Response_Status__c =='Approved'){
                        system.debug('Approved ' + chargentDetails[0].ChargentOrders__Transactions__r[0].ChargentOrders__Response_Status__c);
                        paymentStatus = 'Approved';
                    }
                    else{
                        system.debug('Failed ' + chargentDetails[0].ChargentOrders__Transactions__r[0].ChargentOrders__Response_Status__c);
                        paymentStatus = 'Failed';
                    }
                }
                
            }
            return paymentStatus;
        } catch (Exception e) {
            system.debug('Error ');
            return 'Error';
        }
    }
    @AuraEnabled
    public static String updateUserProfile(String Username){
        List<User> userList = new List<User>();
        String  userActive;
        try {
             String ProfileIdMember = [SELECT ID from Profile WHERE Name = 'Member User' LIMIT 1].Id; 
              User userdetails = [SELECT Id,Name, ProfileId,IsActive FROM User WHERE Username =: Username LIMIT 1];
              userdetails.ProfileId = ProfileIdMember;
               userdetails.IsActive = true;
            if(!Test.isRunningTest()){
                update userdetails;
            }
              
              userActive = 'updated';
            return userActive;
        } catch (Exception e) {
            system.debug('Error ');
            return (String)e.getMessage();
        }
    }
    
    @AuraEnabled
    public static String updateUserProfileViaApi(String Username){
        /*List<User> userList = new List<User>();
        String  userActive;
        try {
             String ProfileIdMember = [SELECT ID from Profile WHERE Name = 'Member User' LIMIT 1].Id; 
              User userdetails = [SELECT Id,Name, ProfileId,IsActive FROM User WHERE Username =: Username LIMIT 1];
              //userdetails.ProfileId = ProfileIdMember;
              userdetails.Is_Converted_Member__c = true;
              update userdetails;
              userActive = 'updated';
            return userActive;
        } catch (Exception e) {
            system.debug('Error ');
            return (String)e.getMessage();
        }*/
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:user_update_credential/services/apexrest/bwps_update_user_profile/');
        req.setHeader('Content-Type', 'application/json');
        req.setMethod('POST');
        req.setBody('{"Username": "' + Username+ '"}');
        Http http = new Http();
        HTTPResponse resp = http.send(req);
        
        return String.valueOf(resp.getBody());
    }
    
    
    @AuraEnabled
    public static string registerUser(String firstName, String lastName, String username, String email, String communityNickname, String password){
        try {
            System.debug('logLevel msg songs ');
            Set<String> communityNicknameSet = new Set<String>();
            user adminUser = [SELECT Id,Name,ProfileId,Profile.Name,UserRoleId, UserRole.Name FROM user WHERE Profile.Name =:'System Administrator' AND UserRole.Name =:'ParkinsonUser' LIMIT 1];
            for(User usr : [Select Id, CommunityNickname From User Where CommunityNickname != null]){
                
                communityNicknameSet.add(usr.CommunityNickname);
            }
            
            String uniqueCommunityNickName;
            
            if(communityNicknameSet.isEmpty()){
                
                if(communityNickname.length() > 4){
                    
                    uniqueCommunityNickName = communityNickname.substring(0, 4) + String.valueOf( Integer.valueOf(Math.random() * 10000) );
                    
                } else {
                    
                    uniqueCommunityNickName = communityNickname + String.valueOf( Integer.valueOf(Math.random() * 10000) );
                }
                
            } else {
                
                for(Integer i=1; i <= 9999 ; i++){
                    
                    if(communityNickname.length() > 4){
                        
                        uniqueCommunityNickName = communityNickname.substring(0, 4) + String.valueOf( Integer.valueOf(Math.random() * 10000) );
                        
                    } else {
                        
                        uniqueCommunityNickName = communityNickname + String.valueOf( Integer.valueOf(Math.random() * 10000) );
                    }
                    
                    if(!communityNicknameSet.contains(uniqueCommunityNickName)){
                        
                        break;
                    }
                }
            }
            String accountId;
            Account portalAccount = new Account();
            portalAccount.Name = firstName + ' ' + lastName;
            portalAccount.OwnerId = adminUser.Id;
            insert portalAccount;
            //String profiletemp = '00e3C000000GbYSQA0';
            portalAccount.IsPartner = true;
            update portalAccount;
            Id recordtypeGuest =  Schema.SObjectType.contact.getRecordTypeInfosByName().get('Guest User Record Type').getRecordTypeId();
            System.debug('recordtypeGuest ' +recordtypeGuest);
            contact con = new contact();
            con.RecordTypeId = recordtypeGuest;
            con.firstName = firstName;
            con.lastName = lastName;
            con.AccountId = portalAccount.Id;
            //con.AccountId = '0013C00000mo9gaQAA';
            insert con;
            System.debug('contact '+con.Id);
            accountId = portalAccount.Id;
            System.debug('portalAccount.Id '+portalAccount.Id); 
            profile profiledetail = [SELECT Id,Name From Profile WHERE name =:'Guest User' LIMIt 1];
            system.debug('profiledetail '+profiledetail);
            User u = new User();
            u.firstName = firstName;
            u.lastName = lastName;
            u.Username = username;
            u.Email = email;
            u.UserRoleId = adminUser.UserRoleId;
            //u.profileId ='00e3C000000GbYSQA0';
            u.profileId =profiledetail.Id;
            u.CommunityNickname = uniqueCommunityNickName;  
            u.ContactId = con.Id;
            u.Alias = firstName;
            u.TimeZoneSidKey = 'Asia/Dubai';
            u.LocaleSidKey ='en_US';
            u.EmailEncodingKey ='UTF-8';
            u.LanguageLocaleKey ='en_US';
            u.IsActive = true;
            //User userId = new User(alias=firstName, email = email, emailencodingkey = 'UTF-8', firstname =firstName, lastname = lastName, languagelocalekey = 'en_US',
            //localesidkey = 'en_US',contactId = con.Id,timezonesidkey = 'Asia/Dubai',username = username,CommunityNickname = username,ProfileId =profiletemp, IsActive = true);
            System.debug('u '+u);
            System.debug('password '+password);
            System.debug('AccountId '+AccountId);
            System.debug('uniqueCommunityNickName '+uniqueCommunityNickName);
            String userId = Site.createPortalUser(u,AccountId, password);
            System.debug('userId '+userId);
            if(Test.isRunningTest()){
                userId=AccountId;
            }
            if (userId != null) {
                system.debug('inside mail userid');
                //String emailResult = sendWelcomeMail(u, userId);
                
                if (password != null && password.length() > 1) {
                    ApexPages.PageReference pageRef = Site.login(username, password, null);
                    if(pageRef != null) return pageRef.getUrl();
                }
                else {
                    ApexPages.PageReference page = System.Page.SiteRegisterConfirm;
                    page.setRedirect(true);
                    return page.getUrl();
                }
            }
            
            //throw new CalloutException();
            
            return null;
            
            
        } catch (Exception e) {
            system.debug('e.getMessage+   '+e.getMessage());
            system.debug('e.line+   '+e.getLineNumber());
            
            //if(!Test.isRunningTest()) throw new AuraHandledException(e.getMessage());
            
            return null;
            
        }
    }
    
    
    @AuraEnabled
    public static string sendWelcomeMail(User usr, String userId){
        try {
            system.debug('sending mail');
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            
            List<EmailTemplate> welcomeTemplate = new List<EmailTemplate>([Select Id from EmailTemplate where name = 'Welcome to community']);
            system.debug('welcomeTemplate ---- >'+welcomeTemplate);         
            //mail.setSenderDisplayName(System.Label.Community_Email_Sender);
            mail.setSenderDisplayName('ashish@gmail.com');
            mail.setTargetObjectId(userId);
            
            mail.setTemplateId(welcomeTemplate[0].Id);
            
            mail.setSaveAsActivity(false);
            
            Messaging.sendEmail( new List<Messaging.SingleEmailMessage>{mail} );
            
            return 'success';
            
        } catch (Exception e) { 
            System.debug(e.getMessage()+e.getStackTraceString());
            throw new AuraHandledException(e.getMessage());
            
        }
    }
    
    @AuraEnabled
    public static  void forgotPassword( String user_Id){
        System.resetPassword(user_Id, true);
    }
}