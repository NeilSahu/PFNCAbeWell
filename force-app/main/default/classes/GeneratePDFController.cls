public with sharing class GeneratePDFController {
    public static void save(Id oppId) {
            List<Opportunity> oppList = [select Id , Name, Amount, CloseDate, BWPS_Payment_Method__c, BWPS_Paid__c from Opportunity where Id = :oppId];
            for(Opportunity opp : oppList){
                System.debug('File Name : ' + opp.Name);
                String status;
                if(opp.BWPS_Paid__c){
                    status = 'SUCCESS';
                }
                else{
                    status = 'FAILED';
                }
                String tempDate = String.valueOf(opp.CloseDate);
                String newCloseDate = tempDate.split(' ')[0];
                Blob bodyData;
                //String htmlBody = '<html>'+'<body><h1>Example page</h1><br/>This is for the test.</body>' +'</html>';
                String htmlBody = '<html><body><div style="height:800px;">'+
                        '<div style="display:flex;justify-content:space-evenly;">'+
                            '<span style="padding-right:20px;">'+'Date'+'</span>'+
                            '<span style="margin-left:20px;color:green;"> - '+newCloseDate+'</span>'+
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
                try {
                    //bodyData = Blob.toPdf(htmlBody);
                    String oppIdString = (string)opp.Id;
                    //Created ContentVersion of attachment file
                    ContentVersion ContVerFile = new ContentVersion();
                    ContVerFile.VersionData = Blob.toPdf(htmlBody);
                    ContVerFile.Title = 'Receipt ' + oppIdString+'.pdf'; 
                    ContVerFile.ContentLocation= 's';
                    ContVerFile.PathOnClient= 'Receipt ' + oppIdString+'.pdf';
                    insert ContVerFile;
                    
                    //insert ContentDocumentLink file 
                    Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:ContVerFile.Id].ContentDocumentId;
                    ContentDocumentLink cDe = new ContentDocumentLink();
                    cDe.ContentDocumentId = conDoc;
                    cDe.LinkedEntityId = opp.Id;
                    cDe.ShareType = 'I';
                    cDe.Visibility = 'AllUsers';
                    insert cDe;
                } catch (VisualforceException e) {
                    System.debug('error : '+e.getMessage());
                }
		}
        
    }
    public static void PaymentHistoryPdf(Id oppId) {
        npe01__OppPayment__c opp = [Select Id, Name, npe01__Paid__c, npe01__Payment_Amount__c, npe01__Payment_Date__c, npe01__Payment_Method__c, npe01__Check_Reference_Number__c, Payment_Status__c,npsp__Card_Last_4__c  From npe01__OppPayment__c Where Id = : oppId];
        String status;
        if(opp.npe01__Paid__c){
            status = 'Approved';
        }
        else{
            status = 'Decline';
		}
        Blob bodyData;
        //String htmlBody = '<html>'+'<body><h1>Example page</h1><br/>This is for the test.</body>' +'</html>';
        String htmlBody = '<html><body><div style="height:800px;">'+
            	'<div style="display:flex;justify-content:space-evenly;">'+
                    '<span style="padding-right:20px;">'+'Payment Date :'+'</span>'+
                    '<span style="margin-left:20px;color:green;"> '+opp.npe01__Payment_Date__c+'</span>'+
                '</div><br><br>'+
                '<div>'+
                    '<span>'+'Amount :'+'</span>'+
                    '<span style="margin-left:20px;color:green;"> USD '+opp.npe01__Payment_Amount__c+'</span>'+
                '</div><br><br>'+
                '<div>'+
                    '<span>'+'Payment Method :'+'</span>'+
                    '<span style="margin-left:20px;color:green;"> Visa ending in '+opp.npsp__Card_Last_4__c+'</span>'+
                '</div><br><br>'+
                '<div>'+
                    '<span>'+'Status :'+'</span>'+
                    '<span style="margin-left:20px;color:green;"> '+status+'</span>'+
                '</div><br><br>	'+
            '</div> <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>'+
        '</body></html>';
        String oppIdString = (string)opp.Id;
        //Created ContentVersion of attachment file
        ContentVersion ContVerFile = new ContentVersion();
        ContVerFile.VersionData = Blob.toPdf(htmlBody);
        ContVerFile.Title = 'Receipt ' + oppIdString+'.pdf'; 
        ContVerFile.ContentLocation= 's';
        ContVerFile.PathOnClient= 'Receipt ' + oppIdString+'.pdf';
      	insert ContVerFile;
        
        //insert ContentDocumentLink file 
        Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:ContVerFile.Id].ContentDocumentId;
        ContentDocumentLink cDe = new ContentDocumentLink();
        cDe.ContentDocumentId = conDoc;
        cDe.LinkedEntityId = opp.Id;
        cDe.ShareType = 'I';
        cDe.Visibility = 'AllUsers';
        insert cDe;
    }
}