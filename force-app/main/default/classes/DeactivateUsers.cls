global class DeactivateUsers implements Database.Batchable<SObject>
{
    public dateTime dt = date.today().addDays(-14);
    Public String profile11 = 'Guest User';
   public String query = 'SELECT Name,IsActive, IsPortalEnabled, LastLoginDate, Id, user.profile.name From User WHERE IsActive = true AND CreatedDate <: dt AND user.profile.name =: profile11 ';
  global Database.querylocator start(Database.BatchableContext bc)
  {
    return Database.getQueryLocator(query);
  }
  global void execute(Database.BatchableContext bc,List<User> records)
  {
    List<User> userList = new List<User>();
    for(User u : records)
    {
 if(u.IsActive || u.IsPortalEnabled ){
    u.IsActive = false;
    //u.IsPortalEnabled = false;
    userList.add(u);
  }
    }
    if(userList.size() > 0)
    {
      update userList;
    }
  }
  global void finish(Database.BatchableContext bc){
       //DeactiveGuestUser m = new DeactiveGuestUser();
       //String sch = '0 45 23 1/1 * ? *';
       //String jobID = System.schedule('Merge Job', sch, m);
  }
}