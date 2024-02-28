@isTest
public class UserTriggerController_TEST {
    @testSetup
    public static void setup(){
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        TestDataFactory.getPortalUser();
        Test.stopTest();
    }
	@isTest
    public static void main(){
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        User u=[select FirstName,ProfileId,Profile.Name from User where Profile.Name='Partner Community User'];
        Profile p=[select Id from Profile where Name='Member User'];
        u.ProfileId=p.Id;
        update u;
        Test.stopTest();
    }
}