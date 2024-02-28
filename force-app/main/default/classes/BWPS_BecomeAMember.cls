public without sharing class BWPS_BecomeAMember {
    @AuraEnabled
    public static String createOpportunityForCurrentUser(){

        Opportunity CreateOpportunity = new Opportunity(); 
        ChargentOrders__ChargentOrder__c NewChargetnOrder = new ChargentOrders__ChargentOrder__c();
        String OppContact;
        String OppAccount;
        String donationId ;
        String gatewayId ;
        String ChargentOrderId;
        String currentUserName;
        try{
            String UserId = UserInfo.getUserId();
            list<User> userDetails = [SELECT Id, ContactId, UserName FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
            if(userDetails.size()>0){
                OppContact = userDetails[0].ContactId;
                currentUserName = userDetails[0].UserName;
            }    
            contact condetails = [SELECT Id,FirstName,lastname, AccountId FROM contact WHERE Id =: OppContact];
            OppAccount = condetails.AccountId;
            date myDate = System.today();
            date EndDate = myDate.addYears(1);
            List<ChargentBase__Gateway__c> gateways = [SELECT ID ,Name,ChargentBase__Active__c FROM ChargentBase__Gateway__c WHERE ChargentBase__Active__c = true];
            If(gateways.size() > 0){
                gatewayId = gateways[0].Id;
                System.debug('gATEWAY id '+ gatewayId);
                NewChargetnOrder.ChargentOrders__Gateway__c = gatewayId ;
                 NewChargetnOrder.ChargentOrders__Charge_Amount__c = 50;
                 NewChargetnOrder.ChargentOrders__Shipping__c = 50;
                NewChargetnOrder.ChargentOrders__Tax__c  = 0;
                NewChargetnOrder.ChargentOrders__Subtotal__c = 50;
                Insert NewChargetnOrder;
                ChargentOrderId = NewChargetnOrder.Id;
                System.debug('NewChargetnOrder '+NewChargetnOrder.Id);
                System.debug('ChargentOrderId '+ ChargentOrderId);
            }
            CreateOpportunity.Name = condetails.FirstName +' '+condetails.lastname;
            CreateOpportunity.CloseDate = EndDate;
            CreateOpportunity.StageName = 'Pledged';
            CreateOpportunity.AccountId = OppAccount;
            CreateOpportunity.BWPS_DonationCode__c = '4027';
            CreateOpportunity.BWPS_Paid__c = true;
            CreateOpportunity.BWPS_Chargent_Order__c = ChargentOrderId;
            CreateOpportunity.npsp__Primary_Contact__c = OppContact;
            //CreateOpportunity.BWPS_Payment_Method__c = String.valueOf(DonationDetailsMap.get('PaymentMethod'));
            CreateOpportunity.Amount = 100;
            Database.insert(CreateOpportunity,false);
            System.debug('Opportunity Insert');
            System.debug('Opportunity Insert' +CreateOpportunity.Id);
            donationId  = CreateOpportunity.Id;
        }
        catch(Exception e){
            AuraHandledException ex = new AuraHandledException(e.getMessage());
            system.debug('error message '+e.getMessage());
            system.debug('error line '+e.getLineNumber());
        }
        System.debug('end of : ' +CreateOpportunity);
        return CreateOpportunity.Id + ',' + currentUserName;
    }
}