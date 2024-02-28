@isTest
public class BWPS_Constants_TEST {

    @isTest
    static void TestBWPS_Constants(){
        System.assertEquals('Instructor Record Type', BWPS_Constants.BWPS_instructorRecordType);
        
  
        System.assertEquals('Guest User Record Type', BWPS_Constants.BWPS_guestUserRecordType);
        
        // Test the BWPS_clientRecordType constant
        System.assertEquals('Client Record Type', BWPS_Constants.BWPS_clientRecordType);
        
        // Test the RecurringDonationRecordType constant
        System.assertEquals('Recurring Class', BWPS_Constants.RecurringDonationRecordType);
        
        // Test the OneTimeDonationRecordType constant
        System.assertEquals('One Time Class', BWPS_Constants.OneTimeDonationRecordType);
        
        // Test the InstructorRecordType constant
        System.assertEquals('Instructor Record Type', BWPS_Constants.InstructorRecordType);
        
        // Test the BWPS_DonorRecordType constant
        System.assertEquals('Donar Record Type', BWPS_Constants.BWPS_DonorRecordType);
        
        // Test the BWPS_MembershipRecordType constant
        System.assertEquals('Membership', BWPS_Constants.BWPS_MembershipRecordType);
    }
}