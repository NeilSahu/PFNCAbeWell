public class BWPS_editScheduleIlneitemClass {
    @AuraEnabled
    Public Static Schedule_Class_Line_Item__c  ScheduleLineItemClassDetails(String ScheduleLineClassId){
            Schedule_Class_Line_Item__c ScheduleLineItemClass = [SELECT Schedule_Class__r.name,Schedule_Class__r.BWPS_Description__c,Id,Name,BWPS_EndTime__c,BWPS_StartTime__c,BWPS_ClassDate__c FROM Schedule_Class_Line_Item__c WHERE Id =:ScheduleLineClassId];
        return ScheduleLineItemClass;
    }
    @AuraEnabled
    Public Static String ScheduleClassEdit(String ScheduleClassData , String classId){
        String message = '';
        try {
          Map<String, object> formData = (Map<String, object>) JSON.deserializeUntyped(ScheduleClassData);
          System.debug('formData>>>>'+formData);
            System.debug(formData.get('StartDate'));
          System.debug('classId>>>>'+classId); 
          Schedule_Class_Line_Item__c updateScheduleLineItem = new Schedule_Class_Line_Item__c();
          String StartTime = String.Valueof(formData.get('StartTime'));
          String EndTime = String.Valueof(formData.get('EndTime'));
          String[] StartTimeSplit = StartTime.split(':');
          String[] EndTimeSplit = EndTime.split(':');
          Time StartTimeChange = Time.newInstance( Integer.valueOf(StartTimeSplit[0]),Integer.valueOf(StartTimeSplit[1]),0 ,0);
          Time EndTimeChange = Time.newInstance( Integer.valueOf(EndTimeSplit[0]),Integer.valueOf(EndTimeSplit[1]),0 ,0);
          String DateValue = String.valueOf(formData.get('StartDate'));
          Date dateofClass= Date.valueOf(DateValue);
          updateScheduleLineItem.BWPS_ClassDate__c =dateofClass;
          updateScheduleLineItem.BWPS_StartTime__c =StartTimeChange;
          updateScheduleLineItem.BWPS_EndTime__c = EndTimeChange;
          updateScheduleLineItem.Id = classId;
          database.update(updateScheduleLineItem,true);
          message='Class Successfully updated.';
        }
        Catch(Exception e){
            message = 'Update failed.'+String.valueOf(e.getMessage());
            System.debug('Exeception line number '+ e.getLineNumber());
            System.debug('Exception Message '+e.getMessage());
        }
        return message;
    }
}