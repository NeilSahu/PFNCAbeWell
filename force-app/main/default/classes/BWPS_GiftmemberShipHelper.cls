public without sharing class BWPS_GiftmemberShipHelper {
    @AuraEnabled
    Public static String creategiftMemberShip(object giftDetails, String Donationpay){
        String Returnstatus ='';
        ChargentOrders__ChargentOrder__c NewChargetnOrder = new ChargentOrders__ChargentOrder__c();
        String gatewayId ;
        String ChargentOrderId;
        try{
            String DonorRecordTypeId = Schema.SObjectType.contact.getRecordTypeInfosByName().get('Donor Record Type').getRecordTypeId();
            String MembershipRecordTypeId = Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get('Membership').getRecordTypeId();
            Contact createDonorContact = new Contact();
            Contact createGiftContact = new Contact();
            Account createDonorAccount = new Account();
            Account createGiftAccount = new Account();
            Opportunity CreateOpportunity = new Opportunity(); 
            Opportunity CreateOpportunityGift = new Opportunity(); 
            String DonorEmail ='';
            String DonorPhone ='';
            String GiftEmail ='';
            Decimal donationAmount = decimal.valueOf(Donationpay);
            //Decimal giftamount;
            String GiftPhone ='';
            String donorAccountId;
            String donorContactId;
            String GiftAccountId;
            String GiftContactId;
            Integer DonorSize;
            Integer GiftSize ;
            Map<Object,Object> giftDetailsCopy=(Map<Object,Object>)giftDetails ;
            System.debug('giftDetailsCopy' +giftDetailsCopy);
            Map<Object,Object>  giftinfoMap = (Map<Object,Object>)giftDetailsCopy.get('giftinfo');
            Map<Object,Object>  donorinfoMap = (Map<Object,Object>)giftDetailsCopy.get('donorinfo');
            DonorPhone = String.valueOf(donorinfoMap.get('phoneNumber'));
            DonorEmail = String.valueOf(donorinfoMap.get('Email'));
            GiftPhone = String.valueOf(giftinfoMap.get('phoneNumber'));
            GiftEmail = String.valueOf(giftinfoMap.get('Email'));
            List<Contact> DonorContact = [SELECT Id,Phone,Email,FirstName,lastName,AccountId FROM Contact WHERE Email =:DonorEmail];
            List<Contact> GiftContact = [SELECT Id,Phone,Email,FirstName,lastName,AccountId FROM Contact WHERE Email =:GiftEmail];
            GiftSize = GiftContact.size();
            DonorSize = DonorContact.size();
            //if(DonorSize == 0){
            System.debug('inside donor');
            String fullAccoutName = String.valueOf(donorinfoMap.get('Fname')) +' '+String.valueOf(donorinfoMap.get('LName'));
            createDonorAccount.Name = fullAccoutName;
            createDonorContact.RecordTypeId = DonorRecordTypeId;
            createDonorContact.FirstName = String.valueOf(donorinfoMap.get('Fname'));
            createDonorContact.LastName = String.valueOf(donorinfoMap.get('LName'));
            createDonorContact.Email = String.valueOf(donorinfoMap.get('Email'));
            createDonorContact.Phone = String.valueOf(donorinfoMap.get('phoneNumber'));
            createDonorContact.MailingState = String.valueOf(donorinfoMap.get('state'));
            createDonorContact.MailingCity = String.valueOf(donorinfoMap.get('city'));
            createDonorContact.MailingCountry = String.valueOf(donorinfoMap.get('country'));
            createDonorContact.MailingPostalCode = String.valueOf(donorinfoMap.get('postalCode'));
            createDonorContact.MailingStreet = String.valueOf(donorinfoMap.get('Street'));
            createDonorContact.BWPS_Gender__c = 'Male';
            if(DonorSize == 0){
                Database.insert(createDonorAccount,false);
                System.debug('createDonorAccount Id '+createDonorAccount.Id);
                createDonorContact.AccountId = createDonorAccount.Id;
                Database.Insert(createDonorContact,false); 
                System.debug('createDonorContact Id '+createDonorContact.Id);
                donorAccountId = createDonorAccount.Id;
                donorContactId = createDonorContact.Id;
            }
            else{
                donorAccountId = DonorContact[0].AccountId;
                donorContactId = DonorContact[0].Id;
            }         
            
            Date EndDate ;  
            Date EndDateyearly = System.today().addYears(1);
            Date EndDateOnce = System.today();
            if(String.valueOf(donorinfoMap.get('DonationType')) =='Once'){
                EndDate = EndDateOnce;                
            }
            else if(String.valueOf(donorinfoMap.get('DonationType')) =='Yearly'){
                EndDate = EndDateyearly;   
            }
            List<ChargentBase__Gateway__c> gateways = [SELECT ID ,Name,ChargentBase__Active__c FROM ChargentBase__Gateway__c WHERE ChargentBase__Active__c = true];
            If(gateways.size() > 0){
                gatewayId = gateways[0].Id;
                System.debug('gATEWAY id '+ gatewayId);
                //donationAmount = Decimal.valueOf((String)donorinfoMap.get('DonationAmount'));//decimal.valueOf(((String)donorinfoMap.get('DonationAmount')));
                NewChargetnOrder.ChargentOrders__Gateway__c = gatewayId ;
                NewChargetnOrder.ChargentOrders__Charge_Amount__c = donationAmount;
                NewChargetnOrder.ChargentOrders__Shipping__c = donationAmount;
                NewChargetnOrder.ChargentOrders__Tax__c  = 0;
                NewChargetnOrder.ChargentOrders__Subtotal__c = donationAmount;
                Insert NewChargetnOrder;
                ChargentOrderId = NewChargetnOrder.Id;
                System.debug('NewChargetnOrder '+NewChargetnOrder.Id);
                System.debug('ChargentOrderId '+ ChargentOrderId);
            }
            
            
            CreateOpportunity.Name = fullAccoutName;
            CreateOpportunity.CloseDate = System.today();
            CreateOpportunity.StageName = 'Pledged';
            CreateOpportunity.BWPS_Chargent_Order__c = ChargentOrderId;
            CreateOpportunity.AccountId = donorAccountId;
            CreateOpportunity.BWPS_DonationCode__c = '4027';
            CreateOpportunity.npsp__Primary_Contact__c = donorContactId;
            CreateOpportunity.Amount = donationAmount;//Integer.valueOf(donorinfoMap.get('DonationAmount'));
            CreateOpportunity.BWPS_Payment_End_Date__c = EndDate;
            Database.insert(CreateOpportunity,false);
            System.debug('CreateOpportunity Id '+CreateOpportunity.Id);
            //}
            //if(GiftSize == 0){
            System.debug('inside gift');
            String fullAccoutNameGift = String.valueOf(giftinfoMap.get('Fname')) +' '+String.valueOf(giftinfoMap.get('LName'));
            createGiftAccount.Name = fullAccoutNameGift;
            createGiftContact.FirstName = String.valueOf(giftinfoMap.get('Fname'));
            createGiftContact.LastName = String.valueOf(giftinfoMap.get('LName'));
            createGiftContact.Email = String.valueOf(giftinfoMap.get('Email'));
            createGiftContact.Phone = String.valueOf(giftinfoMap.get('phoneNumber'));
            createGiftContact.MailingState = String.valueOf(giftinfoMap.get('state'));
            createGiftContact.MailingCity = String.valueOf(giftinfoMap.get('city'));
            createGiftContact.MailingCountry = String.valueOf(giftinfoMap.get('country'));
            createGiftContact.MailingPostalCode = String.valueOf(giftinfoMap.get('postalCode'));
            createGiftContact.MailingStreet = String.valueOf(giftinfoMap.get('Street'));                    
            createGiftContact.BWPS_Gender__c = 'Male';
            
            
            if(GiftSize == 0){
                Database.insert(createGiftAccount,false);
                System.debug('createGiftAccount.Id '+createGiftAccount.Id);  
                createGiftContact.AccountId = createGiftAccount.Id;
                Database.Insert(createGiftContact,false); 
                System.debug('createGiftContact Id '+createGiftContact.Id);
                GiftAccountId = createGiftAccount.Id;
                GiftContactId = createGiftContact.Id;
            }
            else{
                GiftAccountId = GiftContact[0].AccountId;
                GiftContactId = GiftContact[0].Id;
            }
            
            Date EndDategift ;  
            Date EndDateyearlyGift = System.today().addYears(1);
            Date EndDateOnceGift = System.today();
            if(String.valueOf(giftinfoMap.get('GiftType')) =='Once'){
                EndDategift = EndDateOnceGift;                
            }
            else if(String.valueOf(giftinfoMap.get('GiftType')) =='Yearly'){
                EndDategift = EndDateyearlyGift;   
            }
            //giftamount = decimal.valueOf((String)donorinfoMap.get('GiftAmount'));//decimal.valueOf(((String)donorinfoMap.get('GiftAmount')));
            CreateOpportunityGift.RecordTypeId = MembershipRecordTypeId;
            CreateOpportunityGift.Name = fullAccoutNameGift;
            CreateOpportunityGift.CloseDate = System.today();
            CreateOpportunityGift.StageName = 'Pledged';
            CreateOpportunityGift.AccountId = GiftAccountId;
            CreateOpportunityGift.BWPS_DonationCode__c = '4027';
            CreateOpportunityGift.npsp__Primary_Contact__c = GiftContactId;
            CreateOpportunityGift.Amount = Integer.valueOf(donorinfoMap.get('GiftAmount'));
            CreateOpportunityGift.BWPS_Payment_End_Date__c = EndDategift;
            CreateOpportunityGift.npe01__Membership_Origin__c ='New';
            CreateOpportunityGift.npe01__Member_Level__c = 'Bronze';
            CreateOpportunityGift.npe01__Membership_Start_Date__c = System.today();
            CreateOpportunityGift.npe01__Membership_End_Date__c = EndDateyearlyGift;
            Database.insert(CreateOpportunityGift,false);
            System.debug('CreateOpportunityGift Id '+CreateOpportunityGift.Id);
            String returnId = CreateOpportunity.Id ;
            Returnstatus = returnId;
            //return 'Success';
            //}
        }
        Catch(Exception e){
            System.debug('Error Line '+ e.getLineNumber());
            System.debug('Erro message '+ e.getMessage());
            //String returnId = e.getMessage()+' '+ e.getLineNumber();
            String returnId ='Error';
            Returnstatus = returnId;
            //return 'Error';
        }
        return Returnstatus;
    }
    private static boolean isValidPassword(String password , String confirmPassword) {
        return password == confirmPassword;
    }
    @AuraEnabled
    public static String /*PageReference*/ registerUser( String firstName, String lastName, String email, String password, String confirmPassword ) {
        String ProfileIdMember = [SELECT ID from Profile WHERE Name = 'Member User' LIMIT 1].Id; 
        System.debug('ProfileIdMember>>> '+ProfileIdMember);
        String OwnerAssignId  = [select id,FirstName,LastName,profile.name,Username,UserRoleId,IsActive,Alias,TimeZoneSidKey,LocaleSidKey,EmailEncodingKey,LanguageLocaleKey	FROM user WHERE profile.Name = 'System Administrator' AND UserRoleId !=null LIMIT 1].Id;
        System.debug('OwnerAssignId>>> '+OwnerAssignId);
        if (!isValidPassword(password, confirmPassword)) {
            ApexPages.Message msg = new ApexPages.Message(ApexPages.Severity.ERROR, Label.site.passwords_dont_match);
            ApexPages.addMessage(msg);
            return null;
        }    
        String profileId ;
        String userAccountId;
        String UserContactId ;
        String conIdSet;
        String AccountIdSet;
        List<User> userList = [Select Id, Name,profile.Name,username,ContactId From User WHERE username = :email  LIMIT 1];
        list<Contact> condetail = new list<Contact>();        
        System.debug('userList '+userList);
        if(userList.size()>0){
            condetail = [SELECT Id,Name,AccountId FROM Contact WHERE Id =: userList[0].ContactId];
            UserContactId = condetail[0].Id;
            userAccountId =  condetail[0].AccountId;   
        }        
        System.debug('userAccountId '+userAccountId);
        System.debug('UserContactId '+UserContactId);
        
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
        if(userList.size() == 0){
            profileId = ProfileIdMember;
            System.debug('GuestUser>>> '+profileId);
            // To be filled in by customer.
            //String roleEnum = '00E3C0000010f1xUAA'; // To be filled in by customer.
            String accountId =NewuserAccunt.Id; // To be filled in by customer 0013C00000kTmsEQAS.
            String communityNickname = email.split('@')[0] + email.split('@')[1];
            String userName = email;
            User u = new User();
            u.Username = userName;
            u.Email = email;
            u.FirstName = firstName;
            u.LastName = lastName;
            u.CommunityNickname = communityNickname;
            u.ProfileId = profileId;
            u.ContactId = conIdSet;
            System.debug('userdebag @@@@@@@@@@@@@@@@@@@@@' + u);
            
            // Alias,TimeZoneSidKey,LocaleSidKey,EmailEncodingKey,LanguageLocaleKey
            
            String userId;
            try {
                //insert u;
                
                userId = Site.createExternalUser(u,accountId, password);
                if(Test.isRunningTest()){               
                    Id systemAdminProfileId = [SELECT Id FROM Profile WHERE Name = 'Partner Community User' LIMIT 1].Id;
                    user ur= [Select Id,Username from user where ProfileId=:systemAdminProfileId];
                    //userId=ur.Id;
                    username=ur.Username;
                }
                System.debug('userId>>> '+userId);
            } catch(Site.ExternalUserCreateException ex) {
                System.debug('>>>>>>Test'+ex.getDisplayMessages());
                return 'Error';
            }
            if (userId != null) { 
                System.debug('inside forget password');
                CommunityAuthController.forgotPassword(userId);
                return userId;
            }
        }
        else{
            String  userActive;
            String ProfileIdMemberupdate = [SELECT ID from Profile WHERE Name = 'Member User' LIMIT 1].Id; 
            User userdetails = [SELECT Id,Name, ProfileId,IsActive,username,ContactId,profile.Name FROM User WHERE Username =: email LIMIT 1];
            userdetails.ProfileId = ProfileIdMemberupdate;
            userdetails.IsActive = true;
            update userdetails;
            userActive = 'Updated';
            return userActive;
        }
        return '';
    }
}