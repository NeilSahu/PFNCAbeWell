public without sharing class bwps_websiteGeneralFaqClass {
    @AuraEnabled(cacheable=true)
    public static List<FAQ__c> getAboutUsFaq(){
        List<FAQ__c> getFaq =[SELECT Name,Answer__c,Type__c FROM FAQ__c WHERE Type__c ='About Us Website General'];
        return getFaq;
    }
    @AuraEnabled(cacheable=true)
    public static List<BWPS_Resource__c> getEducationalResources(){
        List<BWPS_Resource__c> getEduResources =[SELECT Name,Description__c, ResouceImageUrl__c,Type__c,CreatedBy.FirstName, CreatedBy.LastName, CreatedDate FROM BWPS_Resource__c WHERE Type__c = 'Educational Resources' AND Dashboard__c='Website General' ORDER BY CREATEDDATE DESC LIMIT 4];
        return getEduResources;
    }
    @AuraEnabled(cacheable=true)
    public static List<BWPS_Resource__c> getStories(){
        List<BWPS_Resource__c> storiesRec =[SELECT Name,Description__c,ResouceImageUrl__c, Type__c,CreatedBy.FirstName, CreatedBy.LastName, CreatedDate FROM BWPS_Resource__c WHERE Type__c = 'Stories' AND Dashboard__c='Website General' ORDER BY CREATEDDATE DESC LIMIT 3];
        return storiesRec;
    }
    @AuraEnabled(cacheable=true)
    public static List<BWPS_Resource__c> getSingleResource(String resId){
        List<BWPS_Resource__c> resRec =[SELECT Name,Description__c, ResouceImageUrl__c, Type__c,BWPS_Link__c,CreatedBy.FirstName, CreatedBy.LastName, CreatedDate FROM BWPS_Resource__c WHERE Id=: resId];
        return resRec;
    }
}