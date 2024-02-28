public without sharing class BWPS_DonationHistoryClass {
    @AuraEnabled(cacheable=true)
    public static List<ChargentOrders__ChargentOrder__c> BWPS_DonationHistoryMethod(){
        String UserId = UserInfo.getUserId();
        System.debug('Current User id : '+UserID+'and name : '+UserInfo.getFirstName());
        //List<Opportunity> oppRecords = [Select Id,Name,Amount,CreatedDate,BWPS_Paid__c,BWPS_Payment_Method__c,npsp__Honoree_Name__c from Opportunity where OwnerId=: UserId order by CreatedDate desc];
    //List<ChargentOrders__Transaction__c> TransRecords = [SELECT Id,Name,ChargentOrders__Order__c,ChargentOrders__Order__r.Id,ChargentOrders__Order__r.ChargentOrders__Payment_Frequency__c,CreatedDate,LastModifiedById,LastModifiedDate,ChargentOrders__Amount__c,ChargentOrders__Response_Status__c,ChargentOrders__Bank_Account_Status__c,ChargentOrders__Payment_Method__c,ChargentOrders__Credit_Card_Type__c,ChargentOrders__Type__c FROM ChargentOrders__Transaction__c WHERE LastModifiedById =:UserId AND ChargentOrders__Type__c = 'Charge' order by CreatedDate desc 0053C000005Oi8RQAS];
        // List<Opportunity> oppRecords = [Select npsp__Primary_Contact__c,Id,Name,BWPS_Chargent_Order__r.ChargentOrders__Payment_Method__c,BWPS_Chargent_Order__r.ChargentOrders__Transaction__r.ChargentOrders__Amount__c,
        //                               CreatedDate,npsp__Honoree_Name__c from Opportunity where npsp__Primary_Contact__c =: ContactId order by CreatedDate desc];
        List<ChargentOrders__ChargentOrder__c> chargentOrderRecords = [SELECT Id,Name,ChargentOrders__Charge_Amount__c,ChargentOrders__Payment_Frequency__c, ChargentOrders__Billing_Email__c ,(SELECT Id,Name,Amount,npsp__Honoree_Name__c FROM Opportunities__r),(SELECT Id,Name,CreatedDate,LastModifiedById,LastModifiedDate,ChargentOrders__Amount__c,ChargentOrders__Response_Status__c,ChargentOrders__Bank_Account_Status__c,ChargentOrders__Payment_Method__c,ChargentOrders__Credit_Card_Type__c,ChargentOrders__Type__c,ChargentOrders__Card_Last_4__c from ChargentOrders__Transactions__r WHERE ChargentOrders__Type__c = 'Charge') FROM ChargentOrders__ChargentOrder__c WHERE OwnerId =:UserId order by CreatedDate desc];
        System.debug(' chargentOrderRecords '+chargentOrderRecords);
        return chargentOrderRecords;
    }
    @AuraEnabled
    public static string getOppPDFDocId(String oppId){
        System.debug('Opp ID : '+oppId);
        //Attachment attach = [SELECT ParentId,Name,Id,ContentType,Body FROM Attachment WHERE ParentId = : oppId LIMIT 1];
        //System.debug('attachment : '+attach);
        ContentDocumentLink oppRelatedFile =  [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = : oppId LIMIT 1];
        System.debug('oppRelatedFile : '+oppRelatedFile);
        ContentVersion conVersion = [Select Id, Title, FileType, FileExtension, ContentDocumentId, ContentBodyId, VersionData From ContentVersion Where ContentDocumentId = : oppRelatedFile.ContentDocumentId LIMIT 1];
        System.debug('conVersion :'+conVersion);
        System.debug('conVersionID :'+conVersion.Id);
        return (string)conVersion.Id;
        //return (string)attach.Id;
    }
       @AuraEnabled(cacheable=true)
        public static Opportunity BWPS_ShowDetails(Id oppId){
        system.debug('#############oppid'+oppId);
        Opportunity showDetail = [Select Id,Name,Amount,CreatedDate,BWPS_Paid__c,BWPS_Payment_Method__c from Opportunity where Id=: oppId ] ;
        System.debug('Show Detail' + showDetail);
        return showDetail;
    }
    @AuraEnabled
    public static string downloadAllReceiptPDF(){
        String UserId = UserInfo.getUserId();
        System.debug('user ID : '+UserId);
        //Attachment attach = [SELECT ParentId,Name,Id,ContentType,Body FROM Attachment WHERE ParentId = : oppId LIMIT 1];
        //System.debug('attachment : '+attach);
        String htmlBody = '';
        List<Opportunity> oppList = [Select Id,Name,Amount,CreatedDate,BWPS_Paid__c,BWPS_Payment_Method__c,CloseDate from Opportunity where Ownerid=: UserId];
        for (Integer i = 0; i < oppList.size(); i++) {
            Opportunity opp = oppList[i];
            System.debug('File Name : ' + opp.Name);
            String status;
            if(opp.BWPS_Paid__c){
                status = 'SUCCESS';
            }
            else{
                status = 'FAILED';
            }
            Blob bodyData;
            //String htmlBody = '<html>'+'<body><h1>Example page</h1><br/>This is for the test.</body>' +'</html>';
            if(i < oppList.size()-1){
                htmlBody += '<html><body><div style="height:800px;">'+
                        '<div style="display:flex;justify-content:space-evenly;">'+
                            '<span style="padding-right:20px;">'+'Date'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - '+opp.CloseDate+'</span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Amount'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - $'+opp.Amount+'</span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Payment Method'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - '+opp.BWPS_Payment_Method__c+'</span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Status'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - '+status+'</span>'+
                        '</div><br><br>	'+
                    '</div> <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>'+
                '</body></html>';
            }
            else{
                htmlBody += '<html><body><div style="height:800px;">'+
                        '<div style="display:flex;justify-content:space-evenly;">'+
                            '<span style="padding-right:20px;">'+'Date'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - '+opp.CloseDate+'</span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Amount'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - $'+opp.Amount+'</span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Payment Method'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - '+opp.BWPS_Payment_Method__c+'</span>'+
                        '</div><br><br>'+
                        '<div>'+
                            '<span>'+'Status'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - '+status+'</span>'+
                        '</div><br><br>	'+
                    '</div>'+
                '</body></html>';
            }
        }
        try {
            //bodyData = Blob.toPdf(htmlBody);
        } catch (VisualforceException e) {
        }
        //Created ContentVersion of attachment file
        ContentVersion ContVerFile = new ContentVersion();
        ContVerFile.VersionData = Blob.toPdf(htmlBody);
        ContVerFile.Title = 'Receipt ' + UserId+'.pdf'; 
        ContVerFile.ContentLocation= 's';
        ContVerFile.PathOnClient= 'Receipt ' + UserId+'.pdf';
        insert ContVerFile;
        
        //insert ContentDocumentLink file 
        
        System.debug('conVersionID :'+ContVerFile.Id);
        return (string)ContVerFile.Id;
        //return (string)attach.Id;
    }
}