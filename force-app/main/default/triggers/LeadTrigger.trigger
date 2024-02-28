trigger LeadTrigger on Lead (before insert) {
    If(trigger.isAfter && trigger.isInsert && GlobalVariables.oneTimecall==false){
                     BWPS_ShareScheduleClass.CreateLeadforScheduleClassshared(Trigger.New);
    } 
}