@isTest
public class DeactiveGuestUsers_TEST {
    @isTest
    public static void batch_TEST(){
        TestDataFactory.getPortalUser();
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        DeactiveGuestUser deactiveGuestUser = new DeactiveGuestUser();
		String jobName = 'Deactivate Guest Users Job';
		String cronExp = '0 0 0 * * ?'; //Runs at midnight every day
		System.schedule(jobName, cronExp, deactiveGuestUser);
        Test.stopTest();
    }

}