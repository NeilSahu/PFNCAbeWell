public class BWPS_NeedHelpcaseCreate {
    
    @Auraenabled
    Public static String CreateLeadforNewsLetter(Object LeadDetails){
        Lead InsertLead = New Lead();
        try{
            List<lead> leadList = new List<lead>();
            Map<Object,Object> LeadmapCopy=(Map<Object,Object>)LeadDetails ;
            Map<Object,Object>  LeadDetailsMap= (Map<Object,Object>)LeadmapCopy.get('LeadDetails');
            String fullMail = String.valueOf(LeadDetailsMap.get('Email'));
            String [] LeadName =  fullMail.split('@');  
            InsertLead.Email = String.valueOf(LeadDetailsMap.get('Email'));
            InsertLead.Description = String.valueOf(LeadDetailsMap.get('Body'));
            InsertLead.Title = String.valueOf(LeadDetailsMap.get('Subject'));
            InsertLead.lastName = LeadName[0];
            InsertLead.Status = 'Open - Not Contacted';
            InsertLead.Company = 'Company';
            InsertLead.LeadSource = 'Web';
            Database.Insert(InsertLead,true);
            System.debug('Lead Created Id' +InsertLead.Id);
            leadList.add(InsertLead);
            SendMailDescription(leadList);     
        }
        catch(Exception e){
            System.debug('Exception occured '+e.getLineNumber());
            System.debug('Exception message '+e.getMessage());
        }
        return InsertLead.Id;
    }

    public static void SendMailDescription(List<Lead> leadList){
        try{
          List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
            For(lead leaddata:leadList){
  			  Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            List<String> sendTo = new List<String>{leaddata.Email};
             System.debug('EMAIL '+sendTo);
            mail.setToAddresses(sendTo);
            mail.setReplyTo('test@gmail.com');
            mail.setSenderDisplayName('Parkinson foundation');   
            mail.setSubject('Be Well Parkinson\'s Newsletter');      
            mail.setHtmlBody('<html><body>'+leaddata.Description +'</html>');
            mails.add(mail); 
              }   
            Messaging.sendEmail(mails);
            GlobalVariables.oneTimecall=true;    
          }
        catch(Exception e){
            System.debug('Exception occured '+e.getLineNumber());
            System.debug('Exception message '+e.getMessage());
        }
    }
    
    
    @Auraenabled
    Public static Id createCase(Object CaseMap,String lineItemId){
        Case InsertCase = New Case();
        Map<Object,Object> caseMapCopy=(Map<Object,Object>)CaseMap ;
        Map<Object,Object>  caseDataMap= (Map<Object,Object>)caseMapCopy.get('CaseData');
        InsertCase.SuppliedEmail = String.valueOf(caseDataMap.get('Email'));
        InsertCase.SuppliedName = String.valueOf(caseDataMap.get('Name'));
        InsertCase.Description = String.valueOf(caseDataMap.get('Body'));
        InsertCase.Subject = String.valueOf(caseDataMap.get('Subject'));
        InsertCase.Schedule_Class_Line_Item__c = lineItemId;
        InsertCase.Status = 'New';
        InsertCase.Type = 'Problem';
        InsertCase.Origin = 'Web';
        InsertCase.Reason = 'New problem';
        Database.Insert(InsertCase,False);
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        System.debug('case Created Id' +InsertCase.ID);
        return InsertCase.ID;
    }
    @Auraenabled(cacheable=true)
    Public static List<Case> getCaseNumber(String CaseId){
        List<Case> caseNo = [SELECT Id,CaseNumber,SuppliedEmail,SuppliedName,Description,Subject from Case WHERE Id=:CaseId];
        String[] toAddresses = new String[] {caseNo[0].SuppliedEmail};
            // String name = caseNo[0].SuppliedName;
            System.debug('EMAIL '+toAddresses);
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(toAddresses);
        mail.setReplyTo('test@gmail.com');
        mail.setSenderDisplayName('Parkinson foundation');   
        mail.setSubject(caseNo[0].Subject);      
        mail.setHtmlBody('<html><body>Hello '+ caseNo[0].SuppliedName + 'Your case number is'+caseNo[0].CaseNumber +'. Our team will contact you soon.'+'</html>');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        System.debug('case Created Number' +caseNo);
        return caseNo;
    }
    @AuraEnabled
    public static ID CreateCaseForSubscription(String caseMail){
        System.debug(caseMail);
        try {
            system.debug('caseMail '+caseMail);
            Case InsertCase = New Case();
            InsertCase.SuppliedEmail = caseMail;
            InsertCase.Description = caseMail;
            InsertCase.Subject = caseMail;
            InsertCase.Status = 'New';
            InsertCase.Type = 'Problem';
            InsertCase.Origin = 'Web';
            InsertCase.Reason = 'New problem';
            Database.Insert(InsertCase,False);
            System.debug('case Created Id' +InsertCase.Id);
            return InsertCase.Id;
            
        } catch (Exception e) {
            system.debug('error link number '+e.getLineNumber());
            system.debug('error message '+e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static ID CreateCaseForSupport(object CaseMap){
        Id contactId = [select contactId from user where id = :userinfo.getUserId() LIMIT 1].contactId;
        String caseMail = [select Email from contact where Id = :contactId LIMIT 1].Email;
        System.debug(caseMail);
        try {
            system.debug('caseMail '+ CaseMap);
            Case InsertCase = New Case();
            Map<Object,Object> caseMapCopy=(Map<Object,Object>)CaseMap ;
            System.debug('caseMapCopy'+caseMapCopy);
            Map<Object,Object>  caseDataMap= (Map<Object,Object>)caseMapCopy.get('CaseData');
            InsertCase.SuppliedEmail = caseMail;
            InsertCase.SuppliedName = 'demo';
            InsertCase.Description = String.valueOf(caseDataMap.get('Body'));
            InsertCase.Subject = String.valueOf(caseDataMap.get('Subject'));
            InsertCase.Status = 'New';
            InsertCase.Type = 'Problem';
            InsertCase.Origin = 'Web';
            InsertCase.Reason = 'New problem';
            Database.Insert(InsertCase,False);
            System.debug('case Created Id' +InsertCase.Id);
            return InsertCase.Id;
        } 
        catch (Exception e) {
            system.debug('error link number '+e.getLineNumber());
            system.debug('error message '+e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}