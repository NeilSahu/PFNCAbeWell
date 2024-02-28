@isTest
public class BWPS_EmailSend_TEST {
     
    @isTest
    static void memoriesSendEmail_TEST() {
       
		String contactId = TestDataFactory.getContact();
        
        Contact contact = [SELECT Id,LastName, FirstName, Email FROM Contact Where Id =: contactId];
     
        String base64 = EncodingUtil.base64Encode(Blob.valueOf('Test attachment'));
        String filename = 'test.txt';
        String recordId = contact.Id;
        String name = contact.FirstName + ' ' + contact.LastName;
        String email = contact.Email;
        String description = 'Test email body';
        Test.startTest();
        Messaging.SingleEmailMessage emailMessage = new Messaging.SingleEmailMessage();
        emailMessage.setToAddresses(new List<String>{email});
        emailMessage.setSubject('Dedicated to ' + name);
        emailMessage.setHtmlBody('<html>'+ description+'</html>');
        emailMessage.setFileAttachments(new Messaging.EmailFileattachment[]{});
        BWPS_EmailSend.memoriesSendEmail(base64, filename, recordId, name, email, description);
        Test.stopTest();

        List<Messaging.SendEmailResult> sendResults = Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{emailMessage});
        System.assertEquals(1, sendResults.size());
        Messaging.SendEmailResult sendResult = sendResults[0];
        System.assertEquals(email, emailMessage.getToAddresses()[0]);
        System.assertEquals(true, sendResult.isSuccess());
    }
}