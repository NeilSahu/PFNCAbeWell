trigger ScheduleLineItemTrigger on Schedule_Class_Line_Item__c (before update, before insert, after insert, after update) {
    if(Trigger.isBefore){
        if(Trigger.isInsert){
            
        }
        if(Trigger.isUpdate){
            List<Schedule_Class_Line_Item__c> lineItemList = new List<Schedule_Class_Line_Item__c>();
            List<Id> lineItemIdList = new List<Id>();
            Boolean flag = false;
            for (Schedule_Class_Line_Item__c lineItemOld : Trigger.old) {
                Schedule_Class_Line_Item__c lineItemNew = Trigger.newMap.get(lineItemOld.Id);
                if (lineItemNew.BWPS_Vimeo_video_Id__c != null) {
                    lineItemNew.Lecture_Status__c = 'PLAY ON-DEMAND';
                    lineItemList.add(lineItemNew);
                    lineItemIdList.add(lineItemNew.Id);
                }
            }
            List<Attendee__c> attList = [Select Id, Name, Schedule_Class_Line_Item_del__c From Attendee__c WHERE Schedule_Class_Line_Item_del__c IN: lineItemIdList ];
            for (Schedule_Class_Line_Item__c lineItem : lineItemList) {
                for(Attendee__c att : attList){
                    if(lineItem.Lecture_Status__c == 'PLAY ON-DEMAND' && lineItem.Id == att.Schedule_Class_Line_Item_del__c){
                		att.Class_Status__c = 'PLAY ON-DEMAND';
                	}
                }
            }
            for(Schedule_Class_Line_Item__c s : Trigger.new){
                Schedule_Class_Line_Item__c scli = s;
                //Date newDate = new Date('00:05:00');
                //System.debug('start time : '+scli.BWPS_StartTime__c);
                //System.debug('end time : '+scli.BWPS_EndTime__c);
                Long  validationTime = 5 * 60000;
                DateTime startTime = DateTime.newInstance(Date.today(), scli.BWPS_StartTime__c);
                DateTime endTime = datetime.newinstance(Date.today(), scli.BWPS_EndTime__c);
                Long timeAvailable = endTime.getTime() - startTime.getTime();
                System.debug('end time in ms : '+endTime);
                System.debug('start time in ms : '+startTime);
                System.debug('End time in ms : '+ endTime.getTime());
                System.debug('timeAvailable in ms : '+ timeAvailable);
                if(timeAvailable < validationTime ){ 
                    scli.addError('Class should be minimum 5 min');
                }
                s.BWPS_ClassDay__c = s.BWPS_Class_Day__c;
            }
            update attList;
            //ZoomIntegrationClass.getClassroomLink(Trigger.new);
        }
    }
    if(Trigger.isAfter){
        if((Trigger.isInsert)){
            ZoomIntegrationClass.getClassroomLink(Trigger.new);
        } 
        if((Trigger.isUpdate) && ZoomIntegrationClass.firstcall){
            Bwps_ScheduleLineItemHelper.sendNotificationToguestUser(trigger.new);
            List<Id> scliIds = new List<Id>();
            for(Schedule_Class_Line_Item__c s : Trigger.new){
                scliIds.add(s.Id);
                //createClassroomMeetingOnZoom(AccessToken,s.Id);
            }
            ZoomIntegrationClass.updateClassroomMeetingOnZoom(scliIds);
          //  BWPS_VimeoIntegration.getAllFolderVideos(scliIds , Trigger.newMap , Trigger.oldMap) ;
          scheduleLineItemHelper.updatePlayondemanddureation(trigger.newMap,trigger.oldMap);
        } 
    }
}