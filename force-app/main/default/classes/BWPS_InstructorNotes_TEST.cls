@isTest
public class BWPS_InstructorNotes_TEST {

    @isTest
    static void TestInstructorNotes(){
       
        
        TestDataFactory.getContact();
        Test.startTest();
        List<Contact> contactNotes = BWPS_InstructorNotes.InstructorNotes();
        Test.stopTest();
        
        System.assertEquals(1, contactNotes.size());
    }
   
}