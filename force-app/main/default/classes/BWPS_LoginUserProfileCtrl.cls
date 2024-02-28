/****
Name : BWPS_GuestMemberEvents
Decsription : This class manage current user profile data.
Created by: Himanshu Yadav 
***/
public without sharing class BWPS_LoginUserProfileCtrl {
    @AuraEnabled(cacheable=true)
    public static user fetchUserDetail(){
        System.debug('UserFunctionCalled');
        User UserDetails = [SELECT Id,ContactId FROM User WHERE Id =: Userinfo.getUserId()];
        String ContactId = UserDetails.ContactId;
        //contentdocumentlink imgURL = [Select id,ContentDocumentId, ContentDocument.Title, ContentDocument.createdDate, ContentDocument.Createdby.Name, ContentDocument.FileExtension from contentdocumentlink where LinkedEntityId  =:ContactId ];
        return [Select id,Name,Email,MemberPassDate__c,MobilePhone,Phone,FirstName, LastName, ContactId, Profile.Name ,Address ,City ,State ,PostalCode, Street, Country, AboutMe, SmallPhotoUrl, 
                MediumPhotoUrl, FullPhotoUrl, Contact.BWPS_Gender__c,Location__c,Contact.Birthdate From User Where Id =: Userinfo.getUserId()];
        //return[SELECT Id,BWPS_Gender__c,Birthdate,Name,(Select id,ContentDocumentId, ContentDocument.Title, ContentDocument.createdDate, ContentDocument.Createdby.Name, ContentDocument.FileExtension from contentdocumentlinks),
        //(Select id,Name,Email,MobilePhone,Phone,FirstName, LastName, ContactId, Profile.Name ,Address ,City ,State ,PostalCode, Street, Country, AboutMe, SmallPhotoUrl,MediumPhotoUrl, FullPhotoUrl,Location__c From Users) FROM Contact WHERE Id =:ContactId];
        
        
        //  return [Select id,Name,MobilePhone,Phone,FirstName, LastName,contactId ,Address, AboutMe, SmallPhotoUrl, MediumPhotoUrl,
        //       FullPhotoUrl, contact.BWPS_Gender__c,Location__c,contact.Birthdate From User Where Id =:'0053C0000057QPqQAM'];
    }
    @AuraEnabled
    public Static String updateUser(String userData , String userProfilePic){
        System.debug('userData>> '+userData);
        System.debug('userProfilePic>> '+userProfilePic);
        Boolean isError = false;
        String error;
        Contact conntctData = new Contact();
        try{
            Map<String, object> formData = (Map<String, object>) JSON.deserializeUntyped(userData);
            User userRec = [SELECT Id, Name, Phone, FirstName, LastName, ContactId, Address, AboutMe, SmallPhotoUrl,City,State,PostalCode,Street,MediumPhotoUrl,
                            Email,Country,FullPhotoUrl, Contact.BWPS_Gender__c, Location__c, Contact.Birthdate FROM User WHERE Id =: Userinfo.getUserId() limit 1];
            System.debug('UserId>>> '+ userRec);
            System.debug('ContactId>>> '+ userRec.ContactId);
            String contactId =  userRec.ContactId;
                      
            if(userRec.ContactId != null){
                conntctData = [SELECT Id,BWPS_Gender__c, Birthdate FROM Contact WHERE  Id =: contactId LIMIT 1];
            }
            userRec.FirstName= String.valueof(formData.get('FirstName'));
            userRec.LastName= String.valueof(formData.get('LastName'));
            userRec.Street= String.valueof(formData.get('ApartmentSuite'));
            userRec.City= String.valueof(formData.get('City'));
            userRec.State= String.valueof(formData.get('State'));
            userRec.PostalCode= String.valueof(formData.get('ZipPostalCode'));
            userRec.Country= String.valueof(formData.get('Country'));
            if(userRec.Email != String.valueof(formData.get('Email'))){
                userRec.Email= String.valueof(formData.get('Email'));
            }
           /* userRec.Location__c= String.valueof(formData.get('Location'));
            if(String.valueof(formData.get('AboutMe')) != null && String.valueof(formData.get('AboutMe')) !=''){
                userRec.AboutMe= String.valueof(formData.get('AboutMe'));
                conntctData.About__c = String.valueof(formData.get('AboutMe'));
            }*/
            userRec.Phone= String.valueof(formData.get('Phone'));
            conntctData.FirstName = String.valueof(formData.get('FirstName'));
            conntctData.LastName = String.valueof(formData.get('LastName'));
            conntctData.Phone = String.valueof(formData.get('Phone'));
            if(String.valueof(formData.get('gender')) != 'default'){
                conntctData.BWPS_Gender__c = String.valueof(formData.get('gender'));
            }
            /*String month= String.valueof(formInfo.get('Month'));
              String day= String.valueof(formInfo.get('day'));
			  String year= String.valueof(formInfo.get('Year'));
			  String BirthDay=month+'/'+day+'/'+year;
  			  System.debug('Birthday'+BirthDay);*/
            if(formData.get('Birthday') != null && formData.get('Birthday') != ''){
                conntctData.Birthdate=  Date.valueOf(String.valueof(formData.get('Birthday')));
            } else {
                conntctData.Birthdate = null;
            }
            //Date.valueOf(String.valueof(formData.get('Year'))+ '-' + String.valueof(formData.get('Month'))+ '-'+String.valueof(formData.get('day'))); 
            update userRec;
            update conntctData;
            if(userProfilePic != null && userProfilePic != ''){
                Blob b=(Blob)EncodingUtil.base64Decode(userProfilePic);
                System.debug(ConnectApi.UserProfiles.setPhoto(null, (String)UserInfo.getUserId(), new ConnectApi.BinaryInput(b, 'image/jpg', 'userImage.jpg')).SmallPhotoUrl); 
            }
        } catch(Exception e){
            error = String.valueOf(e.getMessage());
            isError= true;
        }
        return isError? error:'Update Successfully.';
    }
    
    
    /************************************* UpdateDonorProfile *********************************************************/
    @AuraEnabled
    public Static String updateDonorProfile(String userData){
        System.debug('UpdateDonorProfile'+userData);
        
        
        Contact conntctData = new Contact();
        try{
            Map<String, object> formData = (Map<String, object>) JSON.deserializeUntyped(userData);
            User userRec = [SELECT Id,Name, Phone, FirstName, LastName, Address,City,State,PostalCode,Street, Email,Country FROM User WHERE Id =: Userinfo.getUserId() limit 1];
            System.debug('UserId>>> '+ userRec);
            
            
            System.debug('UserId>>> '+ userRec.FirstName);
            
            userRec.FirstName= String.valueof(formData.get('FirstName'));
            userRec.LastName= String.valueof(formData.get('LastName'));
            userRec.Street= String.valueof(formData.get('Street'));
            userRec.City= String.valueof(formData.get('City'));
            userRec.State= String.valueof(formData.get('State'));
            userRec.PostalCode= String.valueof(formData.get('PostalCode'));
            userRec.Country= String.valueof(formData.get('Country'));
            userRec.Email= String.valueof(formData.get('Email'));
            userRec.Phone= String.valueof(formData.get('Phone'));
            
            System.debug('UserId8888888888888>>> '+ userRec.FirstName); 
            system.debug('userRec'+userRec.City);
            update userRec;
            
            
            
        } catch(Exception e){
            
            
            System.debug('eeee>>>>'+ e.getMessage() + 'StakeLineNumber>>'+e.getLineNumber() + 'stackTracing>>>> '+e.getStackTraceString());
        }
        return 'Update Successfully.';
    }
    /************************************* Update user profile picture *********************************************************/
    @AuraEnabled
    public Static String updateProfilePicture(String userProfilePic){
        try {
            if(userProfilePic != null && userProfilePic != ''){
                Blob b=(Blob)EncodingUtil.base64Decode(userProfilePic);
                System.debug(ConnectApi.UserProfiles.setPhoto(null, (String)UserInfo.getUserId(), new ConnectApi.BinaryInput(b, 'image/jpg', 'userImage.jpg')).SmallPhotoUrl); 
            }
            return 'Updated successfull';
        } catch(Exception e){
            return e.getMessage();
        }
    }
    /********************************** Remove user profile *****************************************************************/ 
    @AuraEnabled
    public Static String deleteUserProfilePic(){
        try {
            ConnectApi.UserProfiles.deletePhoto(null, (String)UserInfo.getUserId());
            return 'Updated successfull';
        } catch(Exception e){
            return e.getMessage();
        }
    }
    
    /************************************ Update Site user password ***********************************************************/
    @AuraEnabled 
    public static String  updateUserPassword(String newPassword,  String confirmPassword, String oldPassword){
        try {
            PageReference pr = Site.changePassword( newPassword, confirmPassword, oldPassword);
            return 'Success';
        } catch (Exception e) {
            system.debug('e.getMessagelogin+   '+e.getMessage());
            return string.valueof(e.getMessage());
        }
    }
    /************************************ Update user email ***********************************************************/
    @AuraEnabled
    public static String updateUserEmail(String userData){
        System.debug('dfghjkl');
        System.debug('Userrr>>> '+userData);
        try{
            User usr = (user)JSON.deserialize(userData, User.class);
            Update usr;
            return 'Success';
        } catch(Exception e){
            return String.valueOf(e.getMessage());
        }      
    }
    //====================================================profile survay=============================================================
    
    @AuraEnabled(cacheable=true)
    public static List<Profile_Survey__c> fetchProfileDetails(){
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        String ContactId = u.ContactId;
        system.debug('Hid'+ContactId);
        
        return [SELECT Id,Q2_Name__c,Page3_Answer1__c,Question_2_Answers__c, Name,Last_name__c,Facebook__c, Birthday__c,Street__c,state__c,City__c,Q2_State__c,Q2_City__c,Gende__c,Q2_Email_Address__c, Email__c,Home_Phone_Number__c,Apartment__c ,Country__c ,postalcode__c, Streetaddress__c, Name__c,Lname__c, Phone_Number__c, Relationship__c, Do_you_use__c, Page2__c, Question1__c, Contact__c,Donation_for_annual_administrative__c,Tax_Deductible_contribution__c FROM Profile_Survey__c  where Contact__r.Id =:ContactId limit 1];
    }
    
    
    
    @AuraEnabled
    public Static void survay(String userData){
        System.debug('userData>>>> '+userData); 
        Map<String, object> formData = (Map<String, object>) JSON.deserializeUntyped(userData);
        System.debug('formData>> '+formData);  
        system.debug('de' + String.valueof(formData.get('firstName')));
        
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
        system.debug(u);
        system.debug(u.ContactId);
        String ContactId = u.ContactId;
        
        list<Profile_Survey__c> pro =[SELECT Id,Apartment__c,Last_name__c,Lname__c,state__c, Birthday__c, Gende__c,Email__c,Q2_Email_Address__c, Streetaddress__c, Name__c, Phone_Number__c, Relationship__c, Do_you_use__c, Page2__c, Question1__c, Contact__c,Question_2__c,Page3_Question_1__c FROM Profile_Survey__c  where Contact__c =:ContactId limit 1];
        if(pro.size() ==0)
        {  
            Profile_Survey__c pro1 = new Profile_Survey__c();
            pro1.Contact__c = ContactId;  
            system.debug('any'+ContactId);
            
            pro1.Name = String.valueof(formData.get('firstName'));
            pro1.Last_name__c = String.valueof(formData.get('lastName'));
            pro1.Birthday__c = Date.valueof(String.valueof(formData.get('birthday')));
            pro1.Gende__c = String.valueof(formData.get('gender'));  
            pro1.Email__c = String.valueof(formData.get('email'));
            pro1.Street__c = String.valueof(formData.get('street'));
            pro1.Apartment__c = String.valueof(formData.get('apartment'));
            pro1.City__c =String.valueof(formData.get('city'));
            pro1.State__c = String.valueof(formData.get('state'));
            pro1.postalcode__c = integer.valueof(formData.get('postalcode'));
            system.debug('post'+integer.valueof(formData.get('postalcode')));
            pro1.Country__c =  String.valueof(formData.get('country'));
            
            pro1.Facebook__c = String.valueof(formData.get('facebookUser'));
            pro1.Home_Phone_Number__c = String.valueof(formData.get('homePhone'));
            pro1.Name__c = String.valueof(formData.get('name'));
            pro1.Lname__c = String.valueof(formData.get('lname'));
            pro1.Phone_Number__c = String.valueof(formData.get('phone'));
            pro1.Relationship__c = String.valueof(formData.get('relationship'));
            pro1.Question1__c	 =  String.valueof(formData.get('question1'));
            pro1.Question_2_Answers__c =  String.valueof(formData.get('question2'));
            
            pro1.Page3_Answer1__c =  String.valueof(formData.get('question3'));
            pro1.Q2_Name__c	 =  String.valueof(formData.get('Name1'));
            pro1.Q2_State__c =  String.valueof(formData.get('state1'));
            pro1.Q2_City__c =  String.valueof(formData.get('city1'));
            pro1.Q2_Email_Address__c =  String.valueof(formData.get('email1'));   
            // pro1.Question_2_Answer__c =  String.valueof(formData.get('question2'));
            
            if(formData.get('donation') != null){
                pro1.Tax_Deductible_contribution__c =  integer.valueof(formData.get('donation'));
            }
            if(formData.get('donation') != null){
                pro1.Donation_for_annual_administrative__c =  integer.valueof(formData.get('donation1'));
            }
            
            pro1.Page2__c = 'I AM';
            pro1.Question_2__c = 'If YOU LIVING WITH PARKINSONS HOW LONG AGO WERE YOU DIAGNOSED?';
            pro1.Page3_Question_1__c = 'HOW DID YOU FIRST LEARN ABOUT BE WELL PARKINSONS ?';
            insert pro1;  
            
        }
        
        else{
            pro[0].Contact__c = ContactId; 
            
            pro[0].Name = String.valueof(formData.get('firstName'));
            Pro[0].Last_name__c = String.valueof(formData.get('lastName'));
            Pro[0].Birthday__c = Date.valueof(String.valueof(formData.get('birthday')));
            Pro[0].Gende__c = String.valueof(formData.get('gender'));  
            pro[0].Email__c = String.valueof(formData.get('email'));
            Pro[0].Street__c = String.valueof(formData.get('street'));
            pro[0].Apartment__c = String.valueof(formData.get('apartment'));
            Pro[0].City__c =String.valueof(formData.get('city'));
            Pro[0].State__c = String.valueof(formData.get('state'));
            Pro[0].postalcode__c = integer.valueof(formData.get('postalcode'));
            system.debug('post'+integer.valueof(formData.get('postalcode')));
            pro[0].Country__c =  String.valueof(formData.get('country'));
            
            Pro[0].Facebook__c = String.valueof(formData.get('facebookUser'));
            Pro[0].Home_Phone_Number__c = String.valueof(formData.get('homePhone'));
            Pro[0].Name__c = String.valueof(formData.get('name'));
            Pro[0].Lname__c = String.valueof(formData.get('lname'));
            Pro[0].Phone_Number__c = String.valueof(formData.get('phone'));
            Pro[0].Relationship__c = String.valueof(formData.get('relationship'));
            pro[0].Question1__c	 =  String.valueof(formData.get('question1'));
            pro[0].Question_2_Answers__c =  String.valueof(formData.get('question2'));
            pro[0].Page3_Answer1__c =  String.valueof(formData.get('question3'));
            pro[0].Q2_Name__c	 =  String.valueof(formData.get('Name1'));
            pro[0].Q2_State__c =  String.valueof(formData.get('state1'));
            pro[0].Q2_City__c =  String.valueof(formData.get('city1'));
            pro[0].Q2_Email_Address__c =  String.valueof(formData.get('email1'));  
            
            if(formData.get('donation') != null){
                pro[0].Tax_Deductible_contribution__c =  integer.valueof(formData.get('donation'));
            }
            if(formData.get('donation1') != null){
                pro[0].Donation_for_annual_administrative__c =  integer.valueof(formData.get('donation1'));
            }
            pro[0].Page2__c = 'I AM';
            pro[0].Question_2__c = 'If YOU LIVING WITH PARKINSONS HOW LONG AGO WERE YOU DIAGNOSED?';
            pro[0].Page3_Question_1__c = 'HOW DID YOU FIRST LEARN ABOUT BE WELL PARKINSONS ?';
            update pro; 
        }
        
    }
    
    @AuraEnabled
    public static void updateAttendeeTime(String watchTime , String classId){
        string conId = [SELECT Id,ContactId FROM User WHERE Id =:UserInfo.getUserId() Limit 1].ContactId;
        List<Attendee__c> attendies = [SELECT Id,BWPS_WatchedTimeStamp__c,Class_Status__c,Schedule_Class_Line_Item_del__r.Video_Duration__c
                                       FROM Attendee__c WHERE Attendee_Name_del__c =:conId AND Schedule_Class_Line_Item_del__c =:classId];
        for(Attendee__c attendee :attendies){
            if(Integer.ValueOf(attendee.Schedule_Class_Line_Item_del__r.Video_Duration__c) > Integer.valueOf(attendee.BWPS_WatchedTimeStamp__c)){
                Integer watchedTime  = Integer.valueOf(watchTime);
                Integer attendeeTime = attendee.BWPS_WatchedTimeStamp__c != null && attendee.BWPS_WatchedTimeStamp__c != '' ? Integer.valueOf(attendee.BWPS_WatchedTimeStamp__c):0;
                Integer totalTime = attendee.Schedule_Class_Line_Item_del__r.Video_Duration__c != null && attendee.Schedule_Class_Line_Item_del__r.Video_Duration__c !='' ?
                    Integer.valueOf(attendee.Schedule_Class_Line_Item_del__r.Video_Duration__c):0;
                attendee.BWPS_WatchedTimeStamp__c = attendeeTime + watchedTime > totalTime ? String.valueOf(totalTime):String.valueOf(attendeeTime + watchedTime);
                attendee.Class_Status__c = Integer.ValueOf(attendee.BWPS_WatchedTimeStamp__c ) >= totalTime ?'COMPLETED':'RESUME';
            }
        }
        Database.update(attendies);
    }
    
    
    @AuraEnabled
    public Static String updateIntructor(String userData , String userProfilePic){
        System.debug('userProfilePic : ' + userProfilePic);
        Boolean isError = false;
        String error;
        Contact conntctData = new Contact();
        try{
            Map<String, object> formData = (Map<String, object>) JSON.deserializeUntyped(userData);
            User userRec = [SELECT Id, Name, Phone, FirstName, LastName, ContactId, Address, AboutMe, SmallPhotoUrl, MediumPhotoUrl,
                            FullPhotoUrl, Contact.BWPS_Gender__c, Location__c, Contact.Birthdate,Contact.Phone FROM User WHERE Id =: Userinfo.getUserId() limit 1];
            
            String contactId =  userRec.ContactId;
            
             System.debug('UserId>>> '+ userRec);
            System.debug('ContactId>>> '+ userRec.ContactId);
            
            //Id networkId = [SELECT Id FROM Network LIMIT 1].Id;
            
            if(userRec.ContactId != null && userProfilePic != null && userProfilePic != ''){
                ContentVersion cv = new ContentVersion();
                cv.Title = userRec.FirstName+' '+userRec.LastName;
                cv.PathOnClient = 'ProfilePicture.jpg';
                cv.VersionData = (Blob)EncodingUtil.base64Decode(userProfilePic);//Blob.valueOf('Test Content');
                cv.IsMajorVersion = true;
                //cv.NetworkId = networkId;
                insert cv;
                
                System.debug('content version insert '+ cv.Id);
                
                //Create ContentDocumentLink 
                Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:cv.Id].ContentDocumentId;
                ContentDocumentLink cdl = New ContentDocumentLink();
                cdl.LinkedEntityId = contactId;
                cdl.ContentDocumentId = conDocId;
                cdl.shareType = 'V';
                Insert cdl;
                System.debug('content document inserted '+ cdl.Id);
                
                List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                ContentDistribution cd = new ContentDistribution();
                cd.Name = cv.Title;
                cd.ContentVersionId = cv.id;
                cd.PreferencesAllowViewInBrowser= true;
                cd.PreferencesLinkLatestVersion=true;
                cd.PreferencesNotifyOnVisit=false;
                cd.PreferencesPasswordRequired=false;
                cd.PreferencesAllowOriginalDownload= true;
                conDistribution.add(cd);
                Insert conDistribution;
                system.debug('conDistribution '+ conDistribution[0].Id);
                
                ContentDistribution condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution LIMIT 1];
                contact condetails = [SELECT Id,Name,BWPS_publicProfileLink__c FROM Contact WHERE Id =: contactId];
                condetails.BWPS_publicProfileLink__c =condistributionList.ContentDownloadUrl;
                update condetails;
                system.debug('Contact updated '+condetails.Id);
            }
            
            
            
            
            
            if(userRec.ContactId != null){
                conntctData = [SELECT Id,BWPS_Gender__c, Birthdate,Phone FROM Contact WHERE  Id =: contactId LIMIT 1];
            }
            if(String.valueof(formData.get('FirstName')) != null && String.valueof(formData.get('FirstName')) !=''){
                userRec.FirstName= String.valueof(formData.get('FirstName'));
            }else{
                userRec.FirstName= '';
            }
            if(String.valueof(formData.get('LastName')) != null && String.valueof(formData.get('LastName')) !=''){
                userRec.LastName= String.valueof(formData.get('LastName'));
            }else{
                userRec.LastName= '';
            }
            if(String.valueof(formData.get('Location')) != null && String.valueof(formData.get('Location')) !=''){
                userRec.Location__c = String.valueof(formData.get('Location'));
            }else{
                userRec.Location__c = '';
            }
            if(String.valueof(formData.get('Phone')) != null && String.valueof(formData.get('Phone')) !=''){
                userRec.Phone= String.valueof(formData.get('Phone'));
            }else{
                userRec.Phone= '';
            }
            // userRec.FirstName= String.valueof(formData.get('FirstName'));
            // userRec.Lastname= String.valueof(formData.get('LastName'));
            // userRec.Location__c= String.valueof(formData.get('Location'));
            // userRec.Phone = String.valueof(formData.get('Phone'));
            
            system.debug('log1'+ userRec.Phone);
            if(String.valueof(formData.get('AboutMe')) != null && String.valueof(formData.get('AboutMe')) !=''){
                userRec.AboutMe= String.valueof(formData.get('AboutMe'));
                conntctData.About__c = String.valueof(formData.get('AboutMe'));
            }else{
                userRec.AboutMe= '';
                conntctData.About__c = '';
            }
            if(String.valueof(formData.get('Phone')) != null && String.valueof(formData.get('Phone')) !=''){
                userRec.Phone= String.valueof(formData.get('Phone'));
            }
            else{
                userRec.Phone= '';
            }
            if(String.valueof(formData.get('FirstName')) != null && String.valueof(formData.get('FirstName')) !=''){
                conntctData.FirstName = String.valueof(formData.get('FirstName'));
            }
            else{
                conntctData.FirstName = '';
            }
            if(String.valueof(formData.get('LastName')) != null && String.valueof(formData.get('LastName')) !=''){
                conntctData.LastName = String.valueof(formData.get('LastName'));
            }
            else{
                conntctData.LastName = '';
            }
            // if(String.valueof(formData.get('AboutMe')) != null && String.valueof(formData.get('AboutMe')) !=''){
            //     userRec.AboutMe= String.valueof(formData.get('AboutMe'));
            //     conntctData.About__c = String.valueof(formData.get('AboutMe'));
            // }
            
            // userRec.Phone= String.valueof(formData.get('Phone'));
            // conntctData.FirstName = String.valueof(formData.get('FirstName'));
            // conntctData.LastName = String.valueof(formData.get('LastName'));
            // conntctData.Phone = String.valueof(formData.get('Phone'));
            
            system.debug('log1'+ conntctData.Phone);
            if(String.valueof(formData.get('gender')) != null && String.valueof(formData.get('gender')) != ''){
                conntctData.BWPS_Gender__c = String.valueof(formData.get('gender'));
            }else{
                conntctData.BWPS_Gender__c = '';
            }
            //conntctData.BWPS_Gender__c = String.valueof(formData.get('gender'));
            if( (String.valueof(formData.get('Year')) != null || String.valueof(formData.get('Year')) != '') && (String.valueof(formData.get('Month')) != null || String.valueof(formData.get('Month')) != '') && (String.valueof(formData.get('day')) != null && String.valueof(formData.get('day')) != '')){
                conntctData.Birthdate = Date.valueOf(String.valueof(formData.get('Year'))+ '-' + String.valueof(formData.get('Month'))+ '-'+String.valueof(formData.get('day'))); 
            }
            
            //conntctData.Birthdate = Date.valueOf(String.valueof(formData.get('Year'))+ '-' + String.valueof(formData.get('Month'))+ '-'+String.valueof(formData.get('day'))); 
            update userRec;
            update conntctData;
            if(userProfilePic != null && userProfilePic != ''){
                Blob b=(Blob)EncodingUtil.base64Decode(userProfilePic);
                System.debug(ConnectApi.UserProfiles.setPhoto(null, (String)UserInfo.getUserId(), new ConnectApi.BinaryInput(b, 'image/jpg', 'userImage.jpg')).SmallPhotoUrl); 
            }
        }
        catch(Exception e){
            error = String.valueOf(e.getMessage() + ' : ' + e.getLineNumber());
            System.debug('errrrrrrrrrrrrrrrrrrrrrrrroooooooorrrrrrrrrrrrrr'+error+e.getStackTraceString()+''+e.getLineNumber());
            isError= true;
        }
        return isError? error:'Update Successfully.';
    }
}