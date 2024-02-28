@isTest
private class BWPS_ChargentOrderUpdateTest {
    @isTest
    static void testChargentRecurringUpdate() {
        // Create test account
        //Account testAccount = new Account(Name = 'Test Account');
        //insert testAccount;
        TestDataFactory.getAccount();
       Account testAccount=[select id from account];
        
        // Create test opportunity with a related Chargent Order
        ChargentOrders__ChargentOrder__c testChargentOrder = new ChargentOrders__ChargentOrder__c(
            ChargentOrders__Payment_Status__c = 'Active'
        );
        insert testChargentOrder;
        
       TestDataFactory.getOpportunity();
       // insert testOpportunity;
       opportunity testOpportunity=[select BWPS_Payment_Count__c, BWPS_Payment_Start_Date__c,BWPS_Payment_End_Date__c,BWPS_Payment_Frequency__c,BWPS_Payment_Stop__c,id from opportunity limit 1];
        testOpportunity.BWPS_Chargent_Order__c=testChargentOrder.id;
        testOpportunity.BWPS_Payment_Frequency__c='Once';
        update testOpportunity;
        // Call the ChargentRecurringUpdate method with the test opportunity
        Map<Id, Opportunity> oppMap = new Map<Id, Opportunity>{ testOpportunity.Id => testOpportunity };
        Test.startTest();
        BWPS_ChargentOrderUpdate.ChargentRecurringUpdate(oppMap);
        Test.stopTest();
        
        // Verify that the Chargent Order was updated correctly
        ChargentOrders__ChargentOrder__c updatedChargentOrder = [SELECT Id, ChargentOrders__Payment_Status__c, ChargentOrders__Payment_Count__c, ChargentOrders__Payment_Start_Date__c, ChargentOrders__Payment_End_Date__c, ChargentOrders__Payment_Frequency__c, ChargentOrders__Payment_Stop__c FROM ChargentOrders__ChargentOrder__c WHERE Id = :testChargentOrder.Id];
       System.assertEquals('Active', updatedChargentOrder.ChargentOrders__Payment_Status__c);
        System.assertEquals(testOpportunity.BWPS_Payment_Count__c, updatedChargentOrder.ChargentOrders__Payment_Count__c);
        System.assertEquals(testOpportunity.BWPS_Payment_Start_Date__c, updatedChargentOrder.ChargentOrders__Payment_Start_Date__c);
        System.assertEquals(testOpportunity.BWPS_Payment_End_Date__c, updatedChargentOrder.ChargentOrders__Payment_End_Date__c);
        System.assertEquals(testOpportunity.BWPS_Payment_Frequency__c, updatedChargentOrder.ChargentOrders__Payment_Frequency__c);
        System.assertEquals(testOpportunity.BWPS_Payment_Stop__c, updatedChargentOrder.ChargentOrders__Payment_Stop__c);
    }
}