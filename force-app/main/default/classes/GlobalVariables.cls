public class GlobalVariables {
    public static boolean oneTimecall = false;
    public static String RecordTypeRecurring =  Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get(BWPS_Constants.RecurringDonationRecordType).getRecordTypeId();
    public static String RecordTypeOneTime =  Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get(BWPS_Constants.OneTimeDonationRecordType).getRecordTypeId();
    public static String RecordtypeInstructor =  Schema.SObjectType.contact.getRecordTypeInfosByName().get(BWPS_Constants.InstructorRecordType).getRecordTypeId();
    public static String recordTypemembership =  Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get(BWPS_Constants.BWPS_MembershipRecordType).getRecordTypeId();
    public static String recordTypeGuestUser =  Schema.SObjectType.contact.getRecordTypeInfosByName().get(BWPS_Constants.BWPS_guestUserRecordType).getRecordTypeId();
    //public static String recordTypeDonoruser =  Schema.SObjectType.contact.getRecordTypeInfosByName().get(BWPS_Constants.BWPS_DonorRecordType).getRecordTypeId();
}