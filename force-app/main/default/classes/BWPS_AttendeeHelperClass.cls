public class BWPS_AttendeeHelperClass {//deprecated
    public Static Void CreateAttendee(List<Enrolled_Class__c> EnrolledClassList){
        Set<ID> scID=new Set<ID>();
        Map<ID,Enrolled_Class__c> newMap=new Map<ID,Enrolled_Class__c>(EnrolledClassList);
        Map<String,List<String>> mapId=new Map<String,List<String>>();
        For(Enrolled_Class__c ec:EnrolledClassList){
            scID.add(ec.Schedule_Class__c);
            if(mapId.keySet().contains(ec.Schedule_Class__c)){
                mapId.get(ec.Schedule_Class__c).add(ec.Id);
            }
            else{
                mapId.put(ec.Schedule_Class__c,new List<String>{ec.Id});
            }
        }
        List<String> alreadyCreated=new List<Id>();
        List<Schedule_Class_Line_Item__c> scliList=[select Id,Schedule_Class__c from Schedule_Class_Line_Item__c where Schedule_Class__c in :scID];
        List<Attendee__c> attendeeList = New List<Attendee__c>();
        For(Schedule_Class_Line_Item__c EnClass:scliList){
            
            for(String mapEntry:mapId.get(EnClass.Schedule_Class__c)){
                
                Attendee__c attendee = New Attendee__c();
                attendee.Schedule_Class_Line_Item_del__c=EnClass.Id;
                attendee.Attendee_Name_del__c= newMap.get(mapEntry).Attendee__c;
                attendeeList.Add(attendee);
            }
            
        }
        If(attendeeList.Size()>0){
            Insert attendeeList;
        }
    }
}