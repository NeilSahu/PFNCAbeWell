import { LightningElement,wire,track } from 'lwc';
import Achievements1 from '@salesforce/resourceUrl/Achievements1';
import badge1 from '@salesforce/resourceUrl/badge1';
import Close from '@salesforce/resourceUrl/Close';
import BELLICON  from '@salesforce/resourceUrl/Bell_Icon';
import fetchCardsDerail from '@salesforce/apex/BWPS_InstructorClassProfile.fetchAchievementDetail';
import fetchNotification from '@salesforce/apex/Bwps_getuserNotification.getUserNotification';
import clossButton from '@salesforce/resourceUrl/PreNextButton';
import getAllAchievements from '@salesforce/apex/BWPS_AchievementData.getAllAchievements';
//import fetchImage from '@salesforce/apex/BWPS_InstructorClassProfile.fetchImage';
export default class Achievement extends LightningElement {

     close = clossButton+"/Close_Icon.svg";
     Achievements1=Achievements1;
     BELLICON=BELLICON;
     badge1 = badge1;
     Close = Close;
     @track AchievementDetails = [];
     showAch = false;
     response= [];
     currentArray =[];
    bagesEarned ;   
  @track  showNotificationFlag = false;

    @track notrecords=[];
    @track notificationVisibel=[];
    @track totalNotifications =0;

     get bgImageStyle() {
    return `background-image: url(${Achievements1})`;
    }

     
    
    handleShowAch(){
        this.showAch = true;
    }
    handleHideAch(){
        this.showAch = false;
    }

    connectedCallback() {
      getAllAchievements()
      .then((result) => {
        this.AchievementDetails = [];
        console.log('inside achievements',JSON.stringify(result));
         var obj = {};
         let arr = [];
        console.log('gffgfg ',result);
        var count = result.length;
        console.log('count',count);
        if(count >=1 && count<10){
           console.log('first');
           obj = {
                   "Badge": "Badge 1",
                   "imgUrl": BELLICON,
                   "id" : "1",
               }
        }
        else if(count >=10 && count<25){
          console.log('second');
          var i = 0;
          for( i=0;i<2;i++){
            if(i == 0){
                obj = {
                   "Badge": "Badge 1",
                   "imgUrl": BELLICON,
                    "id" : "1",
               }
            }
            else if(i == 1){
              obj = {
                   "Badge": "Badge 1",
                   "imgUrl": badge1,
                    "id" : "2",
               }
            }            
          }           
        }
         else if(count >=25 && count<50){
          var i = 0;
          console.log('third');
          for( i=0;i<3;i++){
            if(i == 0){
                obj = {
                   "Badge": "Badge 1",
                   "imgUrl": BELLICON,
                    "id" : "1",
               }
            }
            else if(i == 1){
              obj = {
                   "Badge": "Badge 1",
                   "imgUrl": badge1,
                    "id" : "2",
               }
            }  
            else if(i == 2){
              obj = {
                   "Badge": "Badge 1",
                   "imgUrl": Achievements1,
                    "id" : "3",
               }
            }            
          }           
        }
        console.log('after all conditions');
         console.log('count last' , count);
         if(count >1){
             arr.push(obj);
         }
           console.log('arr ', JSON.stringify(arr));
           console.log('arr ', arr.length);
           this.AchievementDetails = arr;
           console.log(' this.AchievementDetails ', JSON.stringify( this.AchievementDetails));

      }).catch((err) => {
          console.log('error occured',JSON.stringify(err),err.message);
      });
    }

      @wire(fetchCardsDerail)
      Record({ error, data }) {
        if (data) {

        this.response = data;
        this.bagesEarned =data.length;
        console.log("response77", this.currentArray);
        console.log("thibjnbs",this.bagesEarned);

        }
        else if (error) {
        console.log('error ',error);
        }
  }

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
       

    //   currentArray =
    // [
    //    //{ "Badge": "Badge 1","imgUrl":BELLICON },
    //   //   { "Badge": "Badge 2","imgUrl":Achievements1 },
    //   //   { "Badge": "Badge 3","imgUrl":Achievements1 },
    //   //         { "Badge": "Badge 4","imgUrl":BELLICON },
    //   //  { "Badge": "Badge 5","imgUrl":Achievements1 },
    //   //   { "Badge": "Badge 6","imgUrl":Achievements1 },
      
    //   ]
    }
    }
}