public class BWPS_ShareScheduleClass {
    @Auraenabled
    Public static String CreateLeadforScheduleClassshared(Object LeadDetails){
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
                  System.debug('Lead '+leadList);     
        }
        catch(Exception e){
            System.debug('Exception occured '+e.getLineNumber());
            System.debug('Exception message '+e.getMessage());
        }
        return InsertLead.Id;
    }
    @Auraenabled
    Public static String CreateLeadforContactUs(Object LeadDetails){
       Lead InsertLead = New Lead();
        try{
          List<lead> leadList = new List<lead>();
        		Map<Object,Object> LeadmapCopy=(Map<Object,Object>)LeadDetails ;
                  Map<Object,Object>  LeadDetailsMap= (Map<Object,Object>)LeadmapCopy.get('LeadDetails');
                  InsertLead.Email = String.valueOf(LeadDetailsMap.get('Email'));
                  InsertLead.Description = String.valueOf(LeadDetailsMap.get('Message'));
                  InsertLead.Title = String.valueOf(LeadDetailsMap.get('Name'));
                  InsertLead.lastName = String.valueOf(LeadDetailsMap.get('Name'));
                  //InsertLead.Phone = String.valueOf(LeadDetailsMap.get('Phone'));
                  InsertLead.Status = 'Open - Not Contacted';
                  InsertLead.Company = 'Company';
                  InsertLead.LeadSource = 'Web';
                  Database.Insert(InsertLead,true);
                  System.debug('Lead Created Id' +InsertLead.Id);
                  leadList.add(InsertLead);
                  SendMailContactus(leadList);
                  System.debug('Lead '+leadList);
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
            mail.setSubject('Class Description shared with you ');      
            mail.setHtmlBody('<html><body>'+leaddata.Description +'</html>');
            mails.add(mail); 
              }   
            Messaging.sendEmail(mails);
            GlobalVariables.oneTimecall=true;    
          }
        //System.debug('Lead '+leadList);
        catch(Exception e){
            System.debug('Exception occured '+e.getLineNumber());
            System.debug('Exception message '+e.getMessage());
        }
    }
    public static void SendMailContactus(List<Lead> leadList){
      try{
        System.debug('Inside send mail');
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
          For(lead leaddata:leadList){
      Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
          List<String> sendTo = new List<String>{leaddata.Email};
           System.debug('EMAIL '+sendTo);
          mail.setToAddresses(sendTo);
         mail.setReplyTo('test@gmail.com');
        mail.setSenderDisplayName('Parkinson foundation');   
        mail.setSubject('You just contactus');      
        mail.setHtmlBody('<html><body>Hello '+leaddata.Name +' <br/><br/>'+'You just contact us we will keep you in loop for our programs and campaigns'+'</html>');
        mails.add(mail); 
          }   
        Messaging.sendEmail(mails);
        System.debug('mail send');
        GlobalVariables.oneTimecall=true;    
      }
      //System.debug('Lead '+leadList);
      catch(Exception e){
          System.debug('Exception occured '+e.getLineNumber());
          System.debug('Exception message '+e.getMessage());
      }
  }
}