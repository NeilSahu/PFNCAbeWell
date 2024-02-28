public class TestDataFactory {
    public static Id getAccount(){
        Account a = new Account();
        a.name='testify';
       insert a;
       return a.Id; 
    }
    public static Id getScheduleClassLineItem(){
        Schedule_Class_Line_Item__c ScheduleClassLineTest = new Schedule_Class_Line_Item__c();
        ScheduleClassLineTest.Name = 'Test';
        ScheduleClassLineTest.Schedule_Class__c=getScheduleClass();
        ScheduleClassLineTest.LectureId__c = '001';
        ScheduleClassLineTest.BWPS_ClassDate__c = Date.today();
        ScheduleClassLineTest.BWPS_ClassDay__c = 'Monday';
        ScheduleClassLineTest.BWPS_Lecture_Link__c = 'http://example.com/lecture';
        ScheduleClassLineTest.BWPS_EndTime__c = Time.newInstance(12, 0, 0, 0);
        ScheduleClassLineTest.BWPS_Integrity__c = 'High/Active';
        ScheduleClassLineTest.LectureId__c = 'L001';
        ScheduleClassLineTest.Lecture_Status__c = 'LIVE';
        ScheduleClassLineTest.BWPS_StartTime__c = Time.newInstance(10, 0, 0, 0);
        ScheduleClassLineTest.BWPS_Status__c = 'Active';
        ScheduleClassLineTest.BWPS_Time__c = Time.newInstance(2, 30, 0, 0);
        ScheduleClassLineTest.Video_Duration__c = '00:45:00';
        ScheduleClassLineTest.Vimeo_External_Sub_Key__c = 'vimeo-sub-key';
        ScheduleClassLineTest.LectureVideoId__c = 'LV001';
        ScheduleClassLineTest.BWPS_Vimeo_video_Id__c = 'vimeo-video-id';
        insert ScheduleClassLineTest;
        return ScheduleClassLineTest.Id;
    }
    public static Id getOpportunity(){
        ChargentOrders__ChargentOrder__c co=getChargentOrder();
        insert co;
        Opportunity opp = new Opportunity(Name = 'Test Opportunity', 
            Amount = 500.0, 
            BWPS_Paid__c = true, 
            BWPS_Payment_Method__c = 'Net Banking',
            CloseDate = Date.today(),
            stageName='Prospecting',
            BWPS_Chargent_Order__c=co.Id,
            npsp__Primary_Contact__c=getContact(),
            npsp__Tribute_Type__c='Honor',
            npsp__Notification_Recipient_Email__c='a@a.a'
        );
        insert opp;
        return opp.Id;
    }
    public static Id getOpportunity2(){
        Opportunity opp2 = new Opportunity(Name = 'Test Opportunity 2', 
            Amount = 750.0, 
            BWPS_Paid__c = false, 
            BWPS_Payment_Method__c = 'Net Banking', 
            CloseDate = Date.today().addDays(-1),
            stageName='Prospecting'                            
        );
        insert opp2;
        return opp2.Id;
    }
    public static Id getContentVersion(){
        Id NetworkId=[select Id from Network LIMIT 1].Id;
        ContentVersion conVersion = new ContentVersion(
            Title = 'Test Document', 
            // FileType = 'pdf', 
            ContentUrl='https://www.google.com/abc.pdf',
            NetworkId=NetworkId
            //VersionData = Blob.valueOf('Test Data')
        );
        insert conVersion;
        return conVersion.Id;
    }
    public static ContentVersion createContentVersion(){
        ContentVersion cv = new ContentVersion();
		cv.Title = 'My JPG File'; // Set the title of the file
		cv.PathOnClient = 'my_jpg_file.jpg'; // Set the file name and extension
		cv.VersionData = Blob.valueOf('Some binary data'); // Set the binary data of the file
        return cv;
    }
    public static Id getContactByAccount(Id accountId){
        Id recordtypeInstructor =  Schema.SObjectType.contact.getRecordTypeInfosByName().get('Instructor Record Type').getRecordTypeId();
        contact c =  new contact(LastName='testify con',FirstName='Test',AccountId=accountId, Email='test@test.com',RecordTypeId=recordtypeInstructor );
        c.Phone = '555-555-5555';
		c.Title = 'Sales Manager';
		c.Department = 'Sales';
        c.MailingStreet = '123 Main St';
		c.MailingCity = 'Anytown';
		c.MailingState = 'CA';
		c.MailingPostalCode = '12345';
		c.MailingCountry = 'USA';
        c.BWPS_QB_CustomerName__c = 'QB Customer Name';
        c.BWPS_QB_CustomerId__c = 'QB Customer ID';
        Insert c;
        return c.Id;
    }
    public static Id getContact(){
        Id a=getAccount();
        Id recordtypeInstructor =  Schema.SObjectType.contact.getRecordTypeInfosByName().get('Instructor Record Type').getRecordTypeId();
        contact c =  new contact(LastName='testify con',FirstName='Test',AccountId=a, Email='test@test.com',RecordTypeId=recordtypeInstructor );
        c.Phone = '555-555-5555';
		c.Title = 'Sales Manager';
		c.Department = 'Sales';
        c.MailingStreet = '123 Main St';
		c.MailingCity = 'Anytown';
		c.MailingState = 'CA';
		c.MailingPostalCode = '12345';
		c.MailingCountry = 'USA';
        c.BWPS_QB_CustomerName__c = 'QB Customer Name';
        c.BWPS_QB_CustomerId__c = 'QB Customer ID';
        
        Insert c;
        return c.Id;
    }
    public static void createUserRole() {
        List<UserRole> roleForUser = [SELECT Id, Name FROM UserRole where Name = 'BE Well\'s Users Partner User'];
        if(roleForUser.size() == 0) 
        {      
            UserRole newRole = new UserRole(Name = 'BE Well\'s Users Partner User');
            insert newRole;
        }
    }
    public static void createUser(){
    	User userExample = new User();
        userExample.Username = 'exxcvbnyyyyyyyyyybvcmailtest@test.com';
        userExample.FirstName = 'First';
        userExample.LastName = 'Last';
        userExample.Alias = 'Alihgas';
        userExample.Email = 'emailtest@test.com';
        userExample.TimeZoneSidKey = 'America/New_York';
        userExample.LocaleSidKey = 'en_CA';
        userExample.EmailEncodingKey = 'UTF-8';
        userExample.ProfileId = [SELECT Id FROM Profile WHERE Name = 'Partner Community User' LIMIT 1].Id;
        userExample.LanguageLocaleKey = 'en_US';
        userExample.ContactId=getContact();
       	//userExample.CommunityNickname='test5576'; 
        insert userExample;
    }
    public static Id getPortalUser(){
        User userExample = new User();
        userExample.Username = 'exxcvbnyyyyyyyyyybvcmailtest@test.com';
        userExample.FirstName = 'First';
        userExample.LastName = 'Last';
        userExample.Alias = 'Alihgas';
        userExample.Email = 'emailtest@test.com';
        userExample.TimeZoneSidKey = 'America/New_York';
        userExample.LocaleSidKey = 'en_CA';
        userExample.EmailEncodingKey = 'UTF-8';
        userExample.ProfileId = [SELECT Id FROM Profile WHERE Name = 'Partner Community User' LIMIT 1].Id;
        userExample.LanguageLocaleKey = 'en_US';
        userExample.ContactId=getContact();
       	//userExample.CommunityNickname='test5576'; 
        insert userExample; 
        return userExample.Id;
    }
    public static User createPortalUser(){
        Id systemAdmin = [SELECT Id FROM Profile WHERE Name = 'Partner Community User' LIMIT 1].Id;
        Id c=getContact();



        User userExample = new User();
        userExample.Username = 'exxcvbnbvcmailtest@test.com';
        userExample.FirstName = 'First';
        userExample.LastName = 'Last';
        userExample.Alias = 'Alihgas';
        userExample.Email = 'emailtest@test.com';
        userExample.TimeZoneSidKey = 'America/New_York';
        userExample.LocaleSidKey = 'en_CA';
        userExample.EmailEncodingKey = 'UTF-8';
        userExample.ProfileId = systemAdmin;
        userExample.LanguageLocaleKey = 'en_US';
        userExample.ContactId=c;
       	userExample.CommunityNickname='test5576'; 
        insert userExample;
        return userExample;
    }
	public static Id getUser(){
        Id systemAdmin = [SELECT Id FROM Profile WHERE Name = 'Guest User' LIMIT 1].Id;

        User userExample = new User();
        userExample.Username = 'exxcvbnbvcxzmailtest@test.com';
        userExample.FirstName = 'First';
        userExample.LastName = 'Last';
        userExample.Alias = 'Alihgas';
        userExample.Email = 'emailtest@test.com';
        userExample.TimeZoneSidKey = 'America/New_York';
        userExample.LocaleSidKey = 'en_CA';
        userExample.EmailEncodingKey = 'UTF-8';
        userExample.ProfileId = systemAdmin;
        userExample.LanguageLocaleKey = 'en_US';
       	userExample.CommunityNickname='test5576'; 
		userExample.ContactId=getContact();        
        insert userExample;
        return userExample.Id;
    }
    public static Id InstructorsUser(){
        Id systemAdmin = [SELECT Id FROM Profile WHERE Name = 'Instructor' LIMIT 1].Id;
        Id c=getContact();
        User userExample = new User();
        userExample.Username = 'exxcvbnbvcxzmailtest@test.com';
        userExample.FirstName = 'First';
        userExample.LastName = 'Last';
        userExample.Alias = 'Alihgas';
        userExample.Email = 'emailtest@test.com';
        userExample.TimeZoneSidKey = 'America/New_York';
        userExample.LocaleSidKey = 'en_CA';
        userExample.EmailEncodingKey = 'UTF-8';
        userExample.ProfileId = systemAdmin;
        userExample.LanguageLocaleKey = 'en_US';
        userExample.ContactId=c;
       	userExample.CommunityNickname='test5576';
       //userExample.ownerid =u.Id;
        insert userExample;
        return userExample.Id;
    }
    public static Id getFAQ(){
        FAQ__c faq = new FAQ__c(Name='Test FAQ', Answer__c='Test answer', Type__c='About Us Website General');
        insert faq;
        return faq.Id;
    }
    public static Id getFAQTypeLogin(){
        FAQ__c faq = new FAQ__c(Name='Test FAQ', Answer__c='Test answer', Type__c='Login', Popular_Question__c =true);
        insert faq;
        return faq.Id;
    }
    public static Id getBWPSResource(){
        BWPS_Resource__c resource = new BWPS_Resource__c(Name='Test resource', Description__c='Test description', Type__c='Educational Resources', Dashboard__c='Website General');
        insert resource;
        return resource.Id;
    }
    public static Object getGiftDetails(){
        Map<Object, Object> donorinfoMap = new Map<Object, Object>{
            'Fname' => 'Donor First Name',
            'LName' => 'Donor Last Name',
            'Email' => 'donor@example.com',
            'phoneNumber' => '1234567890',
            'state' => 'CA',
            'city' => 'San Francisco',
            'country' => 'USA',
            'postalCode' => '94107',
            'Street' => '123 Main St.',
            'DonationAmount' => '100.00',
            'DonationType' => 'Once'
        };
        Map<Object, Object> giftinfoMap = new Map<Object, Object>{
            'Fname' => 'Gift First Name',
            'LName' => 'Gift Last Name',
            'Email' => 'gift@example.com',
            'phoneNumber' => '1234567890',
            'state' => 'CA',
            'city' => 'San Francisco',
            'country' => 'USA',
            'postalCode' => '94107',
            'Street' => '123 Main St.',
            'GiftAmount' => '500.00',
            'GiftType' => 'Yearly'
        };
         
        Map<Object, Object> giftDetails = new Map<Object, Object>{
    		'donorinfo' => donorinfoMap,
    		'giftinfo' => giftinfoMap
		};
        return giftDetails;
    }
    public static Object getLeadDetails(){
        Map<Object,Object> leadDetails = new Map<Object,Object>();
        leadDetails.put('Email', 'test@example.com');
        leadDetails.put('Message', 'This is a test message');
        leadDetails.put('Name', 'Test User');
        leadDetails.put('Body', 'Test lead description');
		leadDetails.put('Subject', 'Test lead subject');
        // Create a test lead object
        Object leadObject = new Map<Object,Object>{'LeadDetails' => leadDetails};
        return leadObject;
    }
    public static Object getNotesDetails(){
        Map<Object, Object> notesDetails = new Map<Object, Object>{
    		'NoteDetail' => new Map<Object, Object>{
        	'Title' => 'Test Note',
        	'Body' => 'This is a test note',
        	'ClassId' => getClass()
    		}
		};
        return notesDetails;
    }
    public static Object getCaseMap(){
        Map<Object,Object> caseMap = new Map<Object,Object>{
            'CaseData' => new Map<Object,Object>{
                'Email' => 'test@example.com',
                'Name' => 'John Doe',
                'Body' => 'Test case body',
                'Subject' => 'Test case subject'
            }
        };
        return caseMap;
    }
    public static Id getScheduleClass(){
        Schedule_Class__c testRecord = new Schedule_Class__c();
        testRecord.Class__c = getClass(); // replace with appropriate Class record Id
        testRecord.BWPS_ClassDuration__c = '30 Min'; // replace with appropriate duration
        testRecord.BWPS_ClassFrequency__c = 2; // replace with appropriate frequency
        testRecord.ContentimageUrl__c = 'https://www.example.com/image.jpg'; // replace with appropriate image URL
        testRecord.ContentVersionId__c = getContentVersion(); // replace with appropriate version ID
        testRecord.BWPS_Description__c = 'Test description'; // replace with appropriate description
        testRecord.BWPS_EndTime__c = Time.newInstance(16, 30, 0, 0); // replace with appropriate end time
        testRecord.BWPS_instructor__c = getContact(); // replace with appropriate Contact record Id
        testRecord.Integrity__c = '	Low/Seated'; // replace with appropriate integrity level
        testRecord.LatitudeLongitude__c = '37.7749,-122.4194'; // replace with appropriate latitude and longitude
        testRecord.Schedule_Days__c = 'Monday;Wednesday;Friday'; // replace with appropriate days of the week
        testRecord.Schedule_Type__c = 'Hybrid'; // replace with appropriate schedule type
        testRecord.BWPS_Date__c = Date.newInstance(2023, 3, 1); // replace with appropriate date
        testRecord.BWPS_StartTime__c = Time.newInstance(14, 30, 0, 0); // replace with appropriate start time
        testRecord.BWPS_Status__c = 'Active'; // replace with appropriate status
        testRecord.RecordTypeId=Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get(BWPS_Constants.RecurringDonationRecordType).getRecordTypeId();
        //testRecord.Vimeo_External_Key__c = 'ABC12345'; // replace with appropriate Vimeo external key
        insert testRecord; 
        return testRecord.Id;
    }
    public static Id getScheduleClassForBWPS_instructor(){
        Schedule_Class__c testRecord = new Schedule_Class__c();
        testRecord.Class__c = getClass(); // replace with appropriate Class record Id
        testRecord.BWPS_ClassDuration__c = '30 Min'; // replace with appropriate duration
        testRecord.BWPS_ClassFrequency__c = 2; // replace with appropriate frequency
        testRecord.ContentimageUrl__c = 'https://www.example.com/image.jpg'; // replace with appropriate image URL
        testRecord.ContentVersionId__c = getContentVersion(); // replace with appropriate version ID
        testRecord.BWPS_Description__c = 'Test description'; // replace with appropriate description
        testRecord.BWPS_EndTime__c = Time.newInstance(16, 30, 0, 0); // replace with appropriate end time
        testRecord.BWPS_instructor__c = getContact(); // replace with appropriate Contact record Id
        testRecord.Integrity__c = '	Low/Seated'; // replace with appropriate integrity level
        testRecord.LatitudeLongitude__c = '37.7749,-122.4194'; // replace with appropriate latitude and longitude
        testRecord.Schedule_Days__c = 'Monday;Wednesday;Friday'; // replace with appropriate days of the week
        testRecord.Schedule_Type__c = 'Hybrid'; // replace with appropriate schedule type
        testRecord.BWPS_Date__c = Date.newInstance(2023, 3, 1); // replace with appropriate date
        testRecord.BWPS_StartTime__c = Time.newInstance(14, 30, 0, 0); // replace with appropriate start time
        testRecord.BWPS_Status__c = 'Active'; // replace with appropriate status
        //testRecord.Vimeo_External_Key__c = 'ABC12345'; // replace with appropriate Vimeo external key
        insert testRecord; 
        return testRecord.Id;
    }
    
    public static User getScheduleClassForBWPS_instructorPortalUserContactId(){
        User u = createPortalUser();
        Schedule_Class__c testRecord = new Schedule_Class__c();
        testRecord.Class__c = getClass(); // replace with appropriate Class record Id
        testRecord.BWPS_ClassDuration__c = '30 Min'; // replace with appropriate duration
        testRecord.BWPS_ClassFrequency__c = 2; // replace with appropriate frequency
        testRecord.ContentimageUrl__c = 'https://www.example.com/image.jpg'; // replace with appropriate image URL
        testRecord.ContentVersionId__c = getContentVersion(); // replace with appropriate version ID
        testRecord.BWPS_Description__c = 'Test description'; // replace with appropriate description
        testRecord.BWPS_EndTime__c = Time.newInstance(16, 30, 0, 0); // replace with appropriate end time
        testRecord.BWPS_instructor__c = u.ContactId; // replace with appropriate Contact record Id
        testRecord.Integrity__c = '	Low/Seated'; // replace with appropriate integrity level
        testRecord.LatitudeLongitude__c = '37.7749,-122.4194'; // replace with appropriate latitude and longitude
        testRecord.Schedule_Days__c = 'Monday;Wednesday;Friday'; // replace with appropriate days of the week
        testRecord.Schedule_Type__c = 'Hybrid'; // replace with appropriate schedule type
        testRecord.BWPS_Date__c = Date.newInstance(2023, 3, 1); // replace with appropriate date
        testRecord.BWPS_StartTime__c = Time.newInstance(14, 30, 0, 0); // replace with appropriate start time
        testRecord.BWPS_Status__c = 'Active'; // replace with appropriate status
        //testRecord.Vimeo_External_Key__c = 'ABC12345'; // replace with appropriate Vimeo external key
        insert testRecord; 
        return u;
    }
    
    
    
    
    public static Id getClass(){
        Class__c newClass = new Class__c();
        newClass.BWPS_Class_Image__c = 'Sample Class Image';
        newClass.Class_Logo__c = 'Sample Class Logo';
        newClass.BWPS_Class_Sub_Type__c = 'Beginner';
        newClass.BWPS_Class_Type__c = 'Boxing';
        newClass.BWPS_socialization_Class_Type__c = 'Social';
        newClass.BWPS_Communiction_Class_Type__c = 'Communication Club';
        newClass.Description__c = 'Sample Description';
        newClass.BWPS_Image_Base64code__c = 'Sample Base64 Code';
        newClass.Integrity__c = 'Low/Seated';
        newClass.Type__c = 'Aerobic';
        newClass.BWPS_Type__c = 'Sample BWPS Type';
        newClass.Name='Test Class';
        newClass.Description__c='Test description';
        insert newClass;
        return newClass.Id;
    }
    public static Id getCase(){
        Case newCase = new Case();
        newCase.Subject = 'Example Subject';
        newCase.Description = 'Example Description';
        newCase.Origin = 'Phone';
        newCase.Status = 'New';
        newCase.Priority = 'High';
        newCase.Reason = 'Billing';
        newCase.Type = 'Problem';
        newCase.ContactId = getContact(); // replace with the Id of the Contact record
        newCase.AccountId = getAccount(); // replace with the Id of the Account record
        newCase.AssetId = getAsset(); // replace with the Id of the Asset record
        // newCase.ProductId = getProduct(); // replace with the Id of the Product record
        newCase.SuppliedEmail = 'example@test.com';
        newCase.SuppliedName = 'Example User';
        newCase.SuppliedPhone = '1234567890';
        newCase.IsEscalated = false;
        insert newCase;        
        return newCase.Id;
    }
    public static Id getAsset(){
        Asset newAsset = new Asset();
        newAsset.Name = 'Example Asset';
        newAsset.Product2Id = getProduct(); // replace with the Id of the Product2 record
        newAsset.ContactId = getContact(); // replace with the Id of the Contact record
        newAsset.AccountId = getAccount(); // replace with the Id of the Account record
        newAsset.InstallDate = Date.today();
        newAsset.PurchaseDate = Date.today().addDays(-365);
        newAsset.UsageEndDate = Date.today().addYears(1);
        newAsset.SerialNumber = '1234567890';
        newAsset.Status = 'In Use';
        newAsset.Quantity = 1;
        newAsset.Price = 1000.00;
        newAsset.Description = 'Example Description';
        insert newAsset;
        return newAsset.Id;
    }
    public static Id getProduct(){
        Product2 newProduct = new Product2();
        newProduct.Name = 'Example Product';
        newProduct.ProductCode = 'EX0001';
        newProduct.IsActive = true;
        newProduct.Description = 'Example Description';
        newProduct.Family = 'Software';
        newProduct.QuantityUnitOfMeasure = 'EA';
        insert newProduct;       
        return newProduct.Id;
    }
    public static Id getPaymentId(){
        npe01__OppPayment__c oppPayment = new npe01__OppPayment__c();
        oppPayment.npe01__Paid__c = True;
        oppPayment.npe01__Payment_Amount__c = 0.0; 
        oppPayment.npe01__Payment_Date__c = Date.today();
        oppPayment.npe01__Payment_Method__c = 'Cash'; 
        oppPayment.npe01__Check_Reference_Number__c = '1234567890';
        oppPayment.npsp__Card_Last_4__c = '1234';
        oppPayment.npe01__Opportunity__c = getOpportunity();
        insert oppPayment;
        return oppPayment.Id;
    }
    public static Id getOpportunityByNpspPrimaryContact(Id contactId){
        Opportunity opp = new Opportunity(Name = 'Test Opportunity', 
            Amount = 500.0, 
            BWPS_Paid__c = true, 
            BWPS_Payment_Method__c = 'Net Banking',
            CloseDate = Date.today(),
            npsp__Primary_Contact__c=contactId,                              
            stageName='Prospecting'
        );
        insert opp;
        return opp.Id;
    }
    public static Id getNpe01OppPaymentByOpportunity(Id oppId){
        npe01__OppPayment__c oppPayment = new npe01__OppPayment__c();
        oppPayment.npe01__Paid__c = False;
        oppPayment.npe01__Payment_Amount__c = 0.0; 
        oppPayment.npe01__Payment_Date__c = Date.today();
        oppPayment.npe01__Payment_Method__c = 'Cash'; 
        oppPayment.npe01__Check_Reference_Number__c = '1234567890';
        oppPayment.npsp__Card_Last_4__c = '1234';
        oppPayment.npe01__Opportunity__c = oppId;
        oppPayment.npe01__Check_Reference_Number__c = 'ref num';
        insert oppPayment;
        return oppPayment.Id;
    }
    public static Id getNote(){
        Note note1 = new Note(
            Title = 'Note Title',
            Body = 'Body of note',
            ParentId = getContact()
        );
        insert note1;
        return note1.Id;
    }
    public static Id getEnrolledClassByContact(Id contactId){
        Schedule_Class__c sc=[select id,BWPS_instructor__c from Schedule_Class__c where id=:getScheduleClass()];
        Enrolled_Class__c enc=new Enrolled_Class__c(Attendee__c=contactId,Schedule_Class__c=sc.Id);
        insert enc;
        return enc.Id;
    }
    public static Schedule_Class__c getEnrolledClassByContactForScheduleClass(Id contactId){
        Schedule_Class__c sc=[select id,BWPS_instructor__c from Schedule_Class__c where id=:getScheduleClass()];
        Enrolled_Class__c enc=new Enrolled_Class__c(Attendee__c=contactId,Schedule_Class__c=sc.Id);
        insert enc;
        return sc;
    }
    public static Id getEnrolledClass(){
        Schedule_Class__c sc=[select id,BWPS_instructor__c from Schedule_Class__c where id=:getScheduleClass()];
        Enrolled_Class__c enc=new Enrolled_Class__c(Attendee__c=sc.BWPS_instructor__c,Schedule_Class__c=sc.Id);
        insert enc;
        return enc.Id;
    }
    public static Id getScheduleClassId(){
        Schedule_Class__c sc=[select id,BWPS_instructor__c from Schedule_Class__c where id=:getScheduleClass()];
        Enrolled_Class__c enc=new Enrolled_Class__c(Attendee__c=sc.BWPS_instructor__c,Schedule_Class__c=sc.Id);
        insert enc;
        return sc.Id;
    }
    public static Attendee__c getAttendee(){
                    Id sc= getScheduleClass();

        Schedule_Class_Line_Item__c scli=[select id from Schedule_Class_Line_Item__c LIMIT 1];
        System.debug(scli);
        Attendee__c testAttendee=new Attendee__c(
            Attendee_Name_del__c=getContact(),
            Class_Status__c='COMPLETED',
            Description__c='Attendee Description',
            BPWS_Favourite__c=True,
            BWPS_Is_Enrolled__c=True,
            Is_Present__c='Not Marked',
            LectureId__c='Lecture Id',
            Schedule_Class_Line_Item_del__c=scli.Id,
            BWPS_WatchedTimeStamp__c='Attendee Watched Time'
        );
        insert testAttendee;
        return testAttendee;
    }
    public static Attendee__c getAttendeeByContact(Id contactId){
        Attendee__c testAttendee=new Attendee__c(
            Attendee_Name_del__c=contactId,
            Class_Status__c='COMPLETED',
            Description__c='Attendee Description',
            BPWS_Favourite__c=True,
            BWPS_Is_Enrolled__c=True,
            Is_Present__c='Not Marked',
            LectureId__c='Lecture Id',
            Schedule_Class_Line_Item_del__c=TestDataFactory.getScheduleClassLineItem(),
            BWPS_WatchedTimeStamp__c='Attendee Watched Time'
        );
        insert testAttendee;
        return testAttendee;
    }
    public static EntitySubscription getEntitySubscriptionEsContact(){
        EntitySubscription esContact = new EntitySubscription(ParentId = getContact(), SubscriberId = UserInfo.getUserId());
        insert esContact;
        return esContact;
    }
    public static EntitySubscription getEntitySubscriptionEsSCLI(){
        EntitySubscription esSCLI = new EntitySubscription(ParentId = getScheduleClassLineItem(), SubscriberId = UserInfo.getUserId());
       	insert esSCLI;
        return esSCLI;
    }
    public static EntitySubscription getEntitySubscriptionEsAttendee(){
     
        EntitySubscription esAttendee = new EntitySubscription(ParentId = getAttendee().Id, SubscriberId = UserInfo.getUserId());
        insert esAttendee;
        return esAttendee;
    }
    public static id insertAtOnce(){
        Id i=getScheduleClass();
        Enrolled_Class__c ec=new Enrolled_Class__c();
        ec.Schedule_Class__c=i;
        insert ec;
       	Schedule_Class_Line_Item__c scli=new Schedule_Class_Line_Item__c();
        scli.Name='TestRecord';
        scli.BWPS_Status__c='Active';
        insert scli;
		return i;
        
    }
    public static Blog__c  getBlogs(){
        
        Blog__c blog = new Blog__c(Name = 'Test', BWPS_Category__c = 'Dance');
        insert blog;
        return blog;
    }
    public static ContentDocumentLink  getContentDocumentLinkId(Id LinkedEntityId, Id contentVersionId){
        ContentVersion insertedContentVersion = [SELECT Title,ContentDocumentId FROM ContentVersion WHERE Id = :contentVersionId];
        ContentDocumentLink cdl = new ContentDocumentLink();
		cdl.ContentDocumentId = insertedContentVersion.ContentDocumentId;
		cdl.LinkedEntityId = LinkedEntityId;
		cdl.ShareType = 'V';
		cdl.Visibility = 'AllUsers';
		insert cdl;
        return cdl;
    }
    public static Quizes__c getQuizes(){
        Quizes__c quiz = new Quizes__c(Name = 'Test');
        insert quiz;
        return quiz;
    }
    public static SampleClassFlows__c getSampleClassFlows(){
        SampleClassFlows__c SampleClassFlows = new SampleClassFlows__c(Name = 'Test');
        insert SampleClassFlows;
        return SampleClassFlows;
    }
    public static Achievement__c getAchievement(){

		Achievement__c achievement = new Achievement__c(Name = 'Test', Contact__c = getContact(), BWPS_Type_c__c = 'Test', Points__c = 1);
		insert achievement;
	
		return achievement;
    }
    
    public static Achievement__c getAchievementByContactId(String contactId){

		Achievement__c achievement = new Achievement__c(Name = 'Test', Contact__c = contactId, BWPS_Type_c__c = 'Test', Points__c = 1);
		insert achievement;
	
		return achievement;
    }
    
    public static Payment_Method__c getPaymentMethod(String contactId){

        Payment_Method__c PaymentMethod = new Payment_Method__c(Name__c = 'Test', contact__c= contactId);
        insert PaymentMethod;
        
        return PaymentMethod;
	}
    public static ChargentOrders__ChargentOrder__c getChargentOrder(){

        ChargentOrders__ChargentOrder__c co=new ChargentOrders__ChargentOrder__c();
        co.ChargentOrders__Billing_Email__c='a@a.a';
        return co;
	}
    public static ChargentOrders__Transaction__c getChargentTransactions(){
        
		ChargentOrders__Transaction__c ct=new ChargentOrders__Transaction__c(ChargentOrders__Order__c=[select Id from ChargentOrders__ChargentOrder__c LIMIT 1].Id);
        return ct;
        
	}
    public static ChargentBase__Gateway__c getChargentbaseGateway(){
        ChargentBase__Gateway__c cg=new ChargentBase__Gateway__c();
        return cg;
    }
    
}