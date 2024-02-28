public without sharing  class BWPS_InstructorClassProfile {
    /*
    	 @AuraEnabled(cacheable=true)
    public static user fetchUserDetail(){
        System.debug('UserFunctionCalled');
        return [Select id,Name,MobilePhone,Phone,FirstName, LastName,ContactId ,Address, AboutMe, SmallPhotoUrl, MediumPhotoUrl,
               FullPhotoUrl, Contact.BWPS_Gender__c,Location__c,Contact.Birthdate From User Where Id =: Userinfo.getUserId()];
         
        
  }
   */
    //try class methods
    
    
    public static void fetchImage()
    {		
        System.debug('runn');
        String  BASE_URL = URL.getSalesforceBaseUrl().toExternalForm();
        List<Id> classIdList = new List<Id>();
        List<Id> ContentDocumentIdList = new List<Id>();
        Set<Id> ContentVersionIdList = new Set<Id>();
        Set<Id> classIdSet = new Set<Id>();
        Map<Id , ContentDocumentLink> ContentDocumentLinkMap = new Map<Id , ContentDocumentLink>();
        Map<Id , ContentVersion> contentVersionMap = new Map<Id , ContentVersion>();
        list<Achievement__c> classlist = [select id from Achievement__c];
        System.debug('classlist--'+classlist.size());
        for(Achievement__c a:classlist)
        {
            //LinkedEntityId
            classIdList.add(a.id);
            
            /*String accId =a.id;
            
            List<ContentDocumentLink> cdLink = [select SystemModstamp,LinkedEntityId,ContentDocumentId from ContentDocumentLink where LinkedEntityId=:accId order by SystemModstamp desc Limit 1];
            List<ContentVersion> cv = [SELECT Id, ContentDocumentId, Title, VersionData, FileExtension, FileType FROM ContentVersion where ContentDocumentId= :cdLink[0].ContentDocumentId AND (FileType='PNG' OR FileType='JPEG' OR FileType='JPG')  order by CreatedDate desc Limit 1];
            String FileUrl = BASE_URL + '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+cv[0].Id;
            system.debug('loh1'+FileUrl);
            
            class__c cont = [select id,BWPS_Type__c from class__c  where id =:accId];
            cont.BWPS_Type__c = FileUrl;
            update cont;*/
        }
        
        List<ContentDocumentLink> cdLink = [select SystemModstamp,LinkedEntityId,ContentDocumentId from ContentDocumentLink where LinkedEntityId=:classIdList order by SystemModstamp desc];
        System.debug('cdLink--'+cdLink);
        if(cdLink.size()>0){
            
            
            for(ContentDocumentLink contentDocumentLinkRecord : cdLink){
                if(!classIdSet.contains(contentDocumentLinkRecord.LinkedEntityId)){
                    //add the first content document id in set
                    System.debug('contentDocumentLinkRecord.LinkedEntityId---'+contentDocumentLinkRecord.LinkedEntityId);
                    ContentVersionIdList.add(contentDocumentLinkRecord.ContentDocumentId);
                    classIdSet.add(contentDocumentLinkRecord.LinkedEntityId);
                }
                if(!ContentDocumentLinkMap.containsKey(contentDocumentLinkRecord.LinkedEntityId)){
                    ContentDocumentLinkMap.put(contentDocumentLinkRecord.LinkedEntityId, contentDocumentLinkRecord);
                }
            }
        }
        
        List<ContentVersion> cv = [SELECT Id, ContentDocumentId, Title, VersionData, FileExtension, FileType FROM ContentVersion where ContentDocumentId= :ContentVersionIdList AND (FileType='PNG' OR FileType='JPEG' OR FileType='JPG')  order by CreatedDate desc];
        if(cv.size()>0){
            for(ContentVersion contentRecord : cv){
                if(!contentVersionMap.containsKey(contentRecord.ContentDocumentId)){
                    contentVersionMap.put(contentRecord.ContentDocumentId, contentRecord);
                }
            }
        }
        
        List<Achievement__c> cont = [select id,BWPS_Type_c__c	 from Achievement__c  where id =:classIdList];
        if(cont.size()>0){
            for(Achievement__c classRecord : cont){
                ContentDocumentLink contentDocumentLinkRecord;
                ContentVersion contentVersionRecord;
                if(ContentDocumentLinkMap.containsKey(classRecord.id)){
                    System.debug('ContentDocumentLinkMap');
                    contentDocumentLinkRecord = ContentDocumentLinkMap.get(classRecord.Id);
                    if(contentVersionMap.containsKey(contentDocumentLinkRecord.ContentDocumentId)){
                        contentVersionRecord = contentVersionMap.get(contentDocumentLinkRecord.ContentDocumentId);
                        String FileUrl = BASE_URL + '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+contentVersionRecord.Id;
                        system.debug('loh1--'+FileUrl);
                        classRecord.BWPS_Type_c__c	 = FileUrl;
                        
                    }
                }
                
            }
            update cont;
        }
        
    }
			

    //==================================================
    
    	 @AuraEnabled(cacheable=true)
    public static List<Payment_Method__c> fetchCardsDerail(){
        	User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1];
            String ContactId = u.ContactId;
			//String ContactId = '0033C00000bAPBDQA4';
			system.debug('hug'+ContactId);
        	return [select id,Name__c, Card_Number__c ,Expiration_Date__c ,Country__c,CVV__c, contact__c from Payment_Method__c where contact__c =: ContactId];
    }
     	 	 @AuraEnabled(cacheable=true)
    public static Payment_Method__c fetchPaymentDetail(String searchKey){
    		return [select Id, Name__c, Card_Number__c, Expiration_Date__c, CVV__c, Country__c FROM Payment_Method__c where Id =: searchKey ];
        	
    }
			 @AuraEnabled
	 public static void deletePaymentRecord(String searchKey1){
         
         	system.debug('log ');
    		delete [select Id FROM Payment_Method__c where Id =: searchKey1 ];
         
        
        	
    }    
    
    	 @AuraEnabled(cacheable=true)
    public  static list<Achievement__c> fetchAchievementDetail(){
        User u = [SELECT Id, ContactId FROM User WHERE Id =: UserInfo.getUserId()];
            String ContactId = u.ContactId;
    		return [SELECT Id, Contact__c, Points__c, Name FROM Achievement__c  where contact__c =: ContactId];
    }
    
   //========================= profile survey=========

}
    




    /*
   @AuraEnabled
    public static void updateProfile(String formData)
    {
        System.debug('tempformData'+formData);
       // String formInfo = JSON.deserializeUntyped(formData).toString();
      //  Map<String,String> formInfo=(Map<String,String>)JSON.deserializeUntyped(formData,Map<String,String>.class);
        
        Map<String, object> formInfo = (Map<String, object>) JSON.deserializeUntyped(formData);

     //   Contact BWPS_instructorList= [Select FirstName,Lastname,Phone,Id,BWPS_Type__c,BWPS_Gender__c,Birthdate,MailingCountry from Contact where Id =:'0033C00000ajuw6QAA'];
        

					
        	User BWPS_instructorList =	[Select id,Name,Phone, FirstName, LastName,contactId ,Address, AboutMe, SmallPhotoUrl, MediumPhotoUrl,
                FullPhotoUrl, contact.BWPS_Gender__c,Location__c,contact.Birthdate From User Where Id =: Userinfo.getUserId()];
        
        		
        Contact BWPS_instructorContactList = [Select Id,BWPS_Gender__c,Birthdate from Contact where Id =: BWPS_instructorList.contactId];
        
        BWPS_instructorList.FirstName= String.valueof(formInfo.get('FirstName'));
        BWPS_instructorList.Lastname= String.valueof(formInfo.get('LastName'));
        BWPS_instructorList.Location__c= String.valueof(formInfo.get('Location'));
        BWPS_instructorList.AboutMe= String.valueof(formInfo.get('text'));
        BWPS_instructorList.Phone= String.valueof(formInfo.get('Phone'));
        
		BWPS_instructorContactList.BWPS_Gender__c = String.valueof(formInfo.get('gender'));
        
        String month= String.valueof(formInfo.get('Month')); 
        String day= String.valueof(formInfo.get('day')); 
        String year= String.valueof(formInfo.get('Year'));  
       
        String BirthDay=month+'/'+day+'/'+year;
        System.debug('Birthday'+BirthDay);
        BWPS_instructorContactList.Birthdate=Date.parse(BirthDay);
  
        System.debug('msg'+BWPS_instructorList);
        update BWPS_instructorList;
		update BWPS_instructorContactList;
        
        }	/*
            @AuraEnabled(cacheable=true)
          public static user fetchUserDetail(){
              System.debug('UserFunctionCalled');
              return [Select id,SmallPhotoUrl, MediumPhotoUrl, FullPhotoUrl
                      From User
                      Where Id =: Userinfo.getUserId()];
          }*/