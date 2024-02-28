trigger ContentDocumentLinkTrigger on ContentDocumentLink (before insert, after insert) {
    if(Trigger.isAfter && Trigger.isInsert){
        ContentDocumentLinkHelper.GeneratePublicLink(trigger.new);
    } 
    
}