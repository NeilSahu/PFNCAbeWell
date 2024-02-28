public without sharing class transactionReceiptController {
    
    public String receiptId {get;set;}
    public String amountPaid {get;set;}
    public String paidDate {get;set;}
    public String paymentMethod {get;set;}
    public String paymentStatus {get;set;}
    
    public void transactionReceiptController(){
        receiptId = Apexpages.currentpage().getparameters().get('receiptId');
        amountPaid = Apexpages.currentpage().getparameters().get('amountPaid');
        paidDate = Apexpages.currentpage().getparameters().get('paidDate');
        paymentMethod = Apexpages.currentpage().getparameters().get('paymentMethod');
        paymentStatus = Apexpages.currentpage().getparameters().get('paymentStatus');
    }
      
    @InvocableMethod(label='createTransactionReceipt')
    public static void main(list<string> transactionId){
        system.debug('Generating Receipt');
        PageReference pdf = new PageReference('/apex/transactionReceipt');
        pdf.getParameters().put('receiptId', '123456');
        pdf.getParameters().put('amountPaid', '200');
        pdf.getParameters().put('paidDate', 'Mar 11,2023');
        pdf.getParameters().put('paymentMethod', 'VISA - 4242');
        pdf.getParameters().put('paymentStatus', 'Success');
        pdf.setRedirect(true);
       
        system.debug('Adding to Record');
        system.debug(transactionId[0]);
        
        Blob pdfBlob= Blob.valueOf('An html');
        Attachment attach = new Attachment();
        if(!Test.isRunningTest()){
        	pdfBlob = pdf.getContent();
        }
        if(Test.isRunningTest()){
            pdfBlob =Blob.valueOf('Test Data');
        }
        attach.Body = pdfBlob;
        attach.Name = 'Receipt.pdf';
        attach.IsPrivate = false;
        attach.ParentId = transactionId[0];
        insert attach;
    }

    @AuraEnabled
    public static String createTransactionReceipt( String transactionId , String receiptId , String amountPaid , String paidDate , String paymentMethod , String paymentStatus) {
        system.debug('Generating Receipt');
        PageReference pdf = new PageReference('/apex/transactionReceipt');
        pdf.getParameters().put('receiptId', receiptId);
        pdf.getParameters().put('amountPaid', amountPaid);
        pdf.getParameters().put('paidDate', paidDate);
        pdf.getParameters().put('paymentMethod', paymentMethod);
        pdf.getParameters().put('paymentStatus', paymentStatus);
        pdf.setRedirect(true);
        
		
        //Created ContentVersion of attachment file
        
        
        
        
        ContentVersion ContVerFile = new ContentVersion();
        if(!Test.isRunningTest()){
        	ContVerFile.VersionData = pdf.getContent();
        }
        if(Test.isRunningTest()){
            ContVerFile.VersionData =Blob.valueOf('Test Data');
        }
        ContVerFile.Title = 'Receipt-'+receiptId+'.pdf'; 
        ContVerFile.ContentLocation= 's';
        ContVerFile.PathOnClient= 'Receipt.pdf';
        insert ContVerFile;
       
                    
        //insert ContentDocumentLink file 
        Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:ContVerFile.Id].ContentDocumentId;
        ContentDocumentLink cDe = new ContentDocumentLink();
        cDe.ContentDocumentId = conDoc;
        cDe.LinkedEntityId = transactionId;
        cDe.ShareType = 'I';
        cDe.Visibility = 'AllUsers';
        insert cDe;

        ContentDistribution cd = new ContentDistribution();
        cd.Name = ContVerFile.Title;
        cd.ContentVersionId = ContVerFile.id;
        cd.PreferencesAllowViewInBrowser= true;
        cd.PreferencesLinkLatestVersion=true;
        cd.PreferencesNotifyOnVisit=false;
        cd.PreferencesPasswordRequired=false;
        cd.PreferencesAllowOriginalDownload= true;
        insert cd;

        ContentDistribution contextList = [ select id, DistributionPublicUrl, ContentDownloadUrl, ContentDocumentId from ContentDistribution where id = :cd.Id ];


        return contextList.ContentDownloadUrl;
    }
}