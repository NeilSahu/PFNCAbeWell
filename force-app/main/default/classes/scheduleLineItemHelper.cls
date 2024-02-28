public class scheduleLineItemHelper {
    public static void updatePlayondemanddureation(Map<Id,Schedule_Class_Line_Item__c> newMap , Map<Id,Schedule_Class_Line_Item__c> oldMap){
        List<String> lineItemIds = new List<String>();
        for(Schedule_Class_Line_Item__c schLine :newMap.Values()){
            if(schLine.LectureVideoId__c != oldMap.get(schLine.Id).LectureVideoId__c && schLine.LectureVideoId__c != null){
                lineItemIds.Add(schLine.Id);
            }
        } 
        if(lineItemIds.size() > 0){
          Id jobID = System.enqueueJob(new BWPS_VimeoIntegration(lineItemIds));
        }
    }
}