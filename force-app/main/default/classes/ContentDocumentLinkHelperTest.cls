@isTest
public class ContentDocumentLinkHelperTest {
    @isTest
    static void testGeneratePublicLink(){
        Blog__c i=TestDataFactory.getBlogs();
        Id i2=TestDataFactory.getContentVersion();
        ContentDocumentLink cdl=TestDataFactory.getContentDocumentLinkId(i.Id,i2);
        List<ContentDocumentLink> lis=new List<ContentDocumentLink>{cdl};
         Test.startTest();
        ContentDocumentLinkHelper.GeneratePublicLink(lis);
        Test.stopTest();
        
    }

}