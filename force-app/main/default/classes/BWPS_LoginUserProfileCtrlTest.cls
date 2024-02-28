@isTest
public with sharing class BWPS_LoginUserProfileCtrlTest {
    
    
    @isTest
    public static void testFetchUserDetail() {
        BWPS_LoginUserProfileCtrl.fetchUserDetail();
    }
    
    @isTest
    public static void testUpdateProfilePicture(){
        String userProfilePic = 'testData';
        BWPS_LoginUserProfileCtrl.updateProfilePicture(userProfilePic);
    }
    
    @isTest
    public static void testDeleteUserProfilePic(){
        BWPS_LoginUserProfileCtrl.deleteUserProfilePic();
    }
    
    @isTest
    public static void testUpdateUserPassword(){
        String newPassword = 'test@123';
        String oldPassword = 'test123';
        BWPS_LoginUserProfileCtrl.updateUserPassword(newPassword,newPassword,oldPassword);
    }
    
    @isTest
    public static void testUpdateUserEmail(){
        Map<String,object> userData = new Map<String,object>();
        userData.put('FirstName','Test Name');
        userData.put('LastName','Test Name');
        userData.put('ApartmentSuite','TestData');
        userData.put('City','New York');
        userData.put('State','Celifornia');
        userData.put('ZipPostalCode','123456');
        userData.put('Country','America');
        userData.put('Email','test@email.com');
        userData.put('Phone','1234567890');
        userData.put('gender','Male');
        Date today = System.today();
        userData.put('birthday',today);
        BWPS_LoginUserProfileCtrl.updateUserEmail(JSON.serialize(userData));
    }
    
    @isTest
    public static void testFetchProfileDetails(){
        BWPS_LoginUserProfileCtrl.fetchProfileDetails();
    }
    
    @isTest
    public static void testSurvay(){
        Map<String,object> userData = new Map<String,object>();
        userData.put('FirstName','Test Name');
        userData.put('LastName','Test Name');
        userData.put('ApartmentSuite','TestData');
        userData.put('City','New York');
        userData.put('State','Celifornia');
        userData.put('ZipPostalCode','123456');
        userData.put('Country','America');
        userData.put('Email','test@email.com');
        userData.put('Phone','1234567890');
        userData.put('gender','Male');
        userData.put('donation','2');
        userData.put('donation1','5');
        Date today = Date.today();
        userData.put('birthday',today);
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        BWPS_LoginUserProfileCtrl.survay(JSON.serialize(userData));
        
        // Create a test account
        Account testAccount = new Account();
        testAccount.Name = 'Test Account';
        insert testAccount;
        
        // Create a test contact
        Contact testContact = new Contact();
        testContact.FirstName = 'Test';
        testContact.LastName = 'Contact';
        testContact.AccountId = testAccount.Id;
        insert testContact;
        
        Profile p = [SELECT Id FROM Profile WHERE Name='Client'];
        User testUser = new User();
        testUser.FirstName = 'Test';
        testUser.LastName = 'User';
        testUser.Email = 'testuser@example.com';
        testUser.Username = 'testuser@example1613.com';
        testUser.Alias = 'testuser';
        testUser.CommunityNickname = 'testuser';
        testUser.ContactId = testContact.Id;
        testUser.ProfileId = p.Id;
        testUser.TimeZoneSidKey = 'America/Los_Angeles';
        testUser.LocaleSidKey = 'en_US';
        testUser.EmailEncodingKey = 'UTF-8';
        testUser.LanguageLocaleKey = 'en_US';
        testUser.IsActive = true;
        insert testUser;
        
        Profile_Survey__c PS5 = new Profile_Survey__c(Name = 'Test name',Contact__c = testUser.ContactId);
        insert PS5;
        
        System.runAs(testUser) {
            BWPS_LoginUserProfileCtrl.survay(JSON.serialize(userData));
        }
        Test.stopTest();
    }
    
    
    @isTest
    public static void testUpdateAttendeeTime(){
        
        // Create a test account
        Account testAccount = new Account();
        testAccount.Name = 'Test Account';
        insert testAccount;
        
        // Create a test contact
        Contact testContact = new Contact();
        testContact.FirstName = 'Test';
        testContact.LastName = 'Contact';
        testContact.AccountId = testAccount.Id;
        insert testContact;
        
        Profile p = [SELECT Id FROM Profile WHERE Name='Client'];
        User testUser = new User();
        testUser.FirstName = 'Test';
        testUser.LastName = 'User';
        testUser.Email = 'testuser@example.com';
        testUser.Username = 'testuser@example2613.com';
        testUser.Alias = 'testuser';
        testUser.CommunityNickname = 'testuser';
        testUser.ContactId = testContact.Id;
        testUser.ProfileId = p.Id;
        testUser.TimeZoneSidKey = 'America/Los_Angeles';
        testUser.LocaleSidKey = 'en_US';
        testUser.EmailEncodingKey = 'UTF-8';
        testUser.LanguageLocaleKey = 'en_US';
        testUser.IsActive = true;
        insert testUser;
        
        Attendee__c aa=TestDataFactory.getAttendee();
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        System.runAs(testUser) {
            BWPS_LoginUserProfileCtrl.updateAttendeeTime('2',aa.Schedule_Class_Line_Item_del__c);
        }
        Test.stopTest();
    }
    
    @isTest
    public static void testUpdateUser(){
        Map<String,object> userData = new Map<String,object>();
        userData.put('FirstName','Test Name');
        userData.put('LastName','Test Name');
        userData.put('ApartmentSuite','TestData');
        userData.put('City','New York');
        userData.put('State','Celifornia');
        userData.put('ZipPostalCode','123456');
        userData.put('Country','America');
        userData.put('Email','test@email.com');
        userData.put('Phone','1234567890');
        userData.put('gender','Male');
        userData.put('AboutMe','AboutMeTest');
        Date today = Date.today();
        String userProfilePic = 'testPic';
        BWPS_LoginUserProfileCtrl.updateUser(JSON.serialize(userData),userProfilePic);
        userData.put('Birthday',today);
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        BWPS_LoginUserProfileCtrl.updateUser(JSON.serialize(userData),userProfilePic);
        // Create a test account
        Account testAccount = new Account();
        testAccount.Name = 'Test Account';
        insert testAccount;
        
        // Create a test contact
        Contact testContact = new Contact();
        testContact.FirstName = 'Test';
        testContact.LastName = 'Contact';
        testContact.AccountId = testAccount.Id;
        insert testContact;
        
        Profile p = [SELECT Id FROM Profile WHERE Name='Client'];
        User testUser = new User();
        testUser.FirstName = 'Test';
        testUser.LastName = 'User';
        testUser.Email = 'testuser@example.com';
        testUser.Username = 'testuser@example0613.com';
        testUser.Alias = 'testuser';
        testUser.CommunityNickname = 'testuser';
        testUser.ContactId = testContact.Id;
        testUser.ProfileId = p.Id;
        testUser.TimeZoneSidKey = 'America/Los_Angeles';
        testUser.LocaleSidKey = 'en_US';
        testUser.EmailEncodingKey = 'UTF-8';
        testUser.LanguageLocaleKey = 'en_US';
        testUser.IsActive = true;
        insert testUser;
        System.runAs(testUser) {
            BWPS_LoginUserProfileCtrl.updateUser(JSON.serialize(userData),userProfilePic);
        }
        Test.stopTest();
    }
    
    @isTest
    public static void testUpdateDonorProfile(){
        Map<String,object> userData = new Map<String,object>();
        userData.put('FirstName','Test Name');
        userData.put('LastName','Test Name');
        userData.put('ApartmentSuite','TestData');
        userData.put('City','New York');
        userData.put('State','Celifornia');
        userData.put('ZipPostalCode','123456');
        userData.put('Country','America');
        userData.put('Email','test@email.com');
        userData.put('Phone','1234567890');
        userData.put('gender','Male');
        Date today = System.today();
        userData.put('birthday',today);
        Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
        Test.startTest();
        BWPS_LoginUserProfileCtrl.updateDonorProfile(JSON.serialize(userData));
        Test.stopTest();
    }
    
    @isTest
    public static void testUpdateIntructor(){
        Map<String,object> userData = new Map<String,object>();
        userData.put('FirstName','Test Name');
        userData.put('LastName','Test Name');
        userData.put('ApartmentSuite','TestData');
        userData.put('City','New York');
        userData.put('State','Celifornia');
        userData.put('ZipPostalCode','123456');
        userData.put('Country','America');
        userData.put('Email','test@email.com');
        userData.put('Phone','1234567890');
        userData.put('gender','Male');
        Date today = System.today();
        userData.put('birthday',today);
        Id systemAdmin = [SELECT Id FROM Profile WHERE Name = 'Instructor' LIMIT 1].Id;
        User userExample = new User();
        userExample.Username = 'exxcvbnbvcxzmailtest@test.com';
        userExample.FirstName = 'First';
        userExample.LastName = 'Last';
        userExample.Alias = 'Alihgas';
        userExample.Email = 'emailtest@test.com';
        userExample.TimeZoneSidKey = 'America/New_York';
        userExample.LocaleSidKey = 'en_CA';
        userExample.EmailEncodingKey = 'UTF-8';
        userExample.ProfileId = systemAdmin;
        userExample.LanguageLocaleKey = 'en_US';
        userExample.ContactId=TestDataFactory.getContact();
        userExample.CommunityNickname='test5576'; 
        //UserExample.UserRoleId=ur.Id;
        //userExample.ownerid =u.Id;
        insert userExample;
      
        
        String userProfilePic = 'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYSURBVBhXY7x169J/BiTABKXhgJAAAwMA56gDjazWJtgAAAAASUVORK5CYII=';
        ContentDocumentLink cdl= testdataFactory.getContentDocumentLinkId(testdataFactory.getAccount(),testdatafactory.getContentVersion());
        
        System.runAs(userExample){
            Test.setMock(HttpCalloutMock.class,new MockHttpResponseGenerator());
            Test.startTest();
            BWPS_LoginUserProfileCtrl.updateIntructor(JSON.serialize(userData),userProfilePic);
            Test.stopTest();
        }
        
    }
}