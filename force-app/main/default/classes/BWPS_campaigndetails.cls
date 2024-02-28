public without sharing class BWPS_campaigndetails {
    @AuraEnabled
    public static list<Campaign> campaignDetails(){
        list<Campaign> campaigns = [SELECT Id, Name,Description,IsActive FROM Campaign  WHERE IsActive = true];
        return campaigns;
    }
}