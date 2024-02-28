@isTest
public class BWPS_getInstructorsData_TEST {
    @isTest
    static void testGetAllInstructorsData_Error() {
        Test.startTest();
        List<User> result = BWPS_getInstructorsData.getAllInstructorsData();
        Account acc = new Account(Name='test');
        insert acc;
        BWPS_getInstructorsData.getIsntructorandClasses(acc.Id);
        BWPS_getInstructorsData.GetuserProfile(acc.Id);
        Test.stopTest();
    }
}