public class BWPS_attendeeRequest{
   public  List<Attendee> request;
    public class Attendee {
     public  String Attendeeid;
     public   String attendance;
     public   String scheduleId; 
    }
    public static BWPS_attendeeRequest parse(String json){
        return (BWPS_attendeeRequest) System.JSON.deserialize(json, BWPS_attendeeRequest.class);
    }
}