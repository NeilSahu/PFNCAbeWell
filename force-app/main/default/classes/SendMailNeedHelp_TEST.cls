@isTest
public class SendMailNeedHelp_TEST {

    
    @isTest
    static void TestSendingEmail(){
        
        List<Case> testCases = new List<Case>();
        Case testCase1 = new Case(Subject = 'Test Subject 1', Description = 'Test Description 1', SuppliedEmail = 'test1@example.com');
        Case testCase2 = new Case(Subject = 'Test Subject 2', Description = 'Test Description 2', SuppliedEmail = 'test2@example.com');
        testCases.add(testCase1);
        testCases.add(testCase2);
        
        Test.startTest();
        SendMailNeedHelp.sendingEmail(testCases);
        Test.stopTest();
   
    }
}