@isTest
public class BWPS_InstructorResourcesData_TEST {

    @isTest
    static void TestfetchQuizesDetail(){
        
        TestDataFactory.getQuizes();
        Test.startTest();
        BWPS_InstructorResourcesData.fetchQuizesDetail();
        Test.stopTest();
        
    }
    
    @isTest
    static void TestfetchSampleDetail(){
        
        TestDataFactory.getSampleClassFlows();
        Test.startTest();
        BWPS_InstructorResourcesData.fetchSampleDetail();
        Test.stopTest();
        
    }
}