@isTest
public class bwps_websiteGeneralFaqClassTest {
	
    /*@testSetup
    static void CreateDataForTest(){
        FAQ__c faq = new FAQ__c(Name = 'test', Answer__c = 'test', Type__c ='About Us Website General');
        insert faq;
    }*/
    
    @IsTest
    static void testGetAboutUsFaq() {
        FAQ__c faq = new FAQ__c(Name='Test FAQ', Answer__c='Test answer', Type__c='About Us Website General');
        insert faq;

        List<FAQ__c> result = bwps_websiteGeneralFaqClass.getAboutUsFaq();

        System.assertEquals(1, result.size());
        System.assertEquals('Test FAQ', result[0].Name);
        System.assertEquals('Test answer', result[0].Answer__c);
        System.assertEquals('About Us Website General', result[0].Type__c);
    }
    
    @IsTest
    static void testGetEducationalResources() {
        BWPS_Resource__c resource = new BWPS_Resource__c(Name='Test resource', Description__c='Test description', Type__c='Educational Resources', Dashboard__c='Website General');
        insert resource;

        List<BWPS_Resource__c> result = bwps_websiteGeneralFaqClass.getEducationalResources();

        System.assertEquals(1, result.size());
        System.assertEquals('Test resource', result[0].Name);
        System.assertEquals('Test description', result[0].Description__c);
        System.assertEquals('Educational Resources', result[0].Type__c);
        //System.assertEquals('Website General', result[0].Dashboard__c);
    }

    @IsTest
    static void testGetStories() {
        BWPS_Resource__c story = new BWPS_Resource__c(Name='Test story', Description__c='Test description', Type__c='Stories', Dashboard__c='Website General');
        insert story;

        List<BWPS_Resource__c> result = bwps_websiteGeneralFaqClass.getStories();

        System.assertEquals(1, result.size());
        System.assertEquals('Test story', result[0].Name);
        System.assertEquals('Test description', result[0].Description__c);
        System.assertEquals('Stories', result[0].Type__c);
        //System.assertEquals('Website General', result[0].Dashboard__c);
    }

    @IsTest
    static void testGetSingleResource() {
        BWPS_Resource__c resource = new BWPS_Resource__c(Name='Test resource', Description__c='Test description', Type__c='Educational Resources', Dashboard__c='Website General');
        insert resource;

        List<BWPS_Resource__c> result = bwps_websiteGeneralFaqClass.getSingleResource(resource.Id);

        System.assertEquals(1, result.size());
        System.assertEquals('Test resource', result[0].Name);
        System.assertEquals('Test description', result[0].Description__c);
        System.assertEquals('Educational Resources', result[0].Type__c);
        //System.assertEquals('Website General', result[0].Dashboard__c);
    }
}