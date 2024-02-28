public class BWPS_VimeoIntegration implements Queueable,Database.AllowsCallouts{
    public List<String> scLItemIds; 
    public BWPS_VimeoIntegration(List<String> classesIds){
        scLItemIds = classesIds ;
        
    }
    public static void vimeoAuthProvider(){
      VimeoAuth__mdt connectioSetting = [Select Token_url__c,Is_active__c,Folder_Ids__c,Endpoind__c,Clint_secret__c,AuthUrl__c,Clint_identifier__c  FROM VimeoAuth__mdt WHERE DeveloperName = 'Auth1' Limit 1];
        HTTP newHttp = new HTTP();  
        HTTPRequest reqAuth = new HTTPRequest();
        String url = 'https://api.vimeo.com/oauth/authorize?response_type=code&client_id=b4a64e2f8134e6d4e0302726947baf360695c421&redirect_uri=https://parkinsonfoundationofthenationalca--pfncadna--c.sandbox.vf.force.com/apex/VimeoIntegrationRediractURI&state=public&scope=public';
       	//reqAuth.setEndpoint('https://api.vimeo.com/oauth/authorize/client');
        reqAuth.setEndpoint(url);
        reqAuth.setMethod('POST');
      	//reqAuth.setHeader('Authorization','basic base64_encode('+connectioSetting.Clint_identifier__c+':'+connectioSetting.Clint_secret__c+')');
        reqAuth.setHeader('Accept', 'application/vnd.vimeo.*+json;version=3.4');
        reqAuth.setHeader('Content-Type', 'application/json');  
        reqAuth.setHeader('scope', 'public');  
        String s = '{ "grant_type": "client_credentials","scope": "public"}';
        reqAuth.setBody(s);
        HTTPResponse resAuth = newHttp.send(reqAuth);
        
        System.debug('res111 : '+resAuth);
        System.debug('res : '+resAuth.getBody());
        System.debug('StatusCode : '+resAuth.getStatusCode());
    }
     public void execute(QueueableContext qc){
       List<Schedule_Class_Line_Item__c> ScheduleLineItemList = [SELECT Id,Name,Schedule_Class__c,LectureVideoId__c,Video_Duration__c,BWPS_Status__c,BWPS_StartTime__c,BWPS_EndTime__c,BWPS_ClassDay__c,BWPS_ClassDate__c,BWPS_Integrity__c,LectureId__c,BWPS_Vimeo_video_Id__c 
                                                                  FROM Schedule_Class_Line_Item__c WHERE Id IN : scLItemIds]; 
        System.debug('ScheduleLineItemList : '+ScheduleLineItemList);
        for(Schedule_Class_Line_Item__c lineItem :ScheduleLineItemList){
                String vimeoId = lineItem.LectureVideoId__c.trim();
                HTTP hMeet = new HTTP();
                HTTPRequest reqMeet = new HTTPRequest();
                //reqMeet.setEndpoint('callout:Zoom_api/v2/users/me/meetings');
                //reqMeet.setEndpoint('https://api.vimeo.com/users/50784308/folders/14678515/videos');
                reqMeet.setEndpoint('https://api.vimeo.com/videos/'+vimeoId);
                //798522333e
                reqMeet.setMethod('GET');
                reqMeet.setHeader('Authorization','Bearer 7a492d69359e80947bb38fb67db2e651');
                reqMeet.setHeader('Accept', 'application/json');
                reqMeet.setHeader('Content-Type', 'application/json');        
                //reqMeet.setBody();
                HTTPResponse resMeet = hMeet.send(reqMeet);
                System.debug('res : '+resMeet.getBody());
                System.debug('StatusCode : '+resMeet.getStatusCode());
                Map<String,Object> obj = (Map<String, object>)JSON.deserializeUntyped(resMeet.getBody());
                String duration = String.ValueOf(obj.get('duration'));
                String key = String.ValueOf(obj.get('player_embed_url'));
                System.debug('duration : '+ duration);
               lineItem.BWPS_Vimeo_video_Id__c = vimeoId + '/?'+key.split('\\?')[1];
               lineItem.Video_Duration__c = duration;
        }
        Database.Update(ScheduleLineItemList,false);
    }
}