@isTest
public class BWPS_ShareScheduleClass_TEST {
    @isTest
    public static void CreateLeadforContactUs_TEST(){
        // Create a test lead details map
        Map<Object,Object> leadDetails = new Map<Object,Object>();
        leadDetails.put('Email', 'test@example.com');
        leadDetails.put('Message', 'This is a test message');
        leadDetails.put('Name', 'Test User');

        // Create a test lead object
        Object leadObject = new Map<Object,Object>{'LeadDetails' => leadDetails};

        // Call the function to create the lead
        String leadId = BWPS_ShareScheduleClass.CreateLeadforContactUs(leadObject);

        // Retrieve the inserted lead and verify its fields
        Lead insertedLead = [SELECT Email, Description, Title, LastName, Phone, Status, Company, LeadSource FROM Lead WHERE Id = :leadId];
        System.assertEquals('test@example.com', insertedLead.Email);
        System.assertEquals('This is a test message', insertedLead.Description);
        System.assertEquals('Test User', insertedLead.Title);
        System.assertEquals('Test User', insertedLead.LastName);
        System.assertEquals('Open - Not Contacted', insertedLead.Status);
        System.assertEquals('Company', insertedLead.Company);
        System.assertEquals('Web', insertedLead.LeadSource);
    }
	@isTest
    public static void CreateLeadforScheduleClassshared_TEST(){
        // Create a test lead details map
        Map<Object,Object> leadDetails = new Map<Object,Object>();
        leadDetails.put('Email', 'test@example.com');
        leadDetails.put('Body', 'This is a test message');
        leadDetails.put('Subject', 'Test User');

        // Create a test lead object
        Object leadObject = new Map<Object,Object>{'LeadDetails' => leadDetails};

        // Call the function to create the lead
        String leadId = BWPS_ShareScheduleClass.CreateLeadforScheduleClassshared(leadObject);

        // Retrieve the inserted lead and verify its fields
        Lead insertedLead = [SELECT Email, Description, Title, LastName, Phone, Status, Company, LeadSource FROM Lead WHERE Id = :leadId];
        System.assertEquals('test@example.com', insertedLead.Email);
        System.assertEquals('Test User', insertedLead.Title);
        System.assertEquals('This is a test message', insertedLead.Description);
        System.assertEquals('test', insertedLead.LastName);
        System.assertEquals('Open - Not Contacted', insertedLead.Status);
        System.assertEquals('Company', insertedLead.Company);
        System.assertEquals('Web', insertedLead.LeadSource);
    }
}