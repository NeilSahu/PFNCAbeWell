public without sharing class BWPS_EmailSend {
 @Auraenabled
    public static void memoriesSendEmail(String base64, String filename, String recordId , string name, String email, string description){
        System.debug('base64>>>'+base64); 
        System.debug('filename>>>>>'+filename); 
        System.debug('name>>>>'+name);
        System.debug('email>>>>'+email); 
        System.debug('description>>>>'+description);     
        try{
        String body ='Hi';
        Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
        efa.setFileName(filename);
        efa.setBody((Blob)EncodingUtil.base64Decode(base64)); 
        List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        List<String> sendTo = new List<String>{email};
        mail.setToAddresses(sendTo);
        mail.setSenderDisplayName('Parkinson foundation');   
        mail.setSubject('Dedicated to '+name);      
        mail.setHtmlBody('<html>'+ description+'</html>');
        mail.setFileAttachments(new Messaging.EmailFileattachment[]{efa});
        mails.add(mail); 
        Messaging.sendEmail(mails);
        GlobalVariables.oneTimecall=true;  
        } catch(Exception e){
            System.debug('eeee'+ e.getMessage()+'staceTracing'+e.getStackTraceString());
        }
    }
}