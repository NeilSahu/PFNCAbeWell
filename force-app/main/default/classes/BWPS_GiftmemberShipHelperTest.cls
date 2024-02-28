@isTest
public class BWPS_GiftmemberShipHelperTest {
	
    @isTest
    static void creategiftMemberShipTestForDonationTypeOnce(){
        
        Map<Object, Object> donorinfoMap = new Map<Object, Object>{
            'Fname' => 'Donor First Name',
            'LName' => 'Donor Last Name',
            'Email' => 'donor@example.com',
            'phoneNumber' => '1234567890',
            'state' => 'CA',
            'city' => 'San Francisco',
            'country' => 'USA',
            'postalCode' => '94107',
            'Street' => '123 Main St.',
            'DonationAmount' => '100.00',
            'DonationType' => 'Once'
        };
        Map<Object, Object> giftinfoMap = new Map<Object, Object>{
            'Fname' => 'Gift First Name',
            'LName' => 'Gift Last Name',
            'Email' => 'gift@example.com',
            'phoneNumber' => '1234567890',
            'state' => 'CA',
            'city' => 'San Francisco',
            'country' => 'USA',
            'postalCode' => '94107',
            'Street' => '123 Main St.',
            'GiftAmount' => '500.00',
            'GiftType' => 'Yearly'
        };
         
        Map<Object, Object> giftDetails = new Map<Object, Object>{
    		'donorinfo' => donorinfoMap,
    		'giftinfo' => giftinfoMap
		};
            
        Test.startTest();
        String resultId = BWPS_GiftmemberShipHelper.creategiftMemberShip(giftDetails , '200');
        Test.stopTest();

        System.assertEquals(18, resultId.length());
    }
    
	@isTest
    static void creategiftMemberShipTestForDonationTypeYearly(){
        
        Map<Object, Object> donorinfoMap = new Map<Object, Object>{
            'Fname' => 'Donor First Name',
            'LName' => 'Donor Last Name',
            'Email' => 'donor@example.com',
            'phoneNumber' => '1234567890',
            'state' => 'CA',
            'city' => 'San Francisco',
            'country' => 'USA',
            'postalCode' => '94107',
            'Street' => '123 Main St.',
            'DonationAmount' => '100.00',
            'DonationType' => 'Yearly'
        };
        Map<Object, Object> giftinfoMap = new Map<Object, Object>{
            'Fname' => 'Gift First Name',
            'LName' => 'Gift Last Name',
            'Email' => 'gift@example.com',
            'phoneNumber' => '1234567890',
            'state' => 'CA',
            'city' => 'San Francisco',
            'country' => 'USA',
            'postalCode' => '94107',
            'Street' => '123 Main St.',
            'GiftAmount' => '500.00',
            'GiftType' => 'Yearly'
        };
         
        Map<Object, Object> giftDetails = new Map<Object, Object>{
    		'donorinfo' => donorinfoMap,
    		'giftinfo' => giftinfoMap
		};
            
        Test.startTest();
        String resultId = BWPS_GiftmemberShipHelper.creategiftMemberShip(giftDetails , '200');
        Test.stopTest();

        System.assertEquals(18, resultId.length());
    }
    @isTest 
    static void testRegisterUser() {
        // Create test data
        Id contactId=TestDataFactory.getContact();
        String firstName = 'John';
        String lastName = 'Doe';
        String email = 'johndoe@test.com';
        String password = 'password1';
        String confirmPassword = 'password1';
        user ur= [Select Id,Username from user where Id=:TestDataFactory.getPortalUser()];
        System.runAs(ur){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
        	String result = BWPS_GiftmemberShipHelper.registerUser(firstName, lastName, email, password, confirmPassword);
            System.debug('result-> '+result);
            //System.assertEquals(result, contactId);
        
        // Verify that the user was created with the correct data
        	        	Test.stopTest();
        }
        // Call the method to be tested
        
        
        // Verify the result
        
    }
}