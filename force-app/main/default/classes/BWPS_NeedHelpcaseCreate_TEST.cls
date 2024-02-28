@isTest
public class BWPS_NeedHelpcaseCreate_TEST {
	@isTest
   public static void createCase_Test(){
       try{
        
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        String ScheduleClassLineTestId=TestDataFactory.getScheduleClassLineItem();
        Id caseId = BWPS_NeedHelpcaseCreate.createCase(TestDataFactory.getCaseMap(), ScheduleClassLineTestId);
        Test.stopTest();
        Case createdCase = [SELECT Id, SuppliedEmail, SuppliedName, Description, Subject, Schedule_Class_Line_Item__c, Status, Type, Origin, Reason FROM Case LIMIT 1];

        System.assertEquals('test@example.com', createdCase.SuppliedEmail);
        System.assertEquals('John Doe', createdCase.SuppliedName);
        System.assertEquals('Test case body', createdCase.Description);
        System.assertEquals('Test case subject', createdCase.Subject);
        System.assertEquals(ScheduleClassLineTestId, createdCase.Schedule_Class_Line_Item__c);
        System.assertEquals('New', createdCase.Status);
        System.assertEquals('Problem', createdCase.Type);
        System.assertEquals('Web', createdCase.Origin);
        System.assertEquals('New problem', createdCase.Reason);
       }
       catch(Exception e){
           System.debug(e.getLineNumber());
           System.debug(e.getMessage());
           System.debug(e.getStackTraceString());
       }
    }
    @isTest
    static void getCaseNumber_Test(){
        Id CaseId=TestDataFactory.getCase();
        Case testCase=[select SuppliedName,SuppliedEmail,Description,Subject from Case where Id=:CaseId];
        List<Case> result = BWPS_NeedHelpcaseCreate.getCaseNumber(testCase.Id);

        // assert that the result contains the expected case
        System.assertEquals(1, result.size());
        Case retrievedCase = result[0];
        System.assertEquals(testCase.Subject, retrievedCase.Subject);
        System.assertEquals(testCase.Description, retrievedCase.Description);
        System.assertEquals(testCase.SuppliedEmail, retrievedCase.SuppliedEmail);
        System.assertEquals(testCase.SuppliedName, retrievedCase.SuppliedName);
    }
    @isTest
    static void CreateCaseForSubscription_Test(){
        String caseMail = 'test@example.com';
        ID caseId = BWPS_NeedHelpcaseCreate.CreateCaseForSubscription(caseMail);
        
        // Verify that the case was created successfully
        Case createdCase = [SELECT Id, SuppliedEmail, Description, Subject, Status, Type, Origin, Reason FROM Case WHERE Id = :caseId];
        System.assertEquals(caseMail, createdCase.SuppliedEmail);
        System.assertEquals(caseMail, createdCase.Description);
        System.assertEquals(caseMail, createdCase.Subject);
        System.assertEquals('New', createdCase.Status);
        System.assertEquals('Problem', createdCase.Type);
        System.assertEquals('Web', createdCase.Origin);
        System.assertEquals('New problem', createdCase.Reason);
    }
    @isTest
    static void CreateCaseForSupport_Test(){
        //Id portalUserId=
        System.runAs(new User(Id=TestDataFactory.getPortalUser())) {
            Id contactId = [select contactId from user where id = :userinfo.getUserId() LIMIT 1].contactId;
        	String caseMail = [select Email from contact where Id = :contactId LIMIT 1].Email;
            // Call the CreateCaseForSupport method
            Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator());
            Test.startTest();
            ID caseId = BWPS_NeedHelpcaseCreate.CreateCaseForSupport(TestDataFactory.getCaseMap());
            Test.stopTest();
            // Retrieve the inserted Case and check that it was created successfully
            Case createdCase = [SELECT Id, Subject, Description, SuppliedEmail FROM Case WHERE Id = :caseId];
            System.assertEquals('Test case subject', createdCase.Subject);
            System.assertEquals('Test case body', createdCase.Description);
            System.assertEquals(caseMail, createdCase.SuppliedEmail);
        }
    }
	@isTest
    static void testCreateLeadforNewsLetter() {
        Test.startTest();
        String leadId = BWPS_NeedHelpcaseCreate.CreateLeadforNewsLetter(TestDataFactory.getLeadDetails());
        Test.stopTest();

        // Verify that a lead was created
        System.assertEquals(1, [SELECT COUNT() FROM Lead WHERE Id = :leadId]);

        // Verify lead field values
        Lead testLead = [SELECT Email, Description, Title, LastName, Status, Company, LeadSource FROM Lead WHERE Id = :leadId];
        System.assertEquals('test@example.com', testLead.Email);
        System.assertEquals('Test lead description', testLead.Description);
        System.assertEquals('Test lead subject', testLead.Title);
        System.assertEquals('test', testLead.LastName);
        System.assertEquals('Open - Not Contacted', testLead.Status);
        System.assertEquals('Company', testLead.Company);
        System.assertEquals('Web', testLead.LeadSource);
    }
}