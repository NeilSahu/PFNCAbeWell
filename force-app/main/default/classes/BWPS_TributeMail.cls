public without sharing class BWPS_TributeMail {
  @AuraEnabled
  public static String sendingEmail(String oppId)
  {
      opportunity OppRecord = [Select Name , npsp__Notification_Recipient_Email__c,  npsp__Tribute_Type__c, npsp__Primary_Contact__c , BWPS_Chargent_Order__c from Opportunity where Id = :oppId];
      System.debug('OppRecord : ' + OppRecord);
      ChargentOrders__Transaction__c transactionRecord = [SELECT Id, ChargentOrders__Order__r.ChargentOrders__Billing_Email__c FROM ChargentOrders__Transaction__c where ChargentOrders__Order__c = :OppRecord.BWPS_Chargent_Order__c ORDER BY CreatedDate DESC LIMIT 1];
      System.debug('transactionRecord : ' + transactionRecord);

      String transactionId = transactionRecord.Id;
      Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
      message.setTargetObjectId(OppRecord.npsp__Primary_Contact__c);
      message.setSenderDisplayName('Parkinson foundation');
      message.setReplyTo('no-reply@Parkinson-foundation.com');
      message.setUseSignature(false);
      message.setBccSender(false);
      message.setSaveAsActivity(false);
      EmailTemplate emailTemplate = new EmailTemplate();
      System.debug(OppRecord.npsp__Tribute_Type__c);
      if(OppRecord.npsp__Tribute_Type__c == null)
      {
        emailTemplate =[Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'DonationEmailForNonTributeDonations'];
      }
      else
      {
        emailTemplate =[Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'DonationEmailForTributeDonations'];
        EmailTemplate tributeTemplate = new EmailTemplate();
        if(OppRecord.npsp__Tribute_Type__c == 'Honor'){
          tributeTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'DonationInTributeToHonor'];
        }else{ 
          tributeTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'DonationInMemory'];
        }
        Messaging.SingleEmailMessage message2 = new Messaging.SingleEmailMessage();
        message2.setTargetObjectId(OppRecord.npsp__Primary_Contact__c);
        message2.setSenderDisplayName('Parkinson foundation');
        message2.setReplyTo('no-reply@Parkinson-foundation.com');
        message2.setUseSignature(false);
        message2.setBccSender(false);
        message2.setSaveAsActivity(false);
        //Get templete id for set the templete.
        message2.setTemplateID(tributeTemplate.Id);                                             

        message2.setWhatId(OppRecord.Id); //This is important for the merge fields in template to work

        message2.toAddresses = new String[] { OppRecord.npsp__Notification_Recipient_Email__c };

        Messaging.SingleEmailMessage[] messages2 = new List<Messaging.SingleEmailMessage> {message2};
        Messaging.SendEmailResult[] results2 = Messaging.sendEmail(messages2);

      }

      //Get templete id for set the templete.
      message.setTemplateID(emailTemplate.Id);

      message.setWhatId(transactionRecord.Id); //This is important for the merge fields in template to work

      message.toAddresses = new String[] { transactionRecord.ChargentOrders__Order__r.ChargentOrders__Billing_Email__c};

      Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage> {message};
      Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
    
      if (results[0].success)
      {
        return('The email was sent successfully.');
      }
      else
      {
        return('The email failed to send: ' + results[0].errors[0].message);
      } 
  } 

}