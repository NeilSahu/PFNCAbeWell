public class SendMailNeedHelp{
     public static void sendingEmail(List<Case> CasesList)
        {    
            List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
            For(case casedata:CasesList){
              Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
              List<String> sendTo = new List<String>{casedata.SuppliedEmail};
              mail.setToAddresses(sendTo);
              //mail.setReplyTo('himanshu@gmail.com');
              mail.setSenderDisplayName('Parkinson foundation');   
              mail.setSubject('Our team will connect with you');      
              mail.setHtmlBody('<div style="width: 100%;background: #f6f6f6;max-width: 600px;margin: auto;font-family: sans-serif;padding: 0px 10px;"><br><p style="color: green;border:3px solid green;width: max-content;border-radius:100px;padding:17px 25px;font-size:30px;font-weight: bold;margin: auto;">✓</p><p style="font-size: 18px;text-align: center;padding: 0px 10px 20px;">Thank you for your Valuable time</p><p>Your Query:</p><hr><h5 style="margin: 0;padding: 0 0 0 10px;">Subject:</h5><p style="margin: 0;padding: 5px 0px 5px 10px;">'+casedata.Subject+'</p><h5 style="margin: 0;padding: 10px 0px 0px 10px;">Message:</h5><p style="margin: 0;padding: 5px 0px 5px 10px;">'+casedata.Description+'</p><hr><p>Our team will get back to you soon.we are trying to resolve your query ASAP.<br /><br />Thank you<br />Parkinson Foundation</p><br></div>');
              mails.add(mail); 
            }   
            Messaging.sendEmail(mails);
            GlobalVariables.oneTimecall=true;  
		} 
}