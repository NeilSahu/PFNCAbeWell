public class Bwps_getuserNotification {
    @AuraEnabled(cacheable=true)
    public static String  getUserNotification(){
        Http h = new Http();
        HttpRequest webReq = new HttpRequest();
        String sfdcURL = URL.getOrgDomainUrl().toExternalForm();  
        webReq.setMethod('GET');
        webReq.setHeader('Authorization','Bearer '+UserInfo.getSessionId());
        webReq.setEndpoint(sfdcURL+'/services/data/v52.0/connect/notifications');
        HttpResponse res = h.send(webReq);
        System.debug(' ------ '+res.getbody());
        return Json.serialize(res.getbody());
    }
    // Method Use to mark Notiffication As seen
    @AuraEnabled(cacheable=true)
    public static String markAsRead(Object jsonstring){
        system.debug('jsonstring>>> '+jsonstring);
        String sfdcURL = URL.getOrgDomainUrl().toExternalForm(); 
        String restAPIURL = sfdcURL + '/services/data/v51.0/connect/notifications';
        HttpRequest httpRequest = new HttpRequest();
        //Map<String, object> reqData = (Map<String, object>)JSON.deserializeUntyped(jsonstring);
       // List<String> idList = (List<String>)reqData.get('NotificationsIds');
      //  String idListStr = idList.toString();
       // System.debug('idliststr : '+idListStr);
        httpRequest.setMethod('PATCH');
        httpRequest.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());
        httpRequest.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID());
        httpRequest.setHeader('Content-Type', 'application/json');
        httpRequest.setEndpoint(restAPIURL);
        String body = JSON.serialize(jsonstring);
            /*'{' +
            '"notificationIds" :'+idListStr
            +',"read" : "true"' +
            '}';*/
        httpRequest.setBody(body);
        String response = '';
        try {  
            Http http = new Http();   
            HttpResponse httpResponse = http.send(httpRequest);  
            System.debug(' ------ '+httpResponse.getbody());
            if (httpResponse.getStatusCode() == 200 ) {  
                response = JSON.serializePretty( JSON.deserializeUntyped(httpResponse.getBody()) );     
            } else {
                response = JSON.serializePretty( JSON.deserializeUntyped(httpResponse.getBody()));
            }
            return response;
        } catch( System.Exception e) {  
            System.debug('ERROR: '+ e);
            response = String.valueOf(e.getMessage());
            return response;
        }
    }
}