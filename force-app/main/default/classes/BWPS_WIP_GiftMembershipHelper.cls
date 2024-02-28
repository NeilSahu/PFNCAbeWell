public with sharing class BWPS_WIP_GiftMembershipHelper {
    public static String MembershipRecordType = GlobalVariables.recordTypemembership;
    public static String GuestUserRecordType = GlobalVariables.recordTypeGuestUser;
   
    @AuraEnabled
    public static string CreateMember(String memberDetails){
        try {
             System.debug('GuestUserRecordType '+GuestUserRecordType);
             Map<String, Object> MemberData = (Map<String, Object>) JSON.deserializeUntyped(memberDetails);
             String Mailofmember = String.valueOf(MemberData.get('gr_emailAddress'));
             String MailofpersonwhoGifted = String.valueOf(MemberData.get('emailAddress'));
             List<Contact> personcontact = [SELECT Id,Name,Email FROM Contact WHERE Email =:MailofpersonwhoGifted LIMIT 1];
             System.debug('personcontact '+personcontact);
             Boolean paid = true;
             double paidAmount = 1234;
            list<Account> insertAccount = new list<Account>();
            list<Contact> insertContact = new list<Contact>();
            if(personcontact.isEmpty()){
                Account createAccPerson = new Account();
              Contact CreateConPerson = new Contact();
              createAccPerson.Name =String.valueOf(MemberData.get('firstName')) +' '+String.valueOf(MemberData.get('lastName'));
               insertAccount.add(createAccPerson);
              CreateConPerson.FirstName = String.valueOf(MemberData.get('firstName'));
              CreateConPerson.LastName = String.valueOf(MemberData.get('lastName'));
              CreateConPerson.AccountId = createAccPerson.Id;
              CreateConPerson.RecordTypeId = GuestUserRecordType;
              CreateConPerson.npsp__Do_Not_Contact__c = Boolean.valueOf(MemberData.get('newsLetterConfirm'));
              CreateConPerson.MailingStreet = String.valueOf(MemberData.get('streetAddress'));
              CreateConPerson.MailingCity = String.valueOf(MemberData.get('city'));
              CreateConPerson.MailingState = String.valueOf(MemberData.get('stateProvince'));
              CreateConPerson.MailingPostalCode = String.valueOf(MemberData.get('postalCode'));
              CreateConPerson.MailingCountry = String.valueOf(MemberData.get('country'));
              CreateConPerson.Email = String.valueOf(MemberData.get('emailAddress'));
              CreateConPerson.Phone = String.valueOf(MemberData.get('mobilePhoneNumber'));
              CreateConPerson.HomePhone = String.valueOf(MemberData.get('homePhoneNumber'));
              CreateConPerson.npe01__Primary_Address_Type__c = 'Home';
                insertContact.add(CreateConPerson);
            }
              Account createAccount = new Account();
              Contact CreateContact = new Contact();
              createAccount.Name =String.valueOf(MemberData.get('gr_firstName')) +' '+String.valueOf(MemberData.get('gr_lastName'));
             insertAccount.add(createAccount);
              CreateContact.FirstName = String.valueOf(MemberData.get('gr_firstName'));
              CreateContact.LastName = String.valueOf(MemberData.get('gr_lastName'));
              CreateContact.AccountId = createAccount.Id;
              CreateContact.RecordTypeId = GuestUserRecordType;
              CreateContact.MailingStreet = String.valueOf(MemberData.get('gr_streetAddress'));
              CreateContact.MailingCity = String.valueOf(MemberData.get('gr_city'));
              CreateContact.MailingState = String.valueOf(MemberData.get('gr_stateProvince'));
              CreateContact.MailingPostalCode = String.valueOf(MemberData.get('gr_postalCode'));
              CreateContact.MailingCountry = String.valueOf(MemberData.get('gr_country'));
              CreateContact.Email = String.valueOf(MemberData.get('gr_emailAddress'));
              CreateContact.Phone = String.valueOf(MemberData.get('gr_mobilePhoneNumber'));
              CreateContact.Description = String.valueOf(MemberData.get('gr_message'));
              CreateContact.About__c = String.valueOf(MemberData.get('gr_relationship'));
              CreateContact.npe01__Primary_Address_Type__c = 'Home';
              insertContact.add(CreateContact);
               
               //Inserting Accounts
               Database.Insert(insertAccount);
               System.debug('insertAccount '+insertAccount);
               //Inserting Contacts
              Database.Insert(insertContact);
              System.debug('insertContact '+insertContact);

              // Creating Opportunity and Payment only if amount is paid
              if(paid == true){
                Opportunity createOpportunity = new Opportunity();
                createOpportunity.Name = String.valueOf(MemberData.get('firstName')) +' '+String.valueOf(MemberData.get('lastName'));
                createOpportunity.AccountId =createAccount.Id;
                createOpportunity.npsp__Primary_Contact__c = CreateContact.Id;
                createOpportunity.CloseDate = System.today();
                createOpportunity.StageName = 'Closed Won';
                createOpportunity.BWPS_Payment_Method__c = 'UPI';
                createOpportunity.RecordTypeId = MembershipRecordType;
                createOpportunity.BWPS_Paid__c = paid;
                createOpportunity.Amount = paidAmount;
                createOpportunity.npe01__Do_Not_Automatically_Create_Payment__c = true;
                npe01__OppPayment__c createPayment = new npe01__OppPayment__c();
                createPayment.npe01__Opportunity__c = createOpportunity.Id;
                createPayment.npe01__Payment_Date__c = System.today();
                createPayment.npe01__Payment_Method__c = 'Cash';
                createPayment.npe01__Payment_Amount__c = paidAmount;
                createPayment.npe01__Paid__c = paid;
                //inserting opportunity
                Database.insert(createOpportunity);
                System.debug('createOpportunity '+createOpportunity);
                //inserting payment
                database.insert(createPayment);
                System.debug('createPayment '+createPayment);
              }
            return 'Success';
        } catch (Exception e) {
            System.debug('Error occured '+e.getLineNumber());
            System.debug('Erorr Mesaage '+e.getMessage());
            return 'Error';
        }
    }
}