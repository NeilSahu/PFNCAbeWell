public class BWPS_EnrolledClassHelper {
    Public static void CreateAttendeesForEnrolled(Map<id,Enrolled_Class__c> EnrolledClassMap){
        try{
            Set <Id> enrolledIdset = new Set<Id>();
            Set <Id> ScheduleClassIdset = new Set<Id>();
            List<Attendee__c> InsertAttendees = New  List<Attendee__c>();
            enrolledIdset = EnrolledClassMap.keySet();
            //List<Schedule_Class__c>  ScheduleClassList = [SELECT Id, Name,(SELECT Name FROM Enrolled_Classes__r ) FROM Schedule_Class__c WHERE id IN :(SELECT id FROM Enrolled_Class__c WHERE Id IN:enrolledIdset];
            List<Enrolled_Class__c> EnrolledClassList = [SELECT Id,Name,Schedule_Class__c,Attendee__c FROM Enrolled_Class__c WHERE id IN :enrolledIdset];
            for(Enrolled_Class__c EC :EnrolledClassList) {
                ScheduleClassIdset.Add(EC.Schedule_Class__c);
            } 
            List<Schedule_Class_Line_Item__c> ScheduleLineItemList = [SELECT Id,Name,Schedule_Class__c,BWPS_Status__c,BWPS_StartTime__c,BWPS_EndTime__c,BWPS_ClassDay__c,BWPS_ClassDate__c,BWPS_Integrity__c,LectureId__c FROM Schedule_Class_Line_Item__c WHERE Schedule_Class__c IN :  ScheduleClassIdset];
            
            For(Enrolled_Class__c EC :EnrolledClassList){
                for(Schedule_Class_Line_Item__c ScLi :ScheduleLineItemList){
                    If(EC.Schedule_Class__c ==ScLi.Schedule_Class__c){
                        Attendee__c atnd = new Attendee__c();
                        atnd.Attendee_Name_del__c  = EC.Attendee__c;
                        atnd.Schedule_Class_Line_Item_del__c = ScLi.Id;
                        atnd.BWPS_Is_Enrolled__c = true;
                        atnd.LectureId__c = Scli.LectureId__c;
                        atnd.Class_Status__c = 'JOIN';
                        InsertAttendees.add(atnd);  
                    } 
                }
            }
            System.debug('Attendees : '+InsertAttendees);
        	Database.insert(InsertAttendees,true);
        }
        Catch(Exception e){
             System.debug('Exception occured on line number '+e.getLineNumber());
             System.debug('Exception occured due to '+ e.getMessage());
        }
       
    }
}