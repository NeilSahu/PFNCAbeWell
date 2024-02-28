public class ContentDocumentLinkHelper {
    public static void GeneratePublicLink(List<ContentDocumentLink> newList){
        String ObjectName = '';
        List<String> linkEntentyIds = New List<String>();
        Map<String,ContentDocumentLink> mapOfContentLink =  New Map<String,ContentDocumentLink>();
        List<String> linkEntentyIdSlider = New List<String>();
        Map<String,ContentDocumentLink> mapOfContentLinkSlider =  New Map<String,ContentDocumentLink>();
        List<String> linkEntentyIdClass = New List<String>();
        Map<String,ContentDocumentLink> mapOfContentLinkClass =  New Map<String,ContentDocumentLink>();
        List<String> linkEntentyIdResource = New List<String>();
        Map<String,ContentDocumentLink> mapOfContentLinkResource =  New Map<String,ContentDocumentLink>();
        List<String> linkEntentyIdClasses = New List<String>();
        Map<String,ContentDocumentLink> mapOfContentLinkClasses =  New Map<String,ContentDocumentLink>();
        List<String> linkEntentyIdAbout = New List<String>();
        Map<String,ContentDocumentLink> mapOfContentLinkAbout =  New Map<String,ContentDocumentLink>();
        List<String> linkEntentyIdTestimonial = New List<String>();
        Map<String,ContentDocumentLink> mapOfContentLinkTestimonial =  New Map<String,ContentDocumentLink>();
        for(ContentDocumentLink conTentDoc:newList){
            Id objId = conTentDoc.LinkedEntityId;
            System.debug('LinkedEntityid  '+conTentDoc.LinkedEntityId);
            objectName = objId.getSObjectType().getDescribe().getName();
            if(objectName == 'Blog__c'){
                linkEntentyIds.add(conTentDoc.LinkedEntityId);
                mapOfContentLink.put(conTentDoc.ContentDocumentId, conTentDoc);
            }
             if(objectName == 'slide__c'){
                linkEntentyIdSlider.add(conTentDoc.LinkedEntityId);
                mapOfContentLinkSlider.put(conTentDoc.ContentDocumentId, conTentDoc);
            }
            if(objectName == 'Class__c'){
                linkEntentyIdClass.add(conTentDoc.LinkedEntityId);
                mapOfContentLinkClass.put(conTentDoc.ContentDocumentId, conTentDoc);
            }
            if(objectName == 'BWPS_Resource__c'){
                linkEntentyIdResource.add(conTentDoc.LinkedEntityId);
                mapOfContentLinkResource.put(conTentDoc.ContentDocumentId, conTentDoc);
            }
             if(objectName == 'Schedule_Class__c'){
                linkEntentyIdClasses.add(conTentDoc.LinkedEntityId);
                mapOfContentLinkClasses.put(conTentDoc.ContentDocumentId, conTentDoc);
            }
            if(objectName == 'About_Us__c'){
                linkEntentyIdAbout.add(conTentDoc.LinkedEntityId);
                mapOfContentLinkAbout.put(conTentDoc.ContentDocumentId, conTentDoc);
            }
            if(objectName == 'Testimonial__c'){
                linkEntentyIdTestimonial.add(conTentDoc.LinkedEntityId);
                mapOfContentLinkTestimonial.put(conTentDoc.ContentDocumentId, conTentDoc);
            }
        } 
        try{
            List<sObject> records = new List<sObject>();
            Map<Id,Boolean> IdAndStatusMap = new Map<Id,Boolean>();
            
            String query;
            String SliderQuery;
            String ClassQuery;
            String ResourceQuery;
            String ClassesQuery ;
            String AboutQuery;
            String TestimonialQuery;
            System.debug('Lits>>>'+linkEntentyIds);
            if(ObjectName == 'Blog__c'){
                query = 'SELECT Id,BlogHeaderUrl__c FROM Blog__c WHERE Id In:linkEntentyIds';
            }
            if(ObjectName == 'slide__c'){
                SliderQuery = 'SELECT Id,Name,SliderURL__c,description__c FROM slide__c WHERE Id In:linkEntentyIdSlider';
            }
            if(ObjectName == 'Class__c'){
                ClassQuery = 'SELECT Id,Name,ClassImageUrl__c,Description__c FROM Class__c WHERE Id In:linkEntentyIdClass';
            }
            if(ObjectName == 'BWPS_Resource__c'){
                ResourceQuery = 'SELECT Id,Name,ResouceImageUrl__c,Description__c FROM BWPS_Resource__c WHERE Id In:linkEntentyIdResource';
            }
             if(ObjectName == 'Schedule_Class__c'){
                ClassesQuery = 'SELECT Id,Name,Header_Img_URL__c FROM Schedule_Class__c WHERE Id In:linkEntentyIdClasses';
            }
             if(ObjectName == 'About_Us__c'){
                AboutQuery = 'SELECT Id,Name,description__c,Title__c,Photo_URL__c,Type__c FROM About_Us__c WHERE Id In:linkEntentyIdAbout';
            }
            if(ObjectName == 'Testimonial__c'){
                TestimonialQuery = 'SELECT Id,Name,testimonial_designation__c,Type__c,testimonial_Name__c,testimonialquote__c,Photo_URL__c FROM Testimonial__c WHERE Id In:linkEntentyIdTestimonial';
            }
            if(query !=null && query != ''){
                Map<Id,sObject> recordsMap = new Map<Id,sObject>(DataBase.query(query));
                Map<Id,ContentVersion> contentVersionsRec =new Map<Id,ContentVersion>([SELECT Id,Title,ContentDocumentId FROM ContentVersion WHERE ContentDocumentId 
                                                                                       IN :mapOfContentLink.keySet()]);
                List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                for(ContentVersion cv :contentVersionsRec.values()){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = cv.Title;
                    cd.ContentVersionId = cv.id;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    if(((String)cv.Title).toLowerCase().contains('headerurl')){
                        IdAndStatusMap.put(cd.ContentVersionId, true);
                    }
                    else{
                        IdAndStatusMap.put(cd.ContentVersionId, false);
                    }
                    conDistribution.add(cd);
                }
                Insert conDistribution;
                System.debug('conDistribution>> '+conDistribution);
                List<ContentDistribution> condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution];
                System.debug('condistributionList>> '+condistributionList);
                for(ContentDistribution cdRec :condistributionList){
                    if(recordsMap.get(mapOfContentLink.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId) != null){
                        if(IdAndStatusMap.get(cdRec.ContentVersionId)){
                            System.debug('>>>> cdRec.ContentDownloadUrl'+cdRec.ContentDownloadUrl);
                        	recordsMap.get(mapOfContentLink.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId).put('BlogHeaderUrl__c',cdRec.ContentDownloadUrl); 
                        } 
                    }   
                }
                update recordsMap.values();
            }
             if(SliderQuery !=null && SliderQuery != ''){
                Map<Id,sObject> recordsMap = new Map<Id,sObject>(DataBase.query(SliderQuery));
                Map<Id,ContentVersion> contentVersionsRec =new Map<Id,ContentVersion>([SELECT Id,Title,ContentDocumentId FROM ContentVersion WHERE ContentDocumentId 
                                                                                       IN :mapOfContentLinkSlider.keySet()]);
                List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                for(ContentVersion cv :contentVersionsRec.values()){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = cv.Title;
                    cd.ContentVersionId = cv.id;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    conDistribution.add(cd);
                }
                Insert conDistribution;
                System.debug('conDistribution>> '+conDistribution);
                List<ContentDistribution> condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution];
                System.debug('condistributionList>> '+condistributionList);
                for(ContentDistribution cdRec :condistributionList){
                    if(recordsMap.get(mapOfContentLinkSlider.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId) != null){
                        System.debug('>>>> cdRec.ContentDownloadUrl'+cdRec.ContentDownloadUrl);
                        recordsMap.get(mapOfContentLinkSlider.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId).put('SliderURL__c',cdRec.ContentDownloadUrl); 

                    }   
                }
                 update recordsMap.values();
            }if(ClassQuery !=null && ClassQuery != ''){
                Map<Id,sObject> recordsMap = new Map<Id,sObject>(DataBase.query(ClassQuery));
                Map<Id,ContentVersion> contentVersionsRec =new Map<Id,ContentVersion>([SELECT Id,Title,ContentDocumentId FROM ContentVersion WHERE ContentDocumentId 
                                                                                       IN :mapOfContentLinkClass.keySet()]);
                List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                for(ContentVersion cv :contentVersionsRec.values()){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = cv.Title;
                    cd.ContentVersionId = cv.id;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    conDistribution.add(cd);
                }
                Insert conDistribution;
                System.debug('conDistribution>> '+conDistribution);
                List<ContentDistribution> condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution];
                System.debug('condistributionList>> '+condistributionList);
                for(ContentDistribution cdRec :condistributionList){
                    if(recordsMap.get(mapOfContentLinkClass.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId) != null){
                        System.debug('>>>> cdRec.ContentDownloadUrl'+cdRec.ContentDownloadUrl);
                        recordsMap.get(mapOfContentLinkClass.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId).put('ClassImageUrl__c',cdRec.ContentDownloadUrl); 

                    }   
                }
                 update recordsMap.values();
            }
            if(ResourceQuery !=null && ResourceQuery != ''){
                Map<Id,sObject> recordsMap = new Map<Id,sObject>(DataBase.query(ResourceQuery));
                Map<Id,ContentVersion> contentVersionsRec =new Map<Id,ContentVersion>([SELECT Id,Title,ContentDocumentId FROM ContentVersion WHERE ContentDocumentId 
                                                                                       IN :mapOfContentLinkResource.keySet()]);
                List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                for(ContentVersion cv :contentVersionsRec.values()){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = cv.Title;
                    cd.ContentVersionId = cv.id;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    conDistribution.add(cd);
                }
                Insert conDistribution;
                System.debug('conDistribution>> '+conDistribution);
                List<ContentDistribution> condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution];
                System.debug('condistributionList>> '+condistributionList);
                for(ContentDistribution cdRec :condistributionList){
                    if(recordsMap.get(mapOfContentLinkResource.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId) != null){
                        System.debug('>>>> cdRec.ContentDownloadUrl'+cdRec.ContentDownloadUrl);
                        recordsMap.get(mapOfContentLinkResource.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId).put('ResouceImageUrl__c',cdRec.ContentDownloadUrl); 

                    }   
                }
                 update recordsMap.values();
            }
             if(ClassesQuery !=null && ClassesQuery != ''){
                Map<Id,sObject> recordsMap = new Map<Id,sObject>(DataBase.query(ClassesQuery));
                Map<Id,ContentVersion> contentVersionsRec =new Map<Id,ContentVersion>([SELECT Id,Title,ContentDocumentId FROM ContentVersion WHERE ContentDocumentId 
                                                                                       IN :mapOfContentLinkClasses.keySet()]);
                List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                for(ContentVersion cv :contentVersionsRec.values()){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = cv.Title;
                    cd.ContentVersionId = cv.id;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    conDistribution.add(cd);
                }
                Insert conDistribution;
                System.debug('conDistribution>> '+conDistribution);
                List<ContentDistribution> condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution];
                System.debug('condistributionList>> '+condistributionList);
                for(ContentDistribution cdRec :condistributionList){
                    if(recordsMap.get(mapOfContentLinkClasses.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId) != null){
                        System.debug('>>>> cdRec.ContentDownloadUrl'+cdRec.ContentDownloadUrl);
                        recordsMap.get(mapOfContentLinkClasses.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId).put('Header_Img_URL__c',cdRec.ContentDownloadUrl); 

                    }   
                }
                 update recordsMap.values();
            }
             if(AboutQuery !=null && AboutQuery != ''){
                Map<Id,sObject> recordsMap = new Map<Id,sObject>(DataBase.query(AboutQuery));
                Map<Id,ContentVersion> contentVersionsRec =new Map<Id,ContentVersion>([SELECT Id,Title,ContentDocumentId FROM ContentVersion WHERE ContentDocumentId 
                                                                                       IN :mapOfContentLinkAbout.keySet()]);
                List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                for(ContentVersion cv :contentVersionsRec.values()){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = cv.Title;
                    cd.ContentVersionId = cv.id;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    conDistribution.add(cd);
                }
                Insert conDistribution;
                System.debug('conDistribution>> '+conDistribution);
                List<ContentDistribution> condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution];
                System.debug('condistributionList>> '+condistributionList);
                for(ContentDistribution cdRec :condistributionList){
                    if(recordsMap.get(mapOfContentLinkAbout.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId) != null){
                        System.debug('>>>> cdRec.ContentDownloadUrl'+cdRec.ContentDownloadUrl);
                        recordsMap.get(mapOfContentLinkAbout.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId).put('Photo_URL__c',cdRec.ContentDownloadUrl); 

                    }   
                }
                 update recordsMap.values();
            }
            if(TestimonialQuery !=null && TestimonialQuery != ''){
                Map<Id,sObject> recordsMap = new Map<Id,sObject>(DataBase.query(TestimonialQuery));
                Map<Id,ContentVersion> contentVersionsRec =new Map<Id,ContentVersion>([SELECT Id,Title,ContentDocumentId FROM ContentVersion WHERE ContentDocumentId 
                                                                                       IN :mapOfContentLinkTestimonial.keySet()]);
                List<ContentDistribution> conDistribution = new List<ContentDistribution>();
                for(ContentVersion cv :contentVersionsRec.values()){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = cv.Title;
                    cd.ContentVersionId = cv.id;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    conDistribution.add(cd);
                }
                Insert conDistribution;
                System.debug('conDistribution>> '+conDistribution);
                List<ContentDistribution> condistributionList = [SELECT Id,ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE Id In:conDistribution];
                System.debug('condistributionList>> '+condistributionList);
                for(ContentDistribution cdRec :condistributionList){
                    if(recordsMap.get(mapOfContentLinkTestimonial.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId) != null){
                        System.debug('>>>> cdRec.ContentDownloadUrl'+cdRec.ContentDownloadUrl);
                        recordsMap.get(mapOfContentLinkTestimonial.get(contentVersionsRec.get(cdRec.ContentVersionId).ContentDocumentId).LinkedEntityId).put('Photo_URL__c',cdRec.ContentDownloadUrl); 

                    }   
                }
                 update recordsMap.values();
            }
        } catch(Exception e){
            System.debug('Error>> '+e.getMessage()+'   '+ e.getLineNumber() + '  '+e.getStackTraceString()); 
        }
    }
    
}