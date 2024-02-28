@isTest
public class ZoomIframeController_TEST {

    @isTest
    static void TestgenerateSignature(){
        
        Test.startTest();
        String result = ZoomIframeController.generateSignature('test', 'test', 'test', '123');
        Test.stopTest();
        
        System.assertEquals(242, result.length());
    } 
    
}