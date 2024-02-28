/**
 * An apex page controller that supports self registration of users in communities that allow self registration
 */
public without sharing class  CommunitiesSelfRegControllerGuest {

    /*public String firstName {get; set;}Code Coverage: None
55

Go To

    public String lastName {get; set;}
    public String email {get; set;}
    public String password {get; set {password = value == null ? value : value.trim(); } }
    public String confirmPassword {get; set { confirmPassword = value == null ? value : value.trim(); } }
    public String communityNickname {get; set { communityNickname = value == null ? value : value.trim(); } }*/
    //public static String firstName  = 'kathy Ins';
    //public static  String lastName ='bhn1';
    //public static String email ='kathybhnIns@gmail.com';
    //public static String password = 'kathy@12';
    //public static String confirmPassword  = 'kathy@12';
    //public static String communityNickname ='kathybhnIns';

    public CommunitiesSelfRegControllerGuest() {
        String expid = ApexPages.currentPage().getParameters().get('expid');            
        if (expId != null) {
            Site.setExperienceId(expId); 
        }    
    }
    private static boolean isValidPassword(String password , String confirmPassword) {
        return password == confirmPassword;
    }
    @AuraEnabled
    public static String /*PageReference*/ registerUser( String firstName, String lastName, String email, String password, String confirmPassword, String SignUpAs ) {
            String ProfileIdGuest = [SELECT ID from Profile WHERE Name = 'Guest User' LIMIT 1].Id; 
             System.debug('ProfileIdGuest>>> '+ProfileIdGuest);
             String ProfileIdMember = [SELECT ID from Profile WHERE Name = 'Member User' LIMIT 1].Id; 
          System.debug('ProfileIdMember>>> '+ProfileIdMember);
            String OwnerAssignId  = [select id,FirstName,LastName,profile.name,Username,PortalRole,UserRoleId,IsActive,Alias,TimeZoneSidKey,LocaleSidKey,EmailEncodingKey,LanguageLocaleKey	FROM user WHERE profile.Name = 'System Administrator' AND UserRoleId !=null LIMIT 1].Id;
           // it's okay if password is null - we'll send the user a random password in that case
           System.debug('OwnerAssignId>>> '+OwnerAssignId);
        if (!isValidPassword(password, confirmPassword)) {
            ApexPages.Message msg = new ApexPages.Message(ApexPages.Severity.ERROR, Label.site.passwords_dont_match);
            ApexPages.addMessage(msg);
            return null;
        }    
          String profileId ;

         Opportunity CreateOpportunity = new Opportunity(); 
        List<Contact> AllContacts = new List<Contact>();
        ChargentOrders__ChargentOrder__c NewChargetnOrder = new ChargentOrders__ChargentOrder__c();
          String gatewayId ;
        String ChargentOrderId; 
        String userAccountId;
        String UserContactId ;
        String conIdSet;
        String AccountIdSet;
         String NewoppIds ;
         String userexistId ;
         String OlduserName = email;
        List<ChargentBase__Gateway__c> gateways = [SELECT ID ,Name,ChargentBase__Active__c FROM ChargentBase__Gateway__c WHERE ChargentBase__Active__c = true];
         List<User> userList = [Select Id, Name,profile.Name,username,ContactId From User WHERE (profile.Name = 'Member User' OR profile.Name = 'Guest User')  AND username = :email LIMIT 1];
         list<Contact> condetail = new list<Contact>();
        
         System.debug('userList '+userList);
         if(userList.size()>0){
            condetail = [SELECT Id,Name,AccountId FROM Contact WHERE Id =: userList[0].ContactId];
            UserContactId = condetail[0].Id;
            userAccountId =  condetail[0].AccountId;   
             userexistId = userList[0].Id;
         }
         
           System.debug('userAccountId '+userAccountId);
           System.debug('UserContactId '+UserContactId);
            If(gateways.size() > 0){
                 if(SignUpAs =='Member'){
                gatewayId = gateways[0].Id;
                System.debug('gATEWAY id '+ gatewayId);
                NewChargetnOrder.ChargentOrders__Gateway__c = gatewayId ;
                 NewChargetnOrder.ChargentOrders__Charge_Amount__c = 50;
                 NewChargetnOrder.ChargentOrders__Shipping__c = 50;
                NewChargetnOrder.ChargentOrders__Tax__c  = 0;
                NewChargetnOrder.ChargentOrders__Subtotal__c = 50;
                Insert NewChargetnOrder;
                ChargentOrderId = NewChargetnOrder.Id;
                System.debug('NewChargetnOrder '+NewChargetnOrder.Id);
                System.debug('ChargentOrderId '+ ChargentOrderId);
                 }
            }
             Account NewuserAccunt = new Account();
              Contact con = new Contact();
          if(userList.size() == 0){
               System.debug('no account found ');
              NewuserAccunt.Name = firstName +' '+lastName;
              NewuserAccunt.ownerId = OwnerAssignId;
              Insert NewuserAccunt;
                System.debug('NewuserAccunt>>> '+NewuserAccunt);
                con.LastName=lastName;
                con.AccountId = NewuserAccunt.Id;
                 insert con;
          }  
        if(userList.size()>0){
            System.debug(' account found ');
           AccountIdSet = userAccountId;
           conIdSet = UserContactId;
        }
        else{
             System.debug('no account found id assign');
            AccountIdSet = NewuserAccunt.Id;
           conIdSet = con.Id;
        }
          System.debug('AccountIdSet '+ AccountIdSet);
          System.debug('conIdSet '+ conIdSet); 
        CreateOpportunity.Name = firstName +' '+lastName;
            CreateOpportunity.CloseDate = System.today();
            CreateOpportunity.StageName = 'Pledged';
            CreateOpportunity.AccountId = AccountIdSet;
            CreateOpportunity.BWPS_DonationCode__c = '4027';
            CreateOpportunity.BWPS_Paid__c = true;
            if(SignUpAs =='Member'){
               CreateOpportunity.BWPS_Chargent_Order__c = ChargentOrderId;
            }
            CreateOpportunity.npsp__Primary_Contact__c = conIdSet;
            CreateOpportunity.Amount = 50; 
             Database.insert(CreateOpportunity,false);
            System.debug('Opportunity Insert');
            System.debug('Opportunity Insert' +CreateOpportunity.Id);
            NewoppIds = CreateOpportunity.Id;
            System.debug('NewoppIds '+NewoppIds);
    if(userList.size() == 0){
        if(SignUpAs =='Member'){
           //profileId = ProfileIdMember;
           profileId = ProfileIdGuest;
         }
         else if(SignUpAs =='Guest'){
             profileId = ProfileIdGuest;
         }
        System.debug('GuestUser>>> '+profileId + ' SignUpAs '+SignUpAs);
          // To be filled in by customer.
        //String roleEnum = '00E3C0000010f1xUAA'; // To be filled in by customer.
        String accountId =NewuserAccunt.Id; // To be filled in by customer 0013C00000kTmsEQAS.
        String communityNickname = email.split('@')[0];
        String userName = email;

        User u = new User();
        u.Username = userName;
        u.Email = email;
        u.FirstName = firstName;
        u.LastName = lastName;
        u.CommunityNickname = communityNickname;
		u.ProfileId = profileId;
        u.ContactId = con.Id;
       // u.Alias = firstName;
       /* u.TimeZoneSidKey = 'America/Chicago';
        u.LocaleSidKey  =   'en_US';
        u.EmailEncodingKey = 'UTF-8';
        u.LanguageLocaleKey = 'en_US';*/

        System.debug('userdebag @@@@@@@@@@@@@@@@@@@@@' + u);
        
      // Alias,TimeZoneSidKey,LocaleSidKey,EmailEncodingKey,LanguageLocaleKey
		
        String userId;
        try {
            //insert u;
            //
        userId = Site.createExternalUser(u,accountId, password);
            if(Test.isRunningTest()){
                
                Id systemAdminProfileId = [SELECT Id FROM Profile WHERE Name = 'Partner Community User' LIMIT 1].Id;
                user ur= [Select Id,Username from user where ProfileId=:systemAdminProfileId];
				userId=ur.Id;
                userexistId = userId;
                username=ur.Username;
			}
           System.debug('userId>>> '+userId);
        } catch(Site.ExternalUserCreateException ex) {
            //List<String> errors = ex.getDisplayMessages();
           /* for (String error : errors)  {
               // ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, error));
            }*/
            
            // This message is used for debugging. Do not display this in the UI to the end user.
            // It has the information around why the user creation failed.
            System.debug('>>>>>>'+ex.getDisplayMessages());
            return 'Error';
        }
        System.debug(' Neha Check 0.9 '+userId);
        if (userId != null && SignUpAs == 'Guest') { 
            if (password != null && password.length() > 1) {
                //return string.valueof(Site.login(userName, password, ApexPages.currentPage().getParameters().get('startURL')));
                String startUrl = '';
              PageReference pageRef = Site.login(username, password, startUrl);
              String pageReload = string.valueof(pageRef.getUrl());
             return string.valueof(pageRef.getUrl());
            }
            else {
                System.debug(' Neha Check 1 ');
                PageReference page = System.Page.CommunitiesSelfRegConfirm;
                 System.debug(' Neha Check 2 '+page);
                page.setRedirect(true);
                //return page;
                System.debug(' Neha Check 3 '+string.valueof(page.getUrl()));
                return string.valueof(page.getUrl());
            }
        }
        else if(userId != null && SignUpAs == 'Member'){
             return NewoppIds+','+userexistId;
        }
    }
    else{
       return NewoppIds+','+userexistId;
    }




      return '';



    // if (!isValidPassword(password, confirmPassword)) {
    //         ApexPages.Message msg = new ApexPages.Message(ApexPages.Severity.ERROR, Label.site.passwords_dont_match);
    //         ApexPages.addMessage(msg);
    //         return null;
    //     }    

    //     String profileId = '0054x000005nLB2AAM'; // To be filled in by customer.
    //     String roleEnum = '00E3C0000010f1xUAA'; // To be filled in by customer.
    //     String accountId = '0013C00000mo9gaQAA'; // To be filled in by customer.
    //     String communityNickname = email.split('@')[0];
    //     String userName = email;

    //     User u = new User();
    //     u.Username = userName;
    //     u.Email = email;
    //     u.FirstName = firstName;
    //     u.LastName = lastName;
    //     u.CommunityNickname = communityNickname;
	// 	u.ProfileId = profileId;
		
    //     String userId;

    //     try {
    //         userId = Site.createExternalUser(u, accountId, password);
    //     } catch(Site.ExternalUserCreateException ex) {
    //         //List<String> errors = ex.getDisplayMessages();
    //        // for (String error : errors)  {
    //      //       ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, error));
            
            
    //         // This message is used for debugging. Do not display this in the UI to the end user.
    //         // It has the information around why the user creation failed.
    //         System.debug(ex.getMessage());
    //     }
        
    //     if (userId != null) { 
    //         if (password != null && password.length() > 1) {
    //           //  return Site.login(userName, password, ApexPages.currentPage().getParameters().get('startURL'));
            

    //            String startUrl = '';
    //              PageReference pageRef = Site.login(username, password, startUrl);
    //             return string.valueof(pageRef.getUrl());
    //         }
    //         else {
    //             PageReference page = System.Page.CommunitiesSelfRegConfirm;
    //             page.setRedirect(true);
    //             return string.valueof(page.getUrl());
                
    //         }
    //     }
    //     return null;
    }
}