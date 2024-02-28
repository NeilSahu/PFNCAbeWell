public class CreatingScheduleClassLineItemBatch implements Database.Batchable<sObject>{

   public final String Query;
   public CreatingScheduleClassLineItemBatch(String q){
         System.debug('inside batch class for creating schedule class line item');
      Query=q; 
   }

   public Database.QueryLocator start(Database.BatchableContext BC){
      return Database.getQueryLocator(query);
   }

   public void execute(Database.BatchableContext BC, List<sObject> scope){
     for(sobject s : scope){
     
     }
     update scope;
    }

   public void finish(Database.BatchableContext BC){
   }
}