global class DeactiveGuestUser implements Schedulable {
   global void execute(SchedulableContext sc) {
      DeactivateUsers Deactiveuser = new DeactivateUsers(); 
      Database.executeBatch(Deactiveuser);
   }
}