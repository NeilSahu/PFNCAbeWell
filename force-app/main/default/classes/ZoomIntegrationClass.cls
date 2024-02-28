public class ZoomIntegrationClass {
   //public static String accessToken;
   Public static Boolean firstcall=true;
   @future (callout=true)
   public static void refreshAccessToken(){
        /*ZoomData__c zoomData = [Select Id,Name,ClientId__c,ClientSecret__c,RefreshToken__c,Url__c From ZoomData__c Where Name = 'ZoomDetails' Limit 1];
        String url = zoomData.Url__c;
        String clientId = zoomData.ClientId__c;
        String clientSecret = zoomData.ClientSecret__c;
        String header = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(clientId + ':' + clientSecret));
        String refresh_token = zoomData.RefreshToken__c;
        String body = 'grant_type=refresh_token&refresh_token=' + refresh_token;*/
       
        ZoomDetails__mdt ZoomDetails = [Select Id,Label,MasterLabel,ClientId__c,ClientSecret__c,RefreshToken__c,Url__c,AccessToken__c From ZoomDetails__mdt Where MasterLabel = 'ZoomDetails' Limit 1];
        String url = ZoomDetails.Url__c;
        String clientId = ZoomDetails.ClientId__c;
        String clientSecret = ZoomDetails.ClientSecret__c;
        String header = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(clientId + ':' + clientSecret));
        String refresh_token = ZoomDetails.RefreshToken__c;
        String body = 'grant_type=refresh_token&refresh_token=' + refresh_token;
       	System.debug('Zoom Details : '+ZoomDetails);
        //Start http request
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();
        req.setEndpoint(url);
        req.setMethod('POST');
        req.setBody(body);
        req.setHeader('Authorization', header);
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        res = h.send(req);
        System.debug(res.getBody());
        map<String,object> bodyy=(map<String,object>)JSON.deserializeUntyped(res.getBody());
        system.debug(bodyy.get('access_token'));
        system.debug(bodyy.get('refresh_token'));
        system.debug(bodyy.keyset());
      	
       	Metadata.CustomMetadata customMetadata = new Metadata.CustomMetadata();
        customMetadata.fullName = 'ZoomDetails.ZoomDetails';
        customMetadata.label = 'ZoomDetails';
       	Metadata.CustomMetadataValue customField = new Metadata.CustomMetadataValue();
       	customField.field = 'RefreshToken__c';
       	customField.value = (String)bodyy.get('refresh_token');
       	customField.field = 'AccessToken__c';
       	customField.value = (String)bodyy.get('access_token');
       	customMetadata.values.add(customField);
       
        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
        mdContainer.addMetadata(customMetadata);
        metadataInsertUpdate callback = new metadataInsertUpdate();
       	if (!Test.isRunningTest()) {
    		Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, callback);
		}
        
        
        //ZoomDetails.RefreshToken__c = (String)bodyy.get('refresh_token');
        //zoomData.AccessToken__c = (String)bodyy.get('access_token');
        //update zoomData;
        //String jobId2 = MetaDataUtility.upsertMetadata(zoomData);
        //accessToken =  'Bearer '+(String)bodyy.get('access_token');
       	//System.debug('Access Token New : '+accessToken);
    }
    @future(callout = true)
    public static void createClassroomMeetingOnZoom(List<Id> scliIds){
        if(firstcall){
            //firstcall = true;
            List<Schedule_Class_Line_Item__c> scliList = [Select Id, Name,LectureId__c, BWPS_ClassDate__c,BWPS_StartTime__c, Schedule_Class__r.BWPS_instructor__r.Name, Schedule_Class__r.BWPS_instructor__r.npe01__WorkEmail__c From Schedule_Class_Line_Item__c WHERE Id IN : scliIds FOR UPDATE];
            //RefreshToken Generation Code
            //refreshAccessToken();
            //ZoomDetails__mdt ZoomDetails = [Select Id,Label,MasterLabel,ClientId__c,ClientSecret__c,RefreshToken__c,Url__c,AccessToken__c From ZoomDetails__mdt Where MasterLabel = 'ZoomDetails' Limit 1];
            //String accessToken = 'Bearer '+ZoomDetails.AccessToken__c;
            /*ZoomDetails__mdt ZoomDetails = [Select Id,Label,MasterLabel,ClientId__c,ClientSecret__c,RefreshToken__c,Url__c,AccessToken__c From ZoomDetails__mdt Where MasterLabel = 'ZoomDetails' Limit 1];
            String url = ZoomDetails.Url__c;
            String clientId = ZoomDetails.ClientId__c;
            String clientSecret = ZoomDetails.ClientSecret__c;
            String header = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(clientId + ':' + clientSecret));
            String refresh_token = ZoomDetails.RefreshToken__c;
            String refBody = 'grant_type=refresh_token&refresh_token=' + refresh_token;
            System.debug('Zoom Details : '+ZoomDetails);
            //Start http request
            Http h = new Http();
            HttpRequest req = new HttpRequest();
            HttpResponse res = new HttpResponse();
            req.setEndpoint(url);
            req.setMethod('POST');
            req.setBody(refBody);
            req.setHeader('Authorization', header);
            req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            res = h.send(req);
            System.debug(res.getBody());
            map<String,object> bodyy=(map<String,object>)JSON.deserializeUntyped(res.getBody());
            system.debug(bodyy.get('access_token'));
            system.debug(bodyy.get('refresh_token'));
            system.debug(bodyy.keyset());
            Metadata.CustomMetadata customMetadata = new Metadata.CustomMetadata();
            customMetadata.fullName = 'ZoomDetails.ZoomDetails';
            customMetadata.label = 'ZoomDetails';
            Metadata.CustomMetadataValue customField = new Metadata.CustomMetadataValue();
            customField.field = 'RefreshToken__c';
            customField.value = (String)bodyy.get('refresh_token');
            customField.field = 'AccessToken__c';
            customField.value = (String)bodyy.get('access_token');
            customMetadata.values.add(customField);
            
            String accessToken =  'Bearer '+(String)bodyy.get('access_token');*/
            
            Map<Id,String> scliIdAndLecidMap = new Map<Id, String>();
            for(Schedule_Class_Line_Item__c s : scliList){
                String lineItemName = ''+s.Name;
                //String hostEmail = ''+s.Schedule_Class__r.BWPS_instructor__r.npe01__WorkEmail__c;
                String strTime = ''+s.BWPS_ClassDate__c;
                String classDate = strTime.split(' ').get(0);
                String startTime = s.BWPS_ClassDate__c+'T'+s.BWPS_StartTime__c;
                System.debug('StartTime : '+startTime);
                JSONGenerator settingJson = JSON.createGenerator(true);
                settingJson.writeStartObject();
                settingJson.writeStringField('authentication_domains','gmail.com');
                settingJson.writeEndObject();
                settingJson.close();
                String setString = settingJson.getAsString();
                JSONGenerator genJson = JSON.createGenerator(true);
                genJson.writeStartObject(); 
                genJson.writeStringField('agenda', 'Sample Class Zoom Integration');
                genJson.writeStringField('start_time', startTime);
                genJson.writeObjectField('settings', setString );
                //genJson.writeStringField('authentication_domains', 'gmail.com');
                //genJson.writeStringField('agenda', 'My Meeting 2');
                //genJson.writeStringField('start_time', '2022-12-25T07:32:55Z');
                //genJson.writeFieldName('AccountList');
                genJson.writeEndObject();
                String body = genJson.getAsString();
                genJson.close();
                // "alternative_hosts" : "'+hostEmail+'", in settings
                String son = '{"agenda" : "Sample Class Zoom Integration","topic" :"'+lineItemName+'", "start_time" : "'+ startTime +'", "settings" : {"authentication_domains" : "gmail.com", "approval_type" : "2", "meeting_authentication" : "true", "auto_recording":"none"} }';
                //String reqJson = (String)JSON.deserialize(son, ZoomWebhookWrapperClass.class);
                System.debug('jsonData-' + son);
                //String body = `{ "agenda": "My Meeting 2","default_password": false,"duration": 60,"password": "1234567890","pre_schedule": false,"start_time": "2022-12-25T07:32:55Z","topic": "My Meeting","tracking_fields": [{"field": "field1","value": "value1"}],"type": 2}`;
                    
                //String accessToken = refreshAccessToken();
                //String accessToken = 'Bearer eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiJjNjgwY2U4Mi03OWIzLTRiNWUtYjljNC1iMzNjYjViZGYwNDgifQ.eyJ2ZXIiOjcsImF1aWQiOiI2YTJjZDM2ZjY2ZGIwMzdmYTE0OTMwZWNhZDc2ZWZhZSIsImNvZGUiOiJXTW5YTFVITkEzbDEybElqQks5UjBPaTRFSkp5bFA4UWciLCJpc3MiOiJ6bTpjaWQ6SDhJSGc4QVRvV2lIVXBLSE4xVnNBIiwiZ25vIjowLCJ0eXBlIjowLCJ0aWQiOjAsImF1ZCI6Imh0dHBzOi8vb2F1dGguem9vbS51cyIsInVpZCI6IlNiNTNJYzVKUlR1dXVUNXlCTWNYZkEiLCJuYmYiOjE2NzEwOTk1NzMsImV4cCI6MTY3MTEwMzE3MywiaWF0IjoxNjcxMDk5NTczLCJhaWQiOiItY3dVb2xxOFM0S3BOSGJDeHc2eGdRIiwianRpIjoiZTQ5NjVmMjAtYThjMC00MDVhLWE4MjktZjZlYmQ2ZjlkNjE3In0.6wQ6WF9y989wd3D-zqa4sPmUs7ZughdVaBAG7Sxnz8bhBl1d3kIXESd39bwwR5ByYBQ_fDv2n5l8_EE9i18Qig';
                //System.debug('AccessToken' + accessToken);
                HTTP hMeet = new HTTP();
                HTTPRequest reqMeet = new HTTPRequest();
                reqMeet.setEndpoint('callout:Zoom_api/v2/users/me/meetings');
                //reqMeet.setEndpoint('https://api.zoom.us/v2/users/me/meetings');
                reqMeet.setMethod('POST');
                //reqMeet.setHeader('Authorization',accessToken);
                reqMeet.setHeader('Accept', 'application/json');
                reqMeet.setHeader('Content-Type', 'application/json');        
                reqMeet.setBody(son);
                HTTPResponse resMeet = hMeet.send(reqMeet);
                Map<String, object> jsonBody =(Map<String, object>)JSON.deserializeUntyped(resMeet.getBody());
                //Map<String, object> accJson =(Map<String, object>)(jsonBody.get('Account'));
                String JoinUrl = (String)jsonBody.get('join_url');
                Long MeetingId = (Long)jsonBody.get('id');
                String HstEmail = (String)jsonBody.get('host_email');
                String StartUrl = (String)jsonBody.get('start_url');
                System.debug('jsonBody'+jsonBody);
                if(JoinUrl != null || JoinUrl != ''){
                    s.BWPS_Lecture_Link__c = (String)jsonBody.get('join_url');
                    s.LectureId__c = String.valueOf(jsonBody.get('id'));
                    scliIdAndLecidMap.put(s.Id ,String.valueOf(jsonBody.get('id')));
                    
                }
                //s.BWPS_Lecture_Link__c = 'Vikas';
            }
            List<Attendee__c> attList = [Select Id,Name,Schedule_Class_Line_Item_del__c,LectureId__c FROM Attendee__c Where Schedule_Class_Line_Item_del__c IN : scliIds];
            for(Attendee__c a : attList){
                String LecId = scliIdAndLecidMap.get(a.Schedule_Class_Line_Item_del__c);
                a.LectureId__c = LecId;
            }
            System.debug('Updated Records : '+scliList);
            firstcall = false;
            update scliList;
            update attList;
            /*Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
            mdContainer.addMetadata(customMetadata);
            metadataInsertUpdate callback = new metadataInsertUpdate();
            Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, callback);*/
            /*Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
            mdContainer.addMetadata(customMetadata);
            metadataInsertUpdate callback = new metadataInsertUpdate();
            Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, callback);*/
            /*String refToken = (String)bodyy.get('refresh_token');
            String accToken = (String)bodyy.get('access_token');
            zoomIntegrationUpdateHandler updateHandler = new zoomIntegrationUpdateHandler(refToken, accToken);
            System.enqueueJob(updateHandler);*/
        }
    }
    public static void customMetadataMethod(){
        //metadata record creation
        Metadata.CustomMetadata customMetadata = new Metadata.CustomMetadata();
        customMetadata.fullName = 'quickbookMetadata__mdt.'+'RecordName';     
        customMetadata.label = 'RecordLabel';
        Metadata.CustomMetadataValue customField = new Metadata.CustomMetadataValue();        
        customField.field = 'FieldName';       
        customField.value = 'Field Value';       
        customMetadata.values.add(customField);        
        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();        
        mdContainer.addMetadata(customMetadata);       
        //metadataInsertUpdate callback = new metadataInsertUpdate();  
        if (!Test.isRunningTest()) {
    		Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, null);	
		}    
        
    }
    public static void updateMetadataMethod(){
       	/*List<Test_metadata__mdt> MetadataList1 = [SELECT MasterLabel, DeveloperName,Name__c, Account_Number__c FROM Test_metadata__mdt]; //MasterLabel, DeveloperName is required when query as we need them in update
        MetadataList1[0].Account_Number__c = 986532;
        MetadataList1[0].Account_Number__c = 659823;
        String jobId2 = MetaDataUtility.upsertMetadata(MetadataList1);*/
    }
    public static void getClassroomLink(List<Schedule_Class_Line_Item__c> scliList){
        //List<Schedule_Class_Line_Item__c> scliList
        System.debug('scliList'+scliList);
        List<Id> scliIds = new List<Id>();
        for(Schedule_Class_Line_Item__c s : scliList){
            scliIds.add(s.Id);
            //createClassroomMeetingOnZoom(AccessToken,s.Id);
		}
        //String AccessToken = refreshAccessToken();
        createClassroomMeetingOnZoom(scliIds);
    }
    @future(callout = true)
    public static void updateClassroomMeetingOnZoom(List<Id> scliIds){
        if(firstcall){
            //firstcall = true;
            List<Schedule_Class_Line_Item__c> scliList = [Select Id, Name,LectureId__c, BWPS_ClassDate__c,BWPS_StartTime__c, Schedule_Class__r.BWPS_instructor__r.Name, Schedule_Class__r.BWPS_instructor__r.npe01__WorkEmail__c From Schedule_Class_Line_Item__c WHERE Id IN : scliIds FOR UPDATE];

            Map<Id,String> scliIdAndLecidMap = new Map<Id, String>();
            for(Schedule_Class_Line_Item__c s : scliList){
                String strTime = ''+s.BWPS_ClassDate__c;
                String classDate = strTime.split(' ').get(0);
                String startTime = s.BWPS_ClassDate__c+'T'+s.BWPS_StartTime__c;
                System.debug('StartTime : '+startTime);
                JSONGenerator genJson = JSON.createGenerator(true);
                genJson.writeStartObject(); 
                genJson.writeStringField('agenda', 'Sample Class Zoom Integration');
                genJson.writeStringField('start_time', startTime);
                genJson.writeEndObject();
                String body = genJson.getAsString();
                String son = '{"agenda" : "My Meeting", "start_time" : "'+ startTime +'", "settings" : {"authentication_domains" : "gmail.com"} }';
                Map<String, Object> reqJson = (Map<String, Object>)JSON.deserializeUntyped(son);
                System.debug('jsonData-' + reqJson);
                //System.debug('jsonData-' + body);
                HTTP hMeet = new HTTP();
                HTTPRequest reqMeet = new HTTPRequest();
                reqMeet.setEndpoint('callout:Zoom_api/v2/meetings/'+s.LectureId__c);
                //reqMeet.setEndpoint('https://api.zoom.us/v2/users/me/meetings');
                reqMeet.setMethod('PATCH');
                //reqMeet.setHeader('Authorization',accessToken);
                reqMeet.setHeader('Accept', 'application/json');
                reqMeet.setHeader('Content-Type', 'application/json');        
                reqMeet.setBody(son);
                HTTPResponse resMeet = hMeet.send(reqMeet);
                Map<String, object> jsonBody =(Map<String, object>)JSON.deserializeUntyped(resMeet.getBody());
                //Map<String, object> accJson =(Map<String, object>)(jsonBody.get('Account'));
                String JoinUrl = (String)jsonBody.get('join_url');
                Long MeetingId = (Long)jsonBody.get('id');
                String HostEmail = (String)jsonBody.get('host_email');
                String StartUrl = (String)jsonBody.get('start_url');
                System.debug('jsonBody'+jsonBody);
            }
            System.debug('Updated Records : '+scliList);
            firstcall = false;
            //update scliList;
        }
    }
    @future(callout = true)
    public static void createZoomUser(List<Id> userIdList){
        List<User> userList = [Select Id, Name, FirstName, LastName, Email From User where Id IN :userIdList ];
        for(User u : userList){
            String firstName = u.FirstName;
            String lastName = u.LastName;
            String userEmail = u.Email;
            JSONGenerator genJson = JSON.createGenerator(true);
            genJson.writeStartObject(); 
            genJson.writeStringField('agenda', 'Sample Class Zoom Integration');
            //genJson.writeStringField('start_time', startTime);
            genJson.writeEndObject();
            String body = genJson.getAsString();
            String son = '{"action" : "create","user_info" : {"email" : "'+userEmail+'","first_name" : "'+firstName+'","last_name" : "'+lastName+'","type" : "1", "password" : "if42!LfJ@"} }'; //,"password" : "if42!LfJ@"
            //Map<String, Object> reqJson = (Map<String, Object>)JSON.deserializeUntyped(son);
            //System.debug('jsonData-' + reqJson);
            //System.debug('jsonData-' + body);
            HTTP hMeet = new HTTP();
            HTTPRequest reqMeet = new HTTPRequest();
            reqMeet.setEndpoint('callout:Zoom_api/v2/users');
            //reqMeet.setEndpoint('https://api.zoom.us/v2/users/me/meetings');
            reqMeet.setMethod('POST');
            //reqMeet.setHeader('Authorization',accessToken);
            reqMeet.setHeader('Accept', 'application/json');
            reqMeet.setHeader('Content-Type', 'application/json');        
            reqMeet.setBody(son);
            HTTPResponse resMeet = hMeet.send(reqMeet);
            Map<String, object> jsonBody =(Map<String, object>)JSON.deserializeUntyped(resMeet.getBody());
            //Map<String, object> accJson =(Map<String, object>)(jsonBody.get('Account'));
			//String userEmail = (String)jsonBody.get('email');
            //Long userId = (Long)jsonBody.get('id');
            //String firstName = (String)jsonBody.get('first_name');
            //String lastName = (String)jsonBody.get('last_name');
            //System.debug('jsonBody -- '+resMeet.getBody());
            System.debug('jsonBody'+jsonBody);
        }
    }

    @AuraEnabled
    public static String getSignature(String apiKey, String apiSecret) {
        Long timestamp = System.currentTimeMillis() / 1000L;
        String data = apiKey + (timestamp+'');
        Blob mac = Crypto.generateMac('HmacSHA256', Blob.valueOf(data), Blob.valueOf(apiSecret));
        return EncodingUtil.base64Encode(mac);
    }

}