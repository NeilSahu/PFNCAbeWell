trigger CaseTrigger on Case (After insert) {
    If(Trigger.isAfter && Trigger.isInsert && GlobalVariables.oneTimecall==false){
        SendMailNeedHelp.sendingEmail(Trigger.New);
    }
    
}