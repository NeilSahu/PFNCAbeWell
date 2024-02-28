@isTest
public class BWPS_DonarDashboardDonateFormClass_TEST {
	@isTest
    static void BWPS_CreateDonations_TEST() 
    {
        Contact testContact = new Contact(FirstName = 'Test',LastName = 'Contact',Email = 'test@example.com',Phone = '1234567890');
        insert testContact;
        Map<Object, Object> testDataMap = new Map<Object, Object> {
            'ContactDetails' => new Map<Object, Object> {
                'firstName' => testContact.FirstName,
                'lastName' => testContact.LastName,
                'Email' => testContact.Email,
                'Phone' => testContact.Phone,
                'MailingState' => 'Test State',
                'MailingCity' => 'Test City',
                'MailingCountry' => 'Test Country',
                'MailingPostalCode' => '12345',
                'MailingStreet' => 'Test Street',
                'HonoreeName' => 'Test Honoree',
                'HonoreeDescription' => 'Test Honoree Description',
                'RecipientName' => 'Test Recipient',
                'RecipientAddress' => 'Test Recipient Address',
                'RecipientEmail' => 'test.recipient@example.com'
            },
            'DonationDetails' => new Map<Object, Object> {
                'PaymentMethod' => 'Net Banking',
                'Amounts' => '100'
            }
        };
        Opportunity createdOpportunity = BWPS_DonarDashboardDonateFormClass.BWPS_CreateDonations(testDataMap,'123456');
        System.assertEquals('Test Contact', createdOpportunity.Name);
        System.assertEquals(date.today(), createdOpportunity.CloseDate);
        System.assertEquals('Pledged', createdOpportunity.StageName);
        System.assertEquals('4027', createdOpportunity.BWPS_DonationCode__c);
        System.assertEquals('Net Banking', createdOpportunity.BWPS_Payment_Method__c);
        System.assertEquals(100, createdOpportunity.Amount);
        System.assertEquals('', createdOpportunity.npsp__Tribute_Type__c);
        System.assertEquals('Test Honoree', createdOpportunity.npsp__Honoree_Name__c);
        System.assertEquals('Test Honoree Description', createdOpportunity.npsp__Notification_Message__c);
        System.assertEquals('Test Recipient', createdOpportunity.npsp__Notification_Recipient_Name__c);
        System.assertEquals('Test Recipient Address', createdOpportunity.npsp__Notification_Recipient_Information__c);
        System.assertEquals('test.recipient@example.com', createdOpportunity.npsp__Notification_Recipient_Email__c);
        
    }
    @isTest
    static void BWPS_CreateRecurringDonations_TEST() {
        Contact testContact = new Contact(FirstName = 'Test',
                                          LastName = 'Contact',
                                          Email = 'test@example.com',
                                          Phone = '1234567890'
                                         );
        insert testContact;
        Map<Object, Object> testDataMap = new Map<Object, Object> {
            'ContactDetails' => new Map<Object, Object> {
                'firstName' => testContact.FirstName,
                'lastName' => testContact.LastName,
                'Email' => testContact.Email,
                'Phone' => testContact.Phone,
                'MailingState' => 'Test State',
                'MailingCity' => 'Test City',
                'MailingCountry' => 'Test Country',
                'MailingPostalCode' => '12345',
                'MailingStreet' => 'Test Street',
                'HonoreeName' => 'Test Honoree',
                'HonoreeDescription' => 'Test Honoree Description',
                'RecipientName' => 'Test Recipient',
                'RecipientAddress' => 'Test Recipient Address',
                'RecipientEmail' => 'test.recipient@example.com'
            },
            'DonationDetails' => new Map<Object, Object> {
                'PaymentMethod' => 'Net Banking',
                'Amounts' => '100'
            }
        };
        Opportunity createdOpportunity = BWPS_DonarDashboardDonateFormClass.BWPS_CreateRecurringDonations(testDataMap,'123456');
        System.assertEquals('Test Contact', createdOpportunity.Name);
        System.assertEquals(date.today(), createdOpportunity.CloseDate);
        System.assertEquals('Pledged', createdOpportunity.StageName);
        System.assertEquals('4027', createdOpportunity.BWPS_DonationCode__c);
        System.assertEquals('Net Banking', createdOpportunity.BWPS_Payment_Method__c);
        System.assertEquals(100, createdOpportunity.Amount);
        System.assertEquals('', createdOpportunity.npsp__Tribute_Type__c);
        System.assertEquals('Test Honoree', createdOpportunity.npsp__Honoree_Name__c);
        System.assertEquals('Test Honoree Description', createdOpportunity.npsp__Notification_Message__c);
        System.assertEquals('Test Recipient', createdOpportunity.npsp__Notification_Recipient_Name__c);
        System.assertEquals('Test Recipient Address', createdOpportunity.npsp__Notification_Recipient_Information__c);
        System.assertEquals('test.recipient@example.com', createdOpportunity.npsp__Notification_Recipient_Email__c);
    }
}