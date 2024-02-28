@isTest
public class BWPS_DonationHistoryClass_TEST {
    
    @isTest
    static void BWPS_DonationHistoryMethod_TEST() {
        System.runAs(new User(Id = UserInfo.getUserId())) {
            List<ChargentOrders__ChargentOrder__c> chargentOrderRecords = BWPS_DonationHistoryClass.BWPS_DonationHistoryMethod();
            System.assertNotEquals(null, chargentOrderRecords);
        }
    }
    
    @isTest
    static void GetOppPDFDocId_TEST() {
        Opportunity opp = new Opportunity(Name = 'Test Opportunity', Amount = 500.0, BWPS_Paid__c = true, BWPS_Payment_Method__c = 'Net Banking',CloseDate = Date.today(),stageName='Prospecting');
        insert opp;
        ContentVersion conVersion = new ContentVersion(
            Title = 'Test Document', 
            // FileType = 'pdf', 
            ContentUrl='https://www.google.com/abc.pdf'
            //VersionData = Blob.valueOf('Test Data')
        );
        insert conVersion;
        ContentDocumentLink cdl = new ContentDocumentLink(
            ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :conVersion.Id][0].ContentDocumentId, 
            LinkedEntityId = opp.Id
        );
        insert cdl;
        BWPS_DonationHistoryClass.getOppPDFDocId(opp.id);
    }
    
    @isTest
    static void BWPS_ShowDetails_TEST() {
        Opportunity opp = new Opportunity(Name = 'Test Opportunity', Amount = 500.0, BWPS_Paid__c = true, BWPS_Payment_Method__c = 'Net Banking',CloseDate = Date.today(),stageName='Prospecting');
        insert opp;
        Opportunity result = BWPS_DonationHistoryClass.BWPS_ShowDetails(opp.Id);
        System.assertEquals(opp.Id, result.Id);
        System.assertEquals(opp.Name, result.Name);
        System.assertEquals(opp.Amount, result.Amount);
        System.assertEquals(opp.BWPS_Paid__c, result.BWPS_Paid__c);
        System.assertEquals(opp.BWPS_Payment_Method__c, result.BWPS_Payment_Method__c);
    }
    
    @isTest
    static void DownloadAllReceiptPDF_TEST() {
        Opportunity opp1 = new Opportunity(Name = 'Test Opportunity 1', Amount = 500.0, BWPS_Paid__c = true, BWPS_Payment_Method__c = 'Net Banking', CloseDate = Date.today(),stageName='Prospecting');
        insert opp1;
        Opportunity opp2 = new Opportunity(Name = 'Test Opportunity 2', Amount = 750.0, BWPS_Paid__c = false, BWPS_Payment_Method__c = 'Net Banking', CloseDate = Date.today().addDays(-1),stageName='Prospecting');
        insert opp2;
        System.runAs(new User(Id = UserInfo.getUserId())) {
            String result = BWPS_DonationHistoryClass.downloadAllReceiptPDF();
            System.assertNotEquals(null, result);
        }
    }
    
}