public class BWPS_ScheduleClassHelperClass {
    public static String RecordTypeRecurring =  Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get(BWPS_Constants.RecurringDonationRecordType).getRecordTypeId();
    public static String RecordTypeOneTime =  Schema.SObjectType.Schedule_Class__c.getRecordTypeInfosByName().get(BWPS_Constants.OneTimeDonationRecordType).getRecordTypeId();

    public Static Void CreateOneTimeScheduleLineItem(List<Schedule_Class__c> ShClassList){
        System.debug('ShClassList--'+ShClassList);
        List<Schedule_Class_Line_Item__c> ScheduleClassOneTimeInsert = New List<Schedule_Class_Line_Item__c>();
        For(Schedule_Class__c ScClassOneTime:ShClassList){
            Schedule_Class_Line_Item__c SchedulLineItem = New Schedule_Class_Line_Item__c();
            Date StartdateCal = (Date) ScClassOneTime.BWPS_Date__c;
            Datetime StartDateIncrease = (DateTime)StartdateCal;
            String ThatdayOfWeek = StartDateIncrease.format('EEEE');
            SchedulLineItem.Schedule_Class__c = ScClassOneTime.Id;
            SchedulLineItem.Name = ScClassOneTime.Name;
            SchedulLineItem.BWPS_ClassDate__c = StartdateCal;
            SchedulLineItem.BWPS_Status__c='Active';
            if(ScClassOneTime.Schedule_Type__c == 'Hybrid'){
                 SchedulLineItem.Lecture_Status__c='HYBRID';
            }
            else if(ScClassOneTime.Schedule_Type__c == 'In Person'){
                SchedulLineItem.Lecture_Status__c='IN-PERSON';
            }
            else if(ScClassOneTime.Schedule_Type__c == 'Live'){
                SchedulLineItem.Lecture_Status__c='LIVE';
            }
            SchedulLineItem.BWPS_StartTime__c=ScClassOneTime.BWPS_StartTime__c;
            SchedulLineItem.BWPS_EndTime__c=ScClassOneTime.BWPS_EndTime__c;
            SchedulLineItem.BWPS_Integrity__c=ScClassOneTime.Integrity__c;
             if(ScClassOneTime.Vimeo_External_Key__c!=null && ScClassOneTime.Vimeo_External_Key__c!=''){
            SchedulLineItem.Vimeo_External_Sub_Key__c=ScClassOneTime.Vimeo_External_Key__c+'Day1';
             }
            SchedulLineItem.BWPS_ClassDay__c = ThatdayOfWeek;
            ScheduleClassOneTimeInsert.Add(SchedulLineItem);
        }
        If(ScheduleClassOneTimeInsert.Size()>0){
            Insert ScheduleClassOneTimeInsert;
        }
    }
    Public Static Void CreateScheduleClassLineItem(List<Schedule_Class__c> ShClassList){
        List<Schedule_Class_Line_Item__c> ScheduleLineItemInsert = new List<Schedule_Class_Line_Item__c>();                            
        For(Schedule_Class__c sc:ShClassList) {
            Date Startdate = sc.BWPS_Date__c;
            Datetime StartDateCon = (DateTime)Startdate;
            String dayOfWeek = StartDateCon.format('EEEE');
            Integer calDays = (Integer)sc.BWPS_ClassFrequency__c*7;
            Date LastDateofClass = Startdate +calDays;
            Date StartdateCal = (Date) sc.BWPS_Date__c;
            Integer count = 1;
            For(Integer i=1;i<=calDays;i++){                   
                Schedule_Class_Line_Item__c SchedulLineItem = New Schedule_Class_Line_Item__c();
            Datetime StartDateIncrease = (DateTime)StartdateCal;
            String ThatdayOfWeek = StartDateIncrease.format('EEEE');
                //System.debug('ThatdayOfWeek' +ThatdayOfWeek);
                //System.debug('StartdateCal '+StartdateCal);
                If(sc.Schedule_Days__c.contains(ThatdayOfWeek)){
                    SchedulLineItem.Name = sc.Name + i;
                    SchedulLineItem.Schedule_Class__c = sc.Id;
                    SchedulLineItem.BWPS_ClassDate__c = StartdateCal;
                    SchedulLineItem.BWPS_Status__c='Active';
                     if(sc.Schedule_Type__c == 'Hybrid'){
                             SchedulLineItem.Lecture_Status__c='HYBRID';
                        }
                        else if(sc.Schedule_Type__c == 'In Person'){
                            SchedulLineItem.Lecture_Status__c='IN-PERSON';
                        }
                        else if(sc.Schedule_Type__c == 'Live'){
                            SchedulLineItem.Lecture_Status__c='LIVE';
                        }
                     SchedulLineItem.BWPS_StartTime__c=sc.BWPS_StartTime__c;
                     SchedulLineItem.BWPS_EndTime__c=sc.BWPS_EndTime__c;
                     SchedulLineItem.BWPS_Integrity__c=sc.Integrity__c;
                    if(sc.Vimeo_External_Key__c!=null && sc.Vimeo_External_Key__c!=''){
                     SchedulLineItem.Vimeo_External_Sub_Key__c=sc.Vimeo_External_Key__c+'Day'+i;
                    }
                    SchedulLineItem.BWPS_ClassDay__c = ThatdayOfWeek;
                    ScheduleLineItemInsert.add(SchedulLineItem);
                }
                StartdateCal += 1;                
            }
        }
        Insert ScheduleLineItemInsert;
    }
    Public static void UpdateScheduleLineItems(Map<Id,Schedule_Class__c> NewUpdateScheduleItemsMap,Map<Id,Schedule_Class__c> OldUpdateScheduleItemsMap){
        System.debug('RecordTypeRecurring'+RecordTypeRecurring);
        List<String>OldDaysList = New List<String>();
        List<String>NewDaysList = New List<String>();
        List<String> SCNewDaysList = new List<String>();
        List<String> SCOldDaysList = new List<String>();
        List<Schedule_Class_Line_Item__c> AddScheduleClassLineItem = New List<Schedule_Class_Line_Item__c>();
        List<Schedule_Class_Line_Item__c> RemoveScheduleClassLineItem = New List<Schedule_Class_Line_Item__c>();
        List<Schedule_Class_Line_Item__c> vimeoLinkScheduleClassLineItem = New List<Schedule_Class_Line_Item__c>();
        List<Schedule_Class_Line_Item__c> UdpateDataInLineItem = New List<Schedule_Class_Line_Item__c>();
        //Custom Label Access For Week Days  
        String vimeooldlink ;
        String vimeoNewLink;
        String WeekLabels = System.Label.BWPS_WeekDays;
        List<String> DaysList = WeekLabels.split(';');
        For(Id id : NewUpdateScheduleItemsMap.keySet()){
            If( NewUpdateScheduleItemsMap.get(Id).RecordTypeId==RecordTypeRecurring){
            String OldDays = OldUpdateScheduleItemsMap.get(Id).Schedule_Days__c;
            String NewDays = NewUpdateScheduleItemsMap.get(Id).Schedule_Days__c;
             vimeooldlink = OldUpdateScheduleItemsMap.get(Id).Vimeo_External_Key__c;
             vimeoNewLink = NewUpdateScheduleItemsMap.get(Id).Vimeo_External_Key__c;
            System.debug('NewDays '+NewDays);
            system.debug('OldDays '+OldDays);
             SCOldDaysList = OldDays.split(';');
            SCNewDaysList = NewDays.split(';');
            System.debug('SCOldDaysList '+SCOldDaysList);
            System.debug('SCNewDaysList '+SCNewDaysList);
             System.debug('DaysList '+DaysList);
                
            For(String Day:DaysList){
                System.debug('innerDaysList'+Day);
            If(!(SCNewDaysList.contains(Day) && SCOldDaysList.contains(Day))){
                If(SCNewDaysList.contains(Day)) {
                    NewDaysList.add(Day);
                }
                 else if(SCOldDaysList.contains(Day)){
                    OldDaysList.add(Day);
                }
            }
          }
                
            }     
        }
        If(SCNewDaysList.size()>0){
      For(Schedule_Class__c sc:NewUpdateScheduleItemsMap.values()) {
            Date Startdate = sc.BWPS_Date__c;
            Datetime StartDateCon = (DateTime)Startdate;
            String dayOfWeek = StartDateCon.format('EEEE');
            Integer calDays = (Integer)sc.BWPS_ClassFrequency__c*7;
            Date LastDateofClass = Startdate +calDays;
            Date StartdateCal = (Date) sc.BWPS_Date__c;
            System.debug('StartdateCal '+StartdateCal);
            Integer count = 1;
            For(Integer i=1;i<=calDays;i++){    
                System.debug('caqlDays'+calDays);
                Schedule_Class_Line_Item__c AddSchedulLineItemList = New Schedule_Class_Line_Item__c();
            Datetime StartDateIncrease = (DateTime)StartdateCal;
             System.debug('StartDateIncrease '+StartDateIncrease);
            String ThatdayOfWeek = StartDateIncrease.format('EEEE');
                System.debug('ThatdayOfWeek '+ThatdayOfWeek);
                If(NewDaysList.contains(ThatdayOfWeek)){
                    AddSchedulLineItemList.Schedule_Class__c = sc.Id;
                    AddSchedulLineItemList.Name = sc.Name+' '+calDays;
                    AddSchedulLineItemList.BWPS_ClassDate__c = StartdateCal;
                    AddSchedulLineItemList.BWPS_Status__c='Active';
                    if(sc.Schedule_Type__c == 'Hybrid'){
                             AddSchedulLineItemList.Lecture_Status__c='HYBRID';
                        }
                        else if(sc.Schedule_Type__c == 'In Person'){
                            AddSchedulLineItemList.Lecture_Status__c='IN-PERSON';
                        }
                        else if(sc.Schedule_Type__c == 'Live'){
                            AddSchedulLineItemList.Lecture_Status__c='LIVE';
                        }
                    AddSchedulLineItemList.BWPS_StartTime__c=sc.BWPS_StartTime__c;
                    AddSchedulLineItemList.BWPS_EndTime__c=sc.BWPS_EndTime__c;
                    AddSchedulLineItemList.BWPS_Integrity__c=sc.Integrity__c;
                    AddSchedulLineItemList.BWPS_ClassDay__c = ThatdayOfWeek;
                    AddScheduleClassLineItem.add(AddSchedulLineItemList);
                    system.debug('AddSchedulLineItemList '+AddSchedulLineItemList);
                }
                StartdateCal += 1;                
            }
        }  
        }
        List<Schedule_Class_Line_Item__c> GetScheduleClassLineItems = [SELECT Id,Schedule_Class__c,BWPS_ClassDate__c,BWPS_Status__c,BWPS_ClassDay__c FROM Schedule_Class_Line_Item__c WHERE Schedule_Class__c IN:NewUpdateScheduleItemsMap.keyset()];
        if(SCOldDaysList.size()>0){
        For(Schedule_Class__c SchClass:NewUpdateScheduleItemsMap.values()){
            For(Schedule_Class_Line_Item__c SchClassLinItem :GetScheduleClassLineItems){
                If(SchClassLinItem.Schedule_Class__c == SchClass.Id){
                    If(OldDaysList.contains(SchClassLinItem.BWPS_ClassDay__c)){
                    SchClassLinItem.BWPS_Status__c = 'Deactive';
                    RemoveScheduleClassLineItem.add(SchClassLinItem);
                }
              }
            }
             
        }
        }
        
        For(Schedule_Class__c SchClass:NewUpdateScheduleItemsMap.values()){
            For(Schedule_Class_Line_Item__c SchClassLinItem :GetScheduleClassLineItems){
                If(SchClassLinItem.Schedule_Class__c == SchClass.Id){
                     Date StartdateCal = (Date) SchClass.BWPS_Date__c;
                     System.debug('StartdateCal '+StartdateCal);
                    Datetime StartDateIncrease = (DateTime)StartdateCal;
                    System.debug('StartDateIncrease '+StartDateIncrease);
                    String ThatdayOfWeek = StartDateIncrease.format('EEEE');
                     System.debug('ThatdayOfWeek '+ThatdayOfWeek);
                    SchClassLinItem.Schedule_Class__c = SchClass.Id;
                    SchClassLinItem.Name = SchClass.Name ;
                     if(SchClass.Schedule_Type__c == 'Hybrid'){
                             SchClassLinItem.Lecture_Status__c='HYBRID';
                        }
                        else if(SchClass.Schedule_Type__c == 'In Person'){
                            SchClassLinItem.Lecture_Status__c='IN-PERSON';
                        }
                        else if(SchClass.Schedule_Type__c == 'Live'){
                            SchClassLinItem.Lecture_Status__c='LIVE';
                        }
                    SchClassLinItem.BWPS_ClassDate__c = StartdateCal;
                    SchClassLinItem.BWPS_Status__c=SchClass.BWPS_Status__c;
                    SchClassLinItem.BWPS_StartTime__c=SchClass.BWPS_StartTime__c;
                    SchClassLinItem.BWPS_EndTime__c=SchClass.BWPS_EndTime__c;
                    SchClassLinItem.BWPS_Integrity__c=SchClass.Integrity__c;
                    SchClassLinItem.BWPS_ClassDay__c = ThatdayOfWeek;
                    UdpateDataInLineItem.add(SchClassLinItem);
              }
            }
        }
         if(vimeooldlink!=vimeoNewLink){
                      For(Schedule_Class__c SchClass:NewUpdateScheduleItemsMap.values()){
                          integer count = 1;
            For(Schedule_Class_Line_Item__c SchClassLinItem :GetScheduleClassLineItems){
                 If(SchClassLinItem.Schedule_Class__c == SchClass.Id){
             if(SchClass.Vimeo_External_Key__c!=null && SchClass.Vimeo_External_Key__c!=''){
                     SchClassLinItem.Vimeo_External_Sub_Key__c=SchClass.Vimeo_External_Key__c+'Day'+count;
                    }   
                else if(SchClass.Vimeo_External_Key__c=='' || SchClass.Vimeo_External_Key__c==null){
                    SchClassLinItem.Vimeo_External_Sub_Key__c=SchClass.Vimeo_External_Key__c;
                }
                count++;
                vimeoLinkScheduleClassLineItem.add(SchClassLinItem);
            }
            }
           }            
         }
         If(vimeoLinkScheduleClassLineItem.size()>0){
            Database.Update(vimeoLinkScheduleClassLineItem,false);
        }
        If(AddScheduleClassLineItem.size()>0){
            system.debug('inside insert');
            //Database.Insert(AddScheduleClassLineItem,false);
            system.debug('AddScheduleClassLineItem.size() '+ AddScheduleClassLineItem.size());
            Insert AddScheduleClassLineItem;
            system.debug('AddScheduleClassLineItem.size() lll '+ AddScheduleClassLineItem.size());
        }
        If(RemoveScheduleClassLineItem.size()>0){
            Database.Update(RemoveScheduleClassLineItem,false);
        }
        system.debug('UdpateDataInLineItem '+UdpateDataInLineItem);
          If(UdpateDataInLineItem.size()>0){
          system.debug('inside update');     
              system.debug('UdpateDataInLineItem.size() '+ UdpateDataInLineItem.size());     
        //Database.Update(UdpateDataInLineItem,false);
            Update UdpateDataInLineItem;
        }
    }

}