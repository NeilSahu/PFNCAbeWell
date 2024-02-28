@RestResource(urlMapping='/takeAttendence/*')
global class ZoomWebhookController
{
    @HttpPost
    global static void doPost()
    {
        RestRequest reqZoom = RestContext.request;
        RestResponse resZoom = RestContext.response;
        String request = reqZoom.requestBody.toString();
        String response = ''; //resZoom.responseBody.toString();
        ZoomLogs__c log = new ZoomLogs__c(Value__c = request);
        insert log;
        //String plainToken = reqZoom.requestBody.payload.plainToken;
        try{
            Map<String, object> reqData = (Map<String, object>)JSON.deserializeUntyped(request);
            Map<String,Object> payload = (Map<String,Object>)reqData.get('payload');
            String event = (String)reqData.get('event');
            if(event == 'endpoint.url_validation') {
                String key = 'W68Xw9VnQDGyBkdBMwleWw';//NEpPHqHtQQmfaJtg54LPUQ
                System.debug('request : '+request);
                String plainToken = (String)payload.get('plainToken');
                
                Blob blobSignature = Crypto.generateMac('hmacSHA256', Blob.valueOf(plainToken), Blob.valueOf(key));
                System.debug(EncodingUtil.convertToHex(blobSignature));
                String hashForValidate = EncodingUtil.convertToHex(blobSignature);
                System.debug('jsonBody : '+request);
                JSONGenerator genJson = JSON.createGenerator(true);
                genJson.writeStartObject(); 
                genJson.writeStringField('plainToken', plainToken);
                genJson.writeStringField('encryptedToken', hashForValidate);
                genJson.writeEndObject();
                String body = genJson.getAsString();
                resZoom.responseBody = Blob.valueOf(body);
            }
            else if(event == 'meeting.participant_joined'){
                Map<String,Object> obj = (Map<String,Object>)payload.get('object');
                Map<String,Object> participants = (Map<String,Object>)obj.get('participant');
                String meetingId = (String)obj.get('id');
                String user_name = (String)participants.get('user_name');
                String email = (String)participants.get('email');
                List<Contact> con = [Select Id, Name, npe01__WorkEmail__c,CustomDescription__c From Contact Where npe01__WorkEmail__c =: email Limit 1];
                String conId = '';
                if(con.size() >= 1){
                    conId = con[0].Id;
                    con[0].CustomDescription__c	= request;
                }
                List<Attendee__c> attList = [Select Id, Name,Description__c, Is_Present__c, LectureId__c,Attendee_Name_del__c From Attendee__c Where LectureId__c	=: meetingId AND Attendee_Name_del__c =: conId LIMIT 1];
                if(attList.size() >= 1){
                    attList[0].Is_Present__c = 'Present';
                    attList[0].Description__c = request;
                    System.debug('Updated AttList : '+attList);
                }
                Update attList;
                update con;
            }
        }
        catch(Exception error){
            System.debug('Error'+error);
            ZoomLogs__c log2 = new ZoomLogs__c(Value__c = error.getMessage()+' : '+error.getLineNumber()+' : '+error.getStackTraceString());
        	insert log2;
        }
        
    	//return request;
    }
    
    @HttpGet
    global static String doGet()
    {
    	return 'Zoom working in get';
    }
}