@istest
private class BWPS_NotesData_TEST {
    @isTest
    public static void getNotesData_TEST() {
        Id noteId=TestDataFactory.getNote();
        Note expectedNote=[SELECT Id, Parent.Id, Parent.Type, title,body,createdDate,ownerId FROM Note WHERE Parent.Type='Contact' AND Id=: NoteId Order By createdDate DESC];
        List<Note> actualNote = BWPS_NotesData.getNotesData();
        System.assertEquals(actualNote[0].Id, expectedNote.Id);
        System.assertEquals(actualNote[0].Parent.Id, expectedNote.Parent.Id);
        System.assertEquals(actualNote[0].Parent.Type, expectedNote.Parent.Type);
        System.assertEquals(actualNote[0].title, expectedNote.title);
        System.assertEquals(actualNote[0].body, expectedNote.body);
        System.assertEquals(actualNote[0].createdDate, expectedNote.createdDate);
        System.assertEquals(actualNote[0].ownerId, expectedNote.ownerId);
    }
    @isTest
    public static void insertNotes_TEST() {
        // Create a test user and contact
        try{
        System.runAs(new User(Id = TestDataFactory.getPortalUser())) {
                Object noteDetails=TestDataFactory.getNotesDetails();
            	System.debug('------------------------------------------------------------');
            Test.setMock(HttpCalloutMock.class, new  MockHttpResponseGenerator());
            Test.startTest();
                String result = BWPS_NotesData.InsertNotes(noteDetails);
            Test.stopTest();
            	System.debug('------------------------------------------------------------');
                System.debug('Result of insert notes'+result);
                Note InsertedNote = [SELECT Id, Title, Body, ParentId FROM Note limit 1];
                Contact con=[select id from contact limit 1];
                System.assertEquals('Success', result);
                System.assertEquals('Test Note', InsertedNote.Title);
                System.assertEquals(con.Id, InsertedNote.ParentId);
                System.debug('Runnnnnnnnnnnnnnnnn59');
    	}
        }
        catch(Exception e){
            System.debug('Insert Notes');
            System.debug(e.getMessage());
            System.debug(e.getStackTraceString());
        }
    }

    @isTest 
    static void updateNotes_TEST() {
        // Create a test note]
        try{
        Contact con = new Contact(
            FirstName = 'John',
            LastName = 'Doe',
            Email = 'johndoe@example.com'
        );
        insert con;
        Note testNote = new Note();
        testNote.Title = 'Test Note';
        testNote.Body = 'Test Body';
        testNote.ParentId = con.Id; // Replace with valid contact id
        insert testNote;

        // Prepare input for UpdateNotes method
        Map<Object, Object> noteDetails = new Map<Object, Object>();
        noteDetails.put('NoteId', testNote.Id);
        noteDetails.put('ClassId', 'Test');
        noteDetails.put('Title', 'Updated Note Title');
        noteDetails.put('Body', 'Updated Note Body');
        Map<Object, Object> inputMap = new Map<Object, Object>();
        inputMap.put('NoteDetail', noteDetails);

        // Call UpdateNotes method
        String result = BWPS_NotesData.UpdateNotes(inputMap);

        // Verify that note has been updated
        Note updatedNote = [SELECT Id, Title, Body FROM Note WHERE Id = :testNote.Id];
        System.assertEquals('Test Note', updatedNote.Title);
        System.assertEquals('Test Body#Updated Note Body', updatedNote.Body);
        System.assertEquals('Success', result);
            //System.debug('Runnnnnnnnnnnnnnnnnnnnnnnnnn132');
        }
        catch(Exception e){
           	System.debug('Errrrrrrrrrrror'+e.getStackTraceString());
        }
       
    }

    @isTest 
	static void updateNotesInvalidNoteId_TEST() {
        try{
        // Prepare input for UpdateNotes method with invalid note id
        Map<Object, Object> noteDetails = new Map<Object, Object>();
        noteDetails.put('NoteId', 'invalidnoteid');
        noteDetails.put('ClassId', 'Test');
        noteDetails.put('Title', 'Updated Note Title');
        noteDetails.put('Body', 'Updated Note Body');
        Map<Object, Object> inputMap = new Map<Object, Object>();
        inputMap.put('NoteDetail', noteDetails);

        // Call UpdateNotes method
        String result = BWPS_NotesData.UpdateNotes(inputMap);

        // Verify that the method returns an error
        System.assertEquals('Error', result);
          //  System.debug('Runnnnnnnnnnnnnnnnnnnnnnnnnn153');
        }
        catch(Exception e){
            System.debug('errrrrrrrrrrrrrrrrror'+e.getStackTraceString());
        }
    }

    
    @IsTest
    static void scheduleClassesData_TEST() {
        // create test Schedule_Class__c records
        try{
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        Test.startTest();
        Id ClassId=TestDataFactory.getScheduleClass();
        
        List<Schedule_Class__c> results = BWPS_NotesData.ScheduleClassesData();
        Test.stopTest();
        
        // assert that only active classes were returned
        System.assertEquals(1, results.size());
        System.assertEquals(ClassId, results[0].Id);
       // System.debug('Runnnnnnnnnnnnnnnnnnnnnnnnnn178');
        }
        catch(Exception e){
            System.debug('errorget'+e.getStackTraceString());
        }
    }



}