@isTest
public class bwps_SignIn_TEST {

    @isTest
    static void TestdoLogin(){
        
        Test.startTest();
        String result = bwps_SignIn.doLogin('test@test.com', 'Test@123');
        Test.stopTest();
    }
}