public class BWPS_InstructorResourcesData {
	
    
    	 @AuraEnabled(cacheable=true)
    public static List<Quizes__c> fetchQuizesDetail(){
     	
        return [SELECT Name, Id, Description__c FROM Quizes__c order by name ASC];
    }
    
     	 @AuraEnabled(cacheable=true)
    public static List<SampleClassFlows__c> fetchSampleDetail(){
     	
        return [SELECT Name, Id,Date__c, Description__c,SampleImage__c FROM SampleClassFlows__c order by name ASC];
    }
}