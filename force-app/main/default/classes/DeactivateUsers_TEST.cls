@isTest
public class DeactivateUsers_TEST {
    @isTest
    public static void batch_TEST(){
        TestDataFactory.getPortalUser();
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator()); 
        DeactivateUsers batch = new DeactivateUsers();
        Database.executeBatch(batch);
        Test.stopTest();
    }

}