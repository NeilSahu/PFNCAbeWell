@isTest
public class bwps_WIP_blogsController_TEST {

    @isTest
    static void TestgetBlogs(){
        
        TestDataFactory.getBlogs();
        
        Test.startTest();
        List<Blog__c> blogList = bwps_WIP_blogsController.getBlogs();
        Test.stopTest();
        
        System.assertEquals(1, blogList.size());
        
    }
    
    @isTest
    static void TestgetRecentBlogs(){
        
        TestDataFactory.getBlogs();
        
        Test.startTest();
        List<Blog__c> blogList = bwps_WIP_blogsController.getRecentBlogs(1);
        Test.stopTest();
        
        System.assertEquals(1, blogList.size());
        
    }
    
    @isTest
    static void TestgetFAQ(){
        
        TestDataFactory.getFAQ();
        
        Test.startTest();
        List<FAQ__c> faqList = bwps_WIP_blogsController.getAllFaqRecords();
        Test.stopTest();
        
        System.assertEquals(1, faqList.size());
        
    }
    
    @isTest
    static void TestgetAllFaqRecords1(){
        
        TestDataFactory.getFAQTypeLogin();
        
        Test.startTest();
        List<FAQ__c> faqList = bwps_WIP_blogsController.getAllFaqRecords1('Login');
        Test.stopTest();
        
        System.assertEquals(1, faqList.size());
        
    }
    
    @isTest
    static void TestpopularQuestion(){
        
        TestDataFactory.getFAQTypeLogin();
        
        Test.startTest();
        List<FAQ__c> faqList = bwps_WIP_blogsController.popularQuestion();
        Test.stopTest();
        
        System.assertEquals(1, faqList.size());
        
    }
    @isTest
    static void TestgetBlogImages(){
        ContentDocumentLink cdli=TestDataFactory.getContentDocumentLinkId(TestDataFactory.getAccount(), TestDataFactory.getContentVersion());
        Test.startTest();
        bwps_WIP_blogsController.getBlogImages(cdli.Id);
        Test.stopTest();
            
    }
    
}