public without sharing class bwps_WIP_blogsController {

    @AuraEnabled(cacheable=true)
    public static list<Blog__c> getBlogs(){

        List<Blog__c> blogList = new List<Blog__c>();

        // try{
            blogList = [select Id, Name, BWPS_Category__c, BWPS_Blog_content__c, BWPS_Blog_content1__c,BWPS_Image_Base64code__c,BWPS_Blog_Image__c,BlogHeaderUrl__c,BWPS_Discription__c, CreatedBy.FirstName, CreatedBy.LastName, CreatedDate from Blog__c ORDER BY CreatedDate DESC];
            return blogList;
        // }
        // catch(exception e){
        //     throw e;
        // }
    }

    @AuraEnabled
    public static List<ID> getBlogImages(String recordId)
    {
        List<ContentDocumentLink> files = [SELECT ContentDocumentId , ContentDocument.LatestPublishedVersionId , ContentDocument.LatestPublishedVersion.VersionData FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
        List<ID> fileIDs = new List<ID>();
        for (ContentDocumentLink docLink : files) {
            fileIDs.add(docLink.ContentDocumentId);
        }

        return fileIDs;
    }


    @AuraEnabled(cacheable=true)
    public static list<Blog__c> getRecentBlogs(Integer numberOfBlogs){

        List<Blog__c> blogList = new List<Blog__c>();

        // try{
            blogList = [select Id, Name, BWPS_Category__c, BWPS_Blog_content__c, BWPS_Blog_content1__c,BWPS_Image_Base64code__c,BWPS_Blog_Image__c,BlogHeaderUrl__c,BWPS_Discription__c, CreatedBy.FirstName, CreatedBy.LastName, CreatedDate from Blog__c ORDER BY CreatedDate DESC LIMIT :numberOfBlogs];
            return blogList;
        // }
        // catch(exception e){
        //     throw e;
        // }
    }

     @AuraEnabled(cacheable=true)
    public static List<FAQ__c> getAllFaqRecords(){
        List<FAQ__c> faqList = [Select Id, Name, Answer__c From FAQ__c];
        return faqList; 
    }
         @AuraEnabled(cacheable=true)
    public static List<FAQ__c> popularQuestion(){
        List<FAQ__c> faqList = [SELECT Id,Name, Answer__c, Popular_Question__c FROM FAQ__c where Popular_Question__c =true];
        return faqList; 
    }
    
    @AuraEnabled(cacheable=true)
    public static List<FAQ__c> getAllFaqRecords1(string faqsType){
        
        system.debug('faqsType'+faqsType);
        List<FAQ__c> faqList = [Select Id, Name, Answer__c,Type__c From FAQ__c where Type__c =:faqsType];
        
        system.debug('faqsType'+faqList);
        return faqList; 
    }
}