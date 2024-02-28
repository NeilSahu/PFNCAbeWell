import { LightningElement,track, wire } from 'lwc';
import myResource from '@salesforce/resourceUrl/DNAIcon';
import myResources from '@salesforce/resourceUrl/Bell_Icon';
import myImage from '@salesforce/resourceUrl/ExerciseImage';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import markAsRead from '@salesforce/apex/Bwps_getuserNotification.markAsRead';
import { refreshApex } from '@salesforce/apex';

export default class NotificationFullComponent extends LightningElement {
    @track bellIcon = myResources
    @track filterIcon = myResource+"/DNAIcons/filterIcon.png";
    @track levelIcon = myResource+"/DNAIcons/levelIcon.png";
    @track shareIcon = myResource+"/DNAIcons/shareIcon.png";
    @track userIcon = myResource+"/DNAIcons/userIcon.png";
    @track likeIcon = myResource+"/DNAIcons/likeIcon.png";
    @track ExerciseImage = myImage;
    @track showClassesOfWeek = false;
    @track isEmpty = true;
    @track totalNotifications = 0;
    @track visibleRecords = [];
    //@track totalUnseenMsg = 0;
    @track totalRecords = [];
    @track notificationList = [];
    @track apexObj = {};
    connectedCallback(){
       // this.visibleRecords = this.totalRecords;
        // this.totalNotifications = this.visibleRecords.length;
        // this.totalNotifications = this.totalRecords.length;
        // var e = [...this.template.querySelector(".btn")];
        // console.log(e,' EEE');
        // console.log(this.template.querySelector(".btn"));
    }

    @track allNotications;

    @wire(fetchNotification)
    wiredData(wireNotification) {
      const {error,data} = wireNotification;
      this.allNotications = wireNotification;
      this.totalRecords =[];
      this.notificationList = [];
     if(data != null && data != '' && data != undefined){
     console.log(data);
     console.log('yourNotification>>> ',JSON.parse(data));
     var notificationData =  JSON.parse(JSON.parse(data));
     console.log(typeof notificationData);
     console.log('notificationData.notifications ', notificationData.notifications);
     console.log('notificationDatsize ', notificationData.notifications.length);
     for(let i= 0;i<notificationData.notifications.length;i++){
       var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
       var todayDate = new Date();
       var timeinMilliSec = todayDate-nottificationdate;
       console.log("log",timeinMilliSec);
       var seconds = Math.floor(timeinMilliSec / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        
        console.log('OUTPUT NEW: ',minutes,seconds,hours);
        if (seconds < 60 && hours==0 && minutes==0){
            timeinMilliSec = seconds + ' sec ago';
        }
        else if(seconds > 60 && hours==0 && minutes < 60 ){
            timeinMilliSec = minutes +' min ago';
        }
        else if(seconds > 60 && hours <24 && minutes > 60 ){
            timeinMilliSec = hours +' hr ago';
        }
          else {
              timeinMilliSec = '1 day ago';
          }

        if(notificationData.notifications[i].read == false){
          //this.totalNotifications+=1;
          this.notificationList.push(notificationData.notifications[i].id);
        }
       console.log('loop>> ');
      var obj = {
        id:notificationData.notifications[i].id,
        Name: notificationData.notifications[i].messageTitle,
        image:notificationData.notifications[i].image,
        Active__c : timeinMilliSec,
        Message__c:notificationData.notifications[i].messageBody,
        ButtonColor: notificationData.notifications[i].read ? 'readClass':'unReadClass',
      }
      console.log('object created');
      this.totalRecords.push(obj);
      console.log('notify list : ', JSON.stringify(this.notificationList));
     }
     this.totalNotifications = this.totalRecords.length;
     if(this.totalNotifications > 0 ){
        this.isEmpty = false;
     }
      this.apexObj = {
        "notificationIds":this.notificationList,
        "read" : true,
      }
      console.log('apexObj : ',JSON.stringify(this.apexObj));
     
     
     } else {
        console.log('errorfghgg>>> ',JSON.stringify(error));
     }
    }



    // @wire(fetchNotification)
    // wiredData({ data, error }) {
    //  if(data != null && data != '' && data != undefined){
    //  console.log(data);
    //  console.log('yourNotification>>> ',JSON.parse(data));
    //  var notificationData =  JSON.parse(JSON.parse(data));
    //  console.log(typeof notificationData);
    //  console.log('notificationData.notifications ', notificationData.notifications);
    //  console.log('notificationDatsize ', notificationData.notifications.length);
    //  for(let i= 0;i<notificationData.notifications.length;i++){
    //    var nottificationdate = new Date(notificationData.notifications[i].mostRecentActivityDate);
    //    var todayDate = new Date();
    //    var timeinMilliSec = todayDate-nottificationdate+'ago';
    //     if(notificationData.notifications[i].read == false){
    //       this.totalNotifications+=1;
    //       this.notificationList.push(notificationData.notifications[i].id);
    //     }
    //    console.log('loop>> ');
    //   var obj = {
    //     id:notificationData.notifications[i].id,
    //     Name:'Kirsten Bodensteiner',
    //     image:notificationData.notifications[i].image,
    //     Active__c : timeinMilliSec,
    //     Message__c:notificationData.notifications[i].messageBody,
    //   }
    //   console.log('object created');
    //   this.totalRecords.push(obj);
    //   console.log('notify list : ', JSON.stringify(this.notificationList));
    //  }
    //   this.apexObj = {
    //     "notificationIds":this.notificationList,
    //     "read" : true,
    //   }
    //   console.log('apexObj : ',JSON.stringify(apexObj));
     
     
    //  } else {
    //     console.log('errorfghgg>>> ',JSON.stringify(error));
    //  }
    // }

    notificationMarkread(){
      markAsRead({jsonstring:this.apexObj}).then(
            result =>{
              console.log("result1",result)
              refreshApex(this.allNotications);

            }
            
        ).catch(error => {
            console.log('error>>> ',JSON.stringify(error));
        });
    }
}