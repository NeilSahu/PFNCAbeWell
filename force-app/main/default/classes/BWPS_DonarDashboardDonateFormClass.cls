public without sharing class BWPS_DonarDashboardDonateFormClass {
    @Auraenabled
    Public Static Opportunity BWPS_CreateDonations(object DataMap , String HonneePhoto){
        System.debug('start create donations');
        System.debug('HonneePhoto '+HonneePhoto);
        Opportunity CreateOpportunity = new Opportunity(); 
        List<Contact> AllContacts = new List<Contact>();
        ChargentOrders__ChargentOrder__c NewChargetnOrder = new ChargentOrders__ChargentOrder__c();
        String ContactId;
        String OppContact;
        String OppAccount;
        String donationId ;
        String gatewayId ;
        String ChargentOrderId;
        try{
            String UserId = UserInfo.getUserId();
            System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
            list<User> userDetails = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
            System.debug('userDetails 1'+ userDetails);
            System.debug('userDetails.ContactId 2 '+ userDetails[0].ContactId);
            if(userDetails.size()>0){
                ContactId = userDetails[0].ContactId;
                System.debug('ContactId 3 '+ContactId);
            }
        
            Id recordtypeDonor =  Schema.SObjectType.contact.getRecordTypeInfosByName().get('Donor Record Type').getRecordTypeId();
            System.debug('recordtypeDonor '+recordtypeDonor);
    
            //if(GlobalVariables.oneTimecall ==false){
            Contact conUopdate = new Contact();    
            Account AccountCreate = new Account();
            Map<Object,Object> DataMapCopy=(Map<Object,Object>)DataMap ;
            System.debug('DataMapCopy' +DataMapCopy);
            Map<Object,Object>  contactDetailsMap= (Map<Object,Object>)DataMapCopy.get('ContactDetails');
            conUopdate.RecordTypeId = recordtypeDonor;
            conUopdate.firstName = String.valueOf(contactDetailsMap.get('firstName'));
            conUopdate.lastName = String.valueOf(contactDetailsMap.get('lastName'));
            conUopdate.Email = String.valueOf(contactDetailsMap.get('Email'));
            conUopdate.Phone = String.valueOf(contactDetailsMap.get('Phone'));
            AllContacts = [SELECT ID,AccountId,Name,Email,Phone FROM Contact WHERE Email =:conUopdate.Email AND Phone=:conUopdate.Phone LIMIT 1];
                //System.Debug('AllContacts.Id '+AllContacts.Id);
                //System.Debug('AllContacts.AccountId '+AllContacts.AccountId);
            conUopdate.MailingState = String.valueOf(contactDetailsMap.get('MailingState'));
            conUopdate.MailingCity = String.valueOf(contactDetailsMap.get('MailingCity'));
            conUopdate.MailingCountry = String.valueOf(contactDetailsMap.get('MailingCountry'));
            conUopdate.MailingPostalCode = String.valueOf(contactDetailsMap.get('MailingPostalCode'));
            conUopdate.MailingStreet = String.valueOf(contactDetailsMap.get('MailingStreet'));
            conUopdate.BWPS_Gender__c = 'Male';
            String fullName = String.valueOf(contactDetailsMap.get('firstName')) +' '+ String.valueOf(contactDetailsMap.get('lastName'));
            AccountCreate.Name = fullName;
            AccountCreate.BillingStreet = String.valueOf(contactDetailsMap.get('MailingStreet'));
            AccountCreate.BillingCity = String.valueOf(contactDetailsMap.get('MailingCity'));
            AccountCreate.BillingState = String.valueOf(contactDetailsMap.get('MailingState'));
            AccountCreate.BillingPostalCode = String.valueOf(contactDetailsMap.get('MailingPostalCode'));
            AccountCreate.BillingCountry = String.valueOf(contactDetailsMap.get('MailingCountry'));
            Integer Matchedcontacts = AllContacts.size();
            System.debug('record:>>>>>>>>>>>'+conUopdate);
                System.debug('Matchedcontacts '+Matchedcontacts);
            if(Matchedcontacts==0){
                System.debug('insdie not matched');
                Database.Insert(conUopdate,false);
                Database.Insert(AccountCreate,false);
                OppAccount = AccountCreate.Id;
                OppContact = conUopdate.Id;          
                System.debug('contact Insert'+conUopdate.Id);
            }
            else if(Matchedcontacts>0){
                System.debug('insdie  matched');
                OppAccount = AllContacts[0].AccountId;
                OppContact = AllContacts[0].Id; 
                System.debug('Matchedcontacts '+Matchedcontacts);
            }
            date myDate = System.today();
            date EndDate = myDate.addYears(2);
            String DonatorName  = contactDetailsMap.get('firstName') +' '+contactDetailsMap.get('lastName');
            String tributeType = String.valueOf(contactDetailsMap.get('tributetype'));
            String selectedtributetype = '' ;
            if(tributeType == 'Honor'){
                selectedtributetype = 'Honor';
            }
            else if(tributeType == 'Memorial'){
                   selectedtributetype = 'Memorial';
            }
            Map<Object,Object> DonationDetailsMap= (Map<Object,Object>)DataMapCopy.get('DonationDetails');
            List<ChargentBase__Gateway__c> gateways = [SELECT ID ,Name,ChargentBase__Active__c FROM ChargentBase__Gateway__c WHERE ChargentBase__Active__c = true];
            If(gateways.size() > 0){
                gatewayId = gateways[0].Id;
                System.debug('gATEWAY id '+ gatewayId);
                NewChargetnOrder.ChargentOrders__Gateway__c = gatewayId ;
                NewChargetnOrder.ChargentOrders__Charge_Amount__c = decimal.valueOf(((String)DonationDetailsMap.get('Amounts')));
                 NewChargetnOrder.ChargentOrders__Shipping__c = decimal.valueOf(((String)DonationDetailsMap.get('Amounts')));
                NewChargetnOrder.ChargentOrders__Tax__c  = 0;
                NewChargetnOrder.ChargentOrders__Subtotal__c =decimal.valueOf(((String)DonationDetailsMap.get('Amounts')));
                 NewChargetnOrder.ChargentOrders__Payment_Title__c = String.valueOf(contactDetailsMap.get('HonoreeName'));
                NewChargetnOrder.ChargentOrders__Payment_Descriptor__c = String.valueOf(contactDetailsMap.get('RecipientEmail'));
                NewChargetnOrder.ChargentOrders__Description__c	='4027';
                Insert NewChargetnOrder;
                ChargentOrderId = NewChargetnOrder.Id;
                System.debug('NewChargetnOrder '+NewChargetnOrder.Id);
                System.debug('ChargentOrderId '+ ChargentOrderId);
            }
            CreateOpportunity.Name = DonatorName;
            CreateOpportunity.CloseDate = System.today();
            CreateOpportunity.StageName = 'Pledged';
            CreateOpportunity.AccountId = OppAccount;
            CreateOpportunity.BWPS_DonationCode__c = '4027';
            CreateOpportunity.BWPS_Paid__c = true;
            CreateOpportunity.BWPS_Chargent_Order__c = ChargentOrderId;
            CreateOpportunity.npsp__Primary_Contact__c = OppContact;
            CreateOpportunity.BWPS_Payment_Method__c = String.valueOf(DonationDetailsMap.get('PaymentMethod'));
            CreateOpportunity.Amount = decimal.valueOf(((String)DonationDetailsMap.get('Amounts')));
            CreateOpportunity.npsp__Tribute_Type__c = selectedtributetype;
            CreateOpportunity.npsp__Honoree_Name__c = String.valueOf(contactDetailsMap.get('HonoreeName'));
            CreateOpportunity.npsp__Notification_Message__c = String.valueOf(contactDetailsMap.get('HonoreeDescription'));
            CreateOpportunity.npsp__Notification_Recipient_Name__c = String.valueOf(contactDetailsMap.get('RecipientName'));
            CreateOpportunity.npsp__Notification_Recipient_Information__c = String.valueOf(contactDetailsMap.get('RecipientAddress'));
            CreateOpportunity.npsp__Notification_Recipient_Email__c = String.valueOf(contactDetailsMap.get('RecipientEmail'));
            Database.insert(CreateOpportunity,false);
            System.debug('Opportunity Insert');
            System.debug('Opportunity Insert' +CreateOpportunity.Id);

            if(HonneePhoto != null && HonneePhoto != ''){
                ContentVersion cv = new ContentVersion();
                cv.Title = DonatorName;
                cv.PathOnClient = 'HonneePhoto.jpg';
                cv.VersionData = (Blob)EncodingUtil.base64Decode(HonneePhoto);//Blob.valueOf('Test Content');
                cv.IsMajorVersion = true;
                Insert cv;
                
                System.debug('content version insert '+ cv.Id);
                
                //Create ContentDocumentLink 
                Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
                ContentDocumentLink cdl = New ContentDocumentLink();
                cdl.LinkedEntityId = CreateOpportunity.Id;
                cdl.ContentDocumentId = conDocId;
                cdl.shareType = 'V';
                Insert cdl;
                System.debug('content document inserted '+ cdl.Id);
                
                /*List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                ContentDistribution cd = new ContentDistribution();
                cd.Name = cv.Title;
                cd.ContentVersionId = cv.id;
                cd.PreferencesAllowViewInBrowser= true;
                cd.PreferencesLinkLatestVersion=true;
                cd.PreferencesNotifyOnVisit=false;
                cd.PreferencesPasswordRequired=false;
                cd.PreferencesAllowOriginalDownload= true;
                conDistribution.add(cd);
                Insert conDistribution;
                system.debug('conDistribution '+ conDistribution[0].Id);*/
                
                //ContentDistribution condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution LIMIT 1];
                //contact condetails = [SELECT Id,Name,BWPS_publicProfileLink__c FROM Contact WHERE Id =: CreateOpportunity.Id];
                //condetails.BWPS_publicProfileLink__c =condistributionList.ContentDownloadUrl;
                //update condetails;
                //system.debug('Contact updated '+condetails.Id);
            }

            donationId  = CreateOpportunity.Id;
                //GlobalVariables.oneTimecall= true;
            //}
        }
        catch(Exception e){
            //System.debug('error line '+e.getLineNumber());
            //system.debug('error message '+e.getMessage());
            AuraHandledException ex = new AuraHandledException(e.getMessage());
            //ex.setMessage(e.getMessage());
            system.debug('error message '+e.getMessage());
            system.debug('error line '+e.getLineNumber());
            //throw ex;
        }
        System.debug('end of : ' +CreateOpportunity);
        return CreateOpportunity;
    }   
    @Auraenabled
    Public Static Opportunity BWPS_CreateRecurringDonations(object DataMap , String HonneePhoto){
        System.debug('start create donations');
        Opportunity CreateOpportunity = new Opportunity(); 
        List<Contact> AllContacts = new List<Contact>();
        ChargentOrders__ChargentOrder__c NewChargetnOrder = new ChargentOrders__ChargentOrder__c();
        String donationId;
        String ContactId;
        String OppContact;
        String OppAccount;
        String gatewayId ;
        String ChargentOrderId;
        try{
            String UserId = UserInfo.getUserId();
            System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
            list<User> userDetails = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
            if(userDetails.size()>0){
                ContactId = userDetails[0].ContactId;
                System.debug('ContactId 3 '+ContactId);
            }
            Id recordtypeDonor =  Schema.SObjectType.contact.getRecordTypeInfosByName().get('Donor Record Type').getRecordTypeId();
            System.debug('recordtypeDonor '+recordtypeDonor);
        
            //if(GlobalVariables.oneTimecall ==false){
            Contact conUopdate = new Contact();    
            Account AccountCreate = new Account();
            System.debug('mapp : '+DataMap);
            Map<Object,Object> DataMapCopy=(Map<Object,Object>)DataMap ;
            System.debug('DataMapCopy' +DataMapCopy);
            Map<Object,Object>  contactDetailsMap= (Map<Object,Object>)DataMapCopy.get('ContactDetails');
            conUopdate.RecordTypeId = recordtypeDonor;
            conUopdate.firstName = String.valueOf(contactDetailsMap.get('firstName'));
            conUopdate.lastName = String.valueOf(contactDetailsMap.get('lastName'));
            conUopdate.Email = String.valueOf(contactDetailsMap.get('Email'));
            conUopdate.Phone = String.valueOf(contactDetailsMap.get('Phone'));
            AllContacts = [SELECT ID,AccountId,Name,Email,Phone FROM Contact WHERE Email =:conUopdate.Email AND Phone=:conUopdate.Phone LIMIT 1];
                //System.Debug('AllContacts.Id '+AllContacts.Id);
                //System.Debug('AllContacts.AccountId '+AllContacts.AccountId);
            conUopdate.MailingState = String.valueOf(contactDetailsMap.get('MailingState'));
            conUopdate.MailingCity = String.valueOf(contactDetailsMap.get('MailingCity'));
            conUopdate.MailingCountry = String.valueOf(contactDetailsMap.get('MailingCountry'));
            conUopdate.MailingPostalCode = String.valueOf(contactDetailsMap.get('MailingPostalCode'));
            conUopdate.MailingStreet = String.valueOf(contactDetailsMap.get('MailingStreet'));
            conUopdate.BWPS_Gender__c = 'Male';
            String fullName = String.valueOf(contactDetailsMap.get('firstName')) +' '+ String.valueOf(contactDetailsMap.get('lastName'));
            AccountCreate.Name = fullName;
            AccountCreate.BillingStreet = String.valueOf(contactDetailsMap.get('MailingStreet'));
            AccountCreate.BillingCity = String.valueOf(contactDetailsMap.get('MailingCity'));
            AccountCreate.BillingState = String.valueOf(contactDetailsMap.get('MailingState'));
            AccountCreate.BillingPostalCode = String.valueOf(contactDetailsMap.get('MailingPostalCode'));
            AccountCreate.BillingCountry = String.valueOf(contactDetailsMap.get('MailingCountry'));
            Integer Matchedcontacts = AllContacts.size();
            System.debug('record:>>>>>>>>>>>'+conUopdate);
                System.debug('Matchedcontacts '+Matchedcontacts);
            if(Matchedcontacts==0){
                // Database.Insert(conUopdate,false);
                // Database.Insert(AccountCreate,false);
                Insert conUopdate;
                Insert AccountCreate;
                OppAccount = AccountCreate.Id;
                OppContact = conUopdate.Id;          
                System.debug('contact Insert'+conUopdate.Id);
            }
            else if(Matchedcontacts>0){
                OppAccount = AllContacts[0].AccountId;
                OppContact = AllContacts[0].Id; 
                //OppAccount = '0013C00000mJkgAQAS';
                //OppContact = conUopdate.Id; 
                System.debug('Matchedcontacts '+Matchedcontacts);
            }
            date myDate = System.today();
            date EndDate = myDate.addYears(2);
            String DonatorName  = contactDetailsMap.get('firstName') +' '+contactDetailsMap.get('lastName');
            String tributeType = String.valueOf(contactDetailsMap.get('tributetype'));
            String selectedtributetype = '' ;
            if(tributeType == 'Honor'){
                selectedtributetype = 'Honor';
            }
            else if(tributeType == 'Memorial'){
                   selectedtributetype = 'Memorial';
            }
            Map<Object,Object> DonationDetailsMap= (Map<Object,Object>)DataMapCopy.get('DonationDetails');
                List<ChargentBase__Gateway__c> gateways = [SELECT ID ,Name,ChargentBase__Active__c FROM ChargentBase__Gateway__c WHERE ChargentBase__Active__c = true];
            If(gateways.size() > 0){
                gatewayId = gateways[0].Id;
                System.debug('gATEWAY id '+ gatewayId);
                NewChargetnOrder.ChargentOrders__Gateway__c = gatewayId ;
                 NewChargetnOrder.ChargentOrders__Charge_Amount__c = decimal.valueOf(((String)DonationDetailsMap.get('Amounts')));
                 //NewChargetnOrder.ChargentOrders__Shipping__c = decimal.valueOf(((String)DonationDetailsMap.get('Amounts')));
                NewChargetnOrder.ChargentOrders__Tax__c  = 0;
                NewChargetnOrder.ChargentOrders__Subtotal__c = decimal.valueOf(((String)DonationDetailsMap.get('Amounts')));
                 NewChargetnOrder.ChargentOrders__Payment_Title__c = String.valueOf(contactDetailsMap.get('HonoreeName'));
                NewChargetnOrder.ChargentOrders__Payment_Descriptor__c = String.valueOf(contactDetailsMap.get('RecipientEmail'));
                NewChargetnOrder.ChargentOrders__Description__c	='4027';
                Insert NewChargetnOrder;
                ChargentOrderId = NewChargetnOrder.Id;
                System.debug('NewChargetnOrder '+NewChargetnOrder.Id);
                System.debug('ChargentOrderId '+ ChargentOrderId);
            }
             System.debug('DonationDetailsMap ScheDate' + DonationDetailsMap.get('ScheDate'));
             System.debug('DonationDetailsMap selectedCount' + DonationDetailsMap.get('selectedCount'));
              /*date selectddate;
              
               Date myDateseleted ;
             if(DonationDetailsMap.get('selectedCount') !=null){
                 selectddate =  date.valueOf(DonationDetailsMap.get('selectedCount'));
                 myDateseleted = Date.newInstance(date.valueOf(DonationDetailsMap.get('selectedCount'));
             }
              System.debug('myDateseleted '+myDateseleted); */
              String selectedPeriod = String.valueOf(DonationDetailsMap.get('Period'));
              Date startdate ;
              System.debug('Selectedperiod '+selectedPeriod);
              if(selectedPeriod == 'Monthly'){
               startdate = System.today().addMonths(1);
              }
              else if(selectedPeriod == 'Quarterly'){
                 startdate = System.today().addMonths(3);
              }
              else if(selectedPeriod == 'Semiannual'){
                  startdate = System.today().addMonths(6);
              }
              else if(selectedPeriod == 'Annual'){
                  startdate = System.today().addYears(1);
              }
              string selectedDatefin;
               if(DonationDetailsMap.get('selectedCount') !=null){
                    selectedDatefin = DonationDetailsMap.get('selectedCount') +' 00:00:00';
               }
               System.debug('selectedDatefin '+ selectedDatefin);
            CreateOpportunity.Name = DonatorName;
            CreateOpportunity.CloseDate = System.today();
            CreateOpportunity.StageName = 'Pledged';
            CreateOpportunity.AccountId = OppAccount;
            CreateOpportunity.BWPS_DonationCode__c = '4027';
            CreateOpportunity.BWPS_Paid__c = true;
            CreateOpportunity.BWPS_Chargent_Order__c = ChargentOrderId;
            CreateOpportunity.npsp__Primary_Contact__c = OppContact;
            CreateOpportunity.BWPS_Payment_Method__c = String.valueOf(DonationDetailsMap.get('PaymentMethod'));
            CreateOpportunity.Amount = decimal.valueOf(((String)DonationDetailsMap.get('Amounts')));
            CreateOpportunity.npsp__Tribute_Type__c = selectedtributetype;
            CreateOpportunity.BWPS_Payment_Stop__c = String.valueOf(DonationDetailsMap.get('Frequency'));
            CreateOpportunity.BWPS_Payment_Frequency__c = String.valueOf(DonationDetailsMap.get('Period'));
            CreateOpportunity.BWPS_Payment_End_Date__c = EndDate;//Date.valueOf(selectedDatefin);
            CreateOpportunity.BWPS_Payment_Start_Date__c = startdate;
            CreateOpportunity.BWPS_Payment_Count__c = Integer.valueOf(DonationDetailsMap.get('selectedCount'));
            CreateOpportunity.npsp__Honoree_Name__c = String.valueOf(contactDetailsMap.get('HonoreeName'));
            CreateOpportunity.npsp__Notification_Message__c = String.valueOf(contactDetailsMap.get('HonoreeDescription'));
            CreateOpportunity.npsp__Notification_Recipient_Name__c = String.valueOf(contactDetailsMap.get('RecipientName'));
            CreateOpportunity.npsp__Notification_Recipient_Information__c = String.valueOf(contactDetailsMap.get('RecipientAddress'));
            CreateOpportunity.npsp__Notification_Recipient_Email__c = String.valueOf(contactDetailsMap.get('RecipientEmail'));
            //Database.insert(CreateOpportunity,false);
            insert CreateOpportunity;
            System.debug('Opportunity Insert');
            System.debug('Opportunity Insert' +CreateOpportunity.Id);
               

                 if(HonneePhoto != null && HonneePhoto != ''){
                ContentVersion cv = new ContentVersion();
                cv.Title = DonatorName;
                cv.PathOnClient = 'HonneePhoto.jpg';
                cv.VersionData = (Blob)EncodingUtil.base64Decode(HonneePhoto);//Blob.valueOf('Test Content');
                cv.IsMajorVersion = true;
                Insert cv;
                
                System.debug('content version insert '+ cv.Id);
                
                //Create ContentDocumentLink 
                Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
                ContentDocumentLink cdl = New ContentDocumentLink();
                cdl.LinkedEntityId = CreateOpportunity.Id;
                cdl.ContentDocumentId = conDocId;
                cdl.shareType = 'V';
                Insert cdl;
                System.debug('content document inserted '+ cdl.Id);
            }

                donationId  = CreateOpportunity.Id;
                //GlobalVariables.oneTimecall= true;
            //}
        }
        catch(Exception e){
            System.debug('error line '+e.getLineNumber());
            System.debug('error message '+e.getMessage());
            // AuraHandledException ex = new AuraHandledException(e.getMessage());
            // ex.setMessage(e.getMessage());
            // system.debug('error message2 '+e.getMessage());
            // throw ex;
        }
        System.debug('endd : '+CreateOpportunity);
          return CreateOpportunity;
    }
    
}