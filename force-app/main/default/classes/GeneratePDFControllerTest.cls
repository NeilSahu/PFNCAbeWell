@isTest
public class GeneratePDFControllerTest {

    @isTest
    static void TestSave(){
        String OppId = TestDataFactory.getOpportunity();
        
        //Opportunity opp = [SELECT Id , Name, Amount, CloseDate, BWPS_Payment_Method__c, BWPS_Paid__c from Opportunity where Id = :OppId];
        
        Test.startTest();
        GeneratePDFController.save(OppId);
        Test.stopTest();
    }
    
    @isTest
    static void TestPaymentHistoryPdf(){
        String PaymentOppId = TestDataFactory.getPaymentId();
        
        Test.startTest();
        GeneratePDFController.PaymentHistoryPdf(PaymentOppId);
        Test.stopTest();
    }
}