@isTest
public class GetSliderSRecords_TEST {
	@isTest
    static void GetAllSliderRecords_TEST(){
        slide__c s=new slide__c(Name='Slide 1',SliderURL__c='https://mock',description__c='Desc', Active__c=true);
        insert s;
        GetSliderSRecords.GetAllSliderRecords();
    }
    @isTest
    static void GetAboutUs_TEST(){
        About_Us__c s=new About_Us__c(description__c='Desc', Title__c='title',Photo_URL__c='https://mock',Type__c='How It All Started');
        insert s;
        GetSliderSRecords.GetAboutUs();
    }
    @isTest
    static void GetAboutUsPaltform_TEST(){
        About_Us__c s=new About_Us__c(description__c='Desc', Title__c='title',Photo_URL__c='https://mock',Type__c='Parkinson Platform');
        insert s;
        GetSliderSRecords.GetAboutUsPaltform();
    }
    @isTest
    static void testimonialAboutUs_TEST(){
        Testimonial__c s=new Testimonial__c(testimonial_designation__c='hello',Type__c='About Us',testimonial_Name__c='name',testimonialquote__c='quote',Photo_URL__c='https://mock');
        insert s;
        GetSliderSRecords.testimonialAboutUs();
    }
    @isTest
    static void testimonialDonation(){
        Testimonial__c s=new Testimonial__c(testimonial_designation__c='hello',Type__c='Donation',testimonial_Name__c='name',testimonialquote__c='quote',Photo_URL__c='https://mock');
        insert s;
        GetSliderSRecords.testimonialDonation();
    }
    
    
    
}