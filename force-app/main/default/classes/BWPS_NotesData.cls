public with sharing class BWPS_NotesData {
    @AuraEnabled
    public static list<Note> getNotesData(){
        List<Note> NotesData = new List<Note>();
        Id UserId = userInfo.getUserId(); 
        try {
            NotesData =[SELECT Id, Parent.Id, Parent.Type, title,body,createdDate,ownerId FROM Note WHERE Parent.Type='Contact' AND OwnerId =:UserId Order By createdDate DESC];
        } catch (Exception e) {
            System.debug('Exception occured '+e.getLineNumber());
            System.debug('Exception message '+e.getMessage());
            // throw new AuraHandledException(e.getMessage());
        }
        return NotesData;
    }

    @AuraEnabled
    public static void deleteNote(String noteId){
        List<Note> NotesData =[SELECT Id FROM Note where Id = :noteId];
        delete NotesData;
    }

    @AuraEnabled
    public static String InsertNotes(object NotesDetails){
        try{
           note InsertNote = New note();
                 Id UserId = userInfo.getUserId(); 
                  user UserDetails = new  user();
                  String ConparentID ;
                    UserDetails  = [SELECT ID,Name,ContactId FROM User WHERE Id =:UserId];
                    ConparentID = UserDetails.ContactId;
                    System.debug('UserDetails '+UserDetails);
                     System.debug('UserId '+UserId);
                       System.debug('ConparentID '+ConparentID);
                 String ClassId='';
                  Map<Object,Object> NotemapCopy=(Map<Object,Object>)NotesDetails ;
                    Map<Object,Object>  NoteDetailsMap= (Map<Object,Object>)NotemapCopy.get('NoteDetail');
                    String desctemp = String.valueOf(NoteDetailsMap.get('Body'));
                     ClassId = String.valueOf(NoteDetailsMap.get('ClassId'));
                     String FinalDesc = ClassId +' #'+ desctemp;
                    InsertNote.Title = String.valueOf(NoteDetailsMap.get('Title'));
                    InsertNote.body = FinalDesc;
                    InsertNote.parentId = ConparentID;
                    Database.Insert(InsertNote,true);
                    System.debug('Note Created Id' +InsertNote.Id);
                    return 'Success';
                     
          }
          catch(Exception e){
              System.debug('Exception occured '+e.getLineNumber());
              System.debug('Exception message '+e.getMessage());
              return 'Error';
          }
    }
    @AuraEnabled
    public static String UpdateNotes(object NotesDetails){
        try{
                // Id UserId = userInfo.getUserId(); 
                // if(UserId!='' || UserId !=NULL){
                //   user UserDetails  = [SELECT ID,Name,ContactId FROM User WHERE Id =:UserId];
                // System.System.debug('UserDetails '+UserDetails);
                // System.System.debug('UserId '+UserId);
                // }   
                      String ClassId='';
                    Map<Object,Object> NotemapCopy=(Map<Object,Object>)NotesDetails ;
                    Map<Object,Object>  NoteDetailsMap= (Map<Object,Object>)NotemapCopy.get('NoteDetail');
                    String descbody = String.valueOf(NoteDetailsMap.get('Body'));
                     String desctemp = String.valueOf(NoteDetailsMap.get('Body'));
                     ClassId = String.valueOf(NoteDetailsMap.get('ClassId'));
                     String FinalDesc = ClassId +' #'+ desctemp;
                    Id noteId = String.valueOf(NoteDetailsMap.get('NoteId'));
                    System.debug('logLevel msg '+descbody);
                    Note notedata = [SELECT Id,Title,body FROM Note WHERE Id =:noteId];
                     List<String>bodydesc = new list<String>();
                     bodydesc =notedata.Body.split('#');
                     notedata.body = bodydesc[0] +'#'+descbody;
                    Database.update(notedata,true);
                    System.debug('Note updaated Id' +notedata.Id);
                    return 'Success';
                     
          }
          catch(Exception e){
              System.debug('Exception occured '+e.getLineNumber());
              System.debug('Exception message '+e.getMessage());
              return 'Error';
          }
    }
    @AuraEnabled
    public static List<Schedule_Class__c> ScheduleClassesData(){
        List<Schedule_Class__c> scheduleClasses = new List<Schedule_Class__c>();
        try {
            scheduleClasses = [SELECT Id, Name,BWPS_instructor__c FROM Schedule_Class__c WHERE BWPS_Status__c = 'Active'];
            
        } catch (Exception e) {
            //throw new AuraHandledException(e.getMessage());
            System.debug('Exception occured '+e.getLineNumber());
            System.debug('Exception message '+e.getMessage());
        }
        return scheduleClasses;
    }
}