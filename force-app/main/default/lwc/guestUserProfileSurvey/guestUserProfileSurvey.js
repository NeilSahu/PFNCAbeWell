import { LightningElement,track,wire} from 'lwc';
import BELLICON  from '@salesforce/resourceUrl/Bell_Icon';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import fetchProfileDetails from '@salesforce/apex/BWPS_LoginUserProfileCtrl.fetchProfileDetails';
import imageResoure from '@salesforce/resourceUrl/WebsiteGeneralHeader';

export default class GuestUserProfileSurvey extends LightningElement {

    img_background = imageResoure + '/Profile_Survey_Background_Image.png';

        editProfile = ' ';

      @wire(fetchProfileDetails)
    Rec({ error, data }) {

        if (data) {

        console.log(">>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<");
        console.log("data[0].Email__c: ",data)
            // this.editProfile = data[0].Email__c;
            // this.handleData();

            this.editProfile = 'COMPLETE YOUR PROFILE';

            if(data[0].Email__c == undefined || data[0].Email__c == null || data[0].Email__c == ''){
              this.editProfile = 'COMPLETE YOUR PROFILE';
            }
            else{
              this.editProfile = ' Edit your profile ';
            }
        }
        else if (error) {
            console.log('error ', error);
        }
    }

    // handleData() {
    //   if(this.editProfile != null || this.editProfile == undefined )
    //   {
    //     this.editProfile = ' Edit your profile ';
    //     console.log('edit',this.editProfile)
    //   }
    //   else{
    //     this.editProfile = 'COMPLETE YOUR PROFILE';
    //   }
      
    // }


    BELLICON=BELLICON;
     @track  showNotificationFlag = false;
    @track notrecords=[];
    @track notificationVisibel=[];
    @track totalNotifications =0;

      showNotificationMethod(){
       console.log('OUTPUT1 : ');
       this.showNotificationFlag = !this.showNotificationFlag;
     }
    
        @wire(fetchNotification)
   wiredData({ data, error }) {
    if(data != null && data != '' && data != undefined){
    var notificationData =  JSON.parse(JSON.parse(data));
    var firstLoop = true;
    for(let i= 0;i<notificationData.notifications.length;i++){
      var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
      var todayDate = new Date();
      var timeinMilliSec = todayDate-nottificationdate+'ago';
    if(notificationData.notifications[i].read == false){
      this.totalNotifications+=1;
     }
     var obj = {
       id:notificationData.notifications[i].id,
       Name:'Kirsten Bodensteiner',
       image:notificationData.notifications[i].image,
       Active__c : timeinMilliSec,
       Message__c:notificationData.notifications[i].messageBody,
     }
     this.notrecords.push(obj);
     if(firstLoop){
     this.notificationVisibel.push(obj);
     firstLoop=false;
     }
    
    }
    
    } else {
       console.log('errorfghgg>>> ',JSON.stringify(error));
    }
    }

    saveButton()
    {
        window.open('/PFNCADNA/s/guestuserprofilesurveyform','_self');
    }
}