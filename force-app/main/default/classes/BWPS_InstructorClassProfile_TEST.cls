@isTest
public class BWPS_InstructorClassProfile_TEST {

    @isTest
    static void TestfetchImage(){
        
        Achievement__c ach = TestDataFactory.getAchievement();
        String resultId = TestDataFactory.getContentVersion();
        ContentDocumentLink data = TestDataFactory.getContentDocumentLinkId(ach.Id, resultId);
        
        System.debug('data====> '+data);

        Test.startTest();
        BWPS_InstructorClassProfile.fetchImage();
        Test.stopTest();
       
    }
    
    @isTest
    static void TestfetchCardsDerail(){
        
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        
        TestDataFactory.getPaymentMethod(userContact);
        System.runAs(u){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            
            List<Payment_Method__c> result = BWPS_InstructorClassProfile.fetchCardsDerail();
            Test.stopTest();
            System.debug(result.size());
            System.assertEquals('Test', result[0].Name__c);
        }
    }
    
    @isTest
    static void TestfetchPaymentDetail(){
        
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        
        Payment_Method__c PaymentMethodResult = TestDataFactory.getPaymentMethod(userContact);
       
        String PaymentMethodResultId = PaymentMethodResult.Id;
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
        
            Payment_Method__c result = BWPS_InstructorClassProfile.fetchPaymentDetail(PaymentMethodResultId);
            Test.stopTest();
            
          System.assertEquals(PaymentMethodResultId, result.Id);
        
    }
    
     @isTest
    static void TestDeletePaymentRecord(){
        
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        
        Payment_Method__c PaymentMethodResult = TestDataFactory.getPaymentMethod(userContact);
       
        String PaymentMethodResultId = PaymentMethodResult.Id;
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            BWPS_InstructorClassProfile.deletePaymentRecord(PaymentMethodResultId);
            Test.stopTest();
    }
    
    @isTest
    static void TestfetchAchievementDetail(){
        Id userId=TestDataFactory.getPortalUser();
        User u=[select contactId from User where id=:userId];
        Id userContact=u.ContactId;
        TestDataFactory.getAchievementByContactId(userContact);
        
        System.runAs(u){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            list<Achievement__c> results = BWPS_InstructorClassProfile.fetchAchievementDetail();
            Test.stopTest();
            
            System.assertEquals(userContact, results[0].Contact__c);
        }
    }
}