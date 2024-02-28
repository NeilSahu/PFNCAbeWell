public class BWPS_ChargentOrderUpdate {
    public static void ChargentRecurringUpdate(map<Id,Opportunity> OppMap){
        list<ChargentOrders__ChargentOrder__c> ChargentnOrderUpdteList = New list<ChargentOrders__ChargentOrder__c>();
        System.debug('inside helper ');
        set<Id> chOrderid = New set<Id>();
      List<Opportunity> OppDataList = [SELECT Id,name,AccountId, CloseDate, ContactId, Description, 
                                   Amount,BWPS_Chargent_Order__c,BWPS_Payment_Count__c,BWPS_Payment_Start_Date__c,
                                       BWPS_Payment_End_Date__c,BWPS_Payment_Frequency__c,BWPS_Payment_Stop__c FROM Opportunity WHERE Id IN :OppMap.keyset()]; 
        System.debug('OppDataList '+OppDataList);
        for(Opportunity opp:OppDataList){
            chOrderid.add(opp.BWPS_Chargent_Order__c);
        }
        system.debug('chOrderid '+chOrderid);
        list<ChargentOrders__ChargentOrder__c> ChargetnOrderList = [SELECT Id,Name ,ChargentOrders__Payment_Frequency__c, 
                                   ChargentOrders__Payment_Status__c, ChargentOrders__Payment_Count__c, 
                                   ChargentOrders__Charge_Date__c, ChargentOrders__Payment_Start_Date__c,
                                   ChargentOrders__Payment_End_Date__c, 
                                   ChargentOrders__Next_Scheduled_Payment__c,ChargentOrders__Charge_Amount__c,ChargentOrders__Payment_Stop__c FROM ChargentOrders__ChargentOrder__c WHERE Id IN: chOrderid];
        System.debug('ChargetnOrderList '+ChargetnOrderList);
        for(Opportunity Opps : OppDataList){
            System.debug('inside first for');
            for(ChargentOrders__ChargentOrder__c chOrd:ChargetnOrderList){
                System.debug('inside second for');
                //if(Opps.BWPS_Chargent_Order__c != null && Opps.BWPS_Chargent_Order__c !=''){
                    System.debug('inside first if');
                if(Opps.BWPS_Chargent_Order__c==chOrd.Id){
                    System.debug('inside second if');
                    chOrd.ChargentOrders__Payment_Stop__c = Opps.BWPS_Payment_Stop__c;
                    chOrd.ChargentOrders__Payment_Frequency__c = Opps.BWPS_Payment_Frequency__c;
                    chOrd.ChargentOrders__Payment_End_Date__c = Opps.BWPS_Payment_End_Date__c;
                    chOrd.ChargentOrders__Payment_Start_Date__c	 = Opps.BWPS_Payment_Start_Date__c;
                    chOrd.ChargentOrders__Payment_Count__c	 = Opps.BWPS_Payment_Count__c;
                    
                    chOrd.ChargentOrders__Payment_Status__c = 'Recurring';
                    ChargentnOrderUpdteList.Add(chOrd);
                  }
                //}
            }
        }
          Integer orderlength = ChargentnOrderUpdteList.Size();
        system.Debug('ChargentnOrderUpdteList ');
        for(ChargentOrders__ChargentOrder__c tr:ChargentnOrderUpdteList){
            system.debug('tr '+tr);
        }
        System.debug('orderlength '+orderlength);
        if(orderlength>0){
            System.debug('before update ');
         Database.SaveResult[] srList = database.update(ChargentnOrderUpdteList,false);
        for (Database.SaveResult sr : srList) {
         if (sr.isSuccess()) {
           // Operation was successful, so get the ID of the record that was processed
           System.debug('Successfully update Chargent Order ID: ' + sr.getId());
          }
         else {
               // Operation failed, so get all errors                
               for(Database.Error err : sr.getErrors()) {
                  System.debug('The following error has occurred.');                    
                  System.debug(err.getStatusCode() + ': ' + err.getMessage());
                System.debug('chargent order fields that affected this error: ' + err.getFields());
              }
            }
          }
      }
    }
}