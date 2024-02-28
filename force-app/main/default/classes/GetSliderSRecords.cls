public without sharing class GetSliderSRecords {
    @AuraEnabled
    public static List<slide__c> GetAllSliderRecords(){
        List<slide__c> AllSilderRecords = new List<slide__c>();     
            AllSilderRecords = [SELECT Id,Name,SliderURL__c,description__c FROM slide__c WHERE Active__c = true];
            return AllSilderRecords;
    }
    @AuraEnabled
    public static List<About_Us__c> GetAboutUs(){
        List<About_Us__c> AllAboutUsRecords = new List<About_Us__c>();     
            AllAboutUsRecords = [SELECT Id,Name,description__c,Title__c,Photo_URL__c,Type__c FROM About_Us__c WHERE Type__c = 'How It All Started'order by CreatedDate ASC LIMIT 2];
            return AllAboutUsRecords;
    }
    @AuraEnabled
    public static List<About_Us__c> GetAboutUsPaltform(){
        List<About_Us__c> AllAboutUsRecords = new List<About_Us__c>();     
            AllAboutUsRecords = [SELECT Id,Name,description__c,Title__c,Photo_URL__c,Type__c FROM About_Us__c WHERE Type__c = 'Parkinson Platform' order by CreatedDate DESC LIMIT 1];
            return AllAboutUsRecords;
    }
    @AuraEnabled(cacheable=true)
    public static List<Testimonial__c> testimonialAboutUs(){
        List<Testimonial__c> Alltestimonials = new List<Testimonial__c>();     
            Alltestimonials = [SELECT Id,Name,testimonial_designation__c,Type__c,testimonial_Name__c,testimonialquote__c,Photo_URL__c FROM Testimonial__c WHERE Type__c = 'About Us' order by CreatedDate DESC LIMIT 3];
            return Alltestimonials;
    }
    @AuraEnabled(cacheable=true)
    public static List<Testimonial__c> testimonialDonation(){
        List<Testimonial__c> Alltestimonials = new List<Testimonial__c>();     
            Alltestimonials = [SELECT Id,Name,testimonial_designation__c,Type__c,testimonial_Name__c,testimonialquote__c,Photo_URL__c FROM Testimonial__c WHERE Type__c = 'Donation' order by CreatedDate DESC LIMIT 3];
            return Alltestimonials;
    }
}